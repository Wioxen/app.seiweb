var dataDireitos = undefined;
var modalDireitos = undefined;
var TbDireitos = undefined;

const resourceDireitos = 'Role';

function exibeDireitos(data) {
	const defaultColumns = [{ 
		data: 'descricao',              
		orderable: false,
		"width": "80%"
	},
	{
		data: 'id',
		orderable: false,
		"width": "8%",
		"render": function(data, type, row) {
			return `<div class="dropdown">
			<button class="btn btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
			<i class="fa fa-ellipsis-h"></i>
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
			<li><a class="dropdown-item" href="#" onclick="EditarDireitosClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
			</ul>
			</div>`                        
		}
	}];  
	
    var modalTbDireitos = createDynamicModal();        
	
	modalTbDireitos.find('.modal-title').text('Direitos do usuário');
	modalTbDireitos.find('.modal-dialog').addClass('modal-lg');
	modalTbDireitos.find('.modal-body')
	.html(`<table id="${resourceDireitos}Tb" class="row-border stripe hover" style="width:100%"></table>`)
	modalTbDireitos.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoDireitosClick(this);">
		<i class="icon-plus me-2"></i>Novo Cadastro
		</button>
	</div>`);
	
	TbDireitos = CarregaDataTable({
		resource: resourceDireitos+'/datatable',
		modal: modalTbDireitos,
		columns: defaultColumns,
	});	
}

function DireitosClick(e){
	RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourcePessoa}/acesso`,
		success: exibeDireitos
	});  	
}

function exibeLoadDireitos(response, status, xhr){
	preencherFormularioCompleto(dataDireitos, '#frmDireitos');
}

function ResetDefaultDireitos(onLoadCallback){
    hideLoadingModal();
    
    modalDireitos = createDynamicModal(function(){
        dataDireitos = null;
	});        
	
    modalDireitos.find('.modal-header-search').hide();
	
	/*Create modal*/
    modalDireitos.find('.modal-title').text('Direitos');
    modalDireitos.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-lg');
    modalDireitos.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarDireitosClick(this);"><i class="icon-close"></i> Cancelar</button>
		<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirDireitosClick(this);"><i class="icon-trash"></i> Excluir</button>
		<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarDireitosClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    /*carregarTemplateModal({
        modal: modalDireitos,       
        template: 'templates/Direitos.html #frmDireitos',
		onLoad: exibeLoadDireitos,
		onModal: onModalCallback
	});*/
	modalDireitos.find('.modal-body').empty().load(
		'templates/Direitos.html #frmDireitos', 
		function(response, status, xhr) {
			if (typeof onLoadCallback === 'function') {
				onLoadCallback(response, status, xhr);
			} 			
		});
}

function NovoDireitosClick(e){
    event.preventDefault();
    
    dataDireitos = {id: 0, descricao: null};
	
    ResetDefaultDireitos(function(){
		RestRequest({
			method: 'GET',
			beforeSend: function(xhr){
				showLoadingModal();
			},
			url: $baseApiUrl+"DireitosUsuario",
			success: exibeAcessos
		});	
	})  
}

function CancelarDireitosClick(){
    dataDireitos = undefined;
    modalDireitos.modal('hide');
}

function EditarDireitosClick(e){
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceDireitos+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			dataDireitos = response;
			ResetDefaultDireitos(function(){
				$('#DireitosDescricao').val(dataDireitos.descricao);
				RestRequest({
					method: 'GET',
					beforeSend: function(xhr){
						console.log(xhr);
					},
					url: $baseApiUrl+"DireitosUsuario",
					success: exibeAcessos
				});					
			});						
		}
	});  		
}

function SalvarDireitosClick(e){
    if ((dataDireitos !== undefined) && (dataDireitos !== null)){
        dataDireitos.descricao = StrToValue($('#DireitosDescricao').val());
		
        var _acessos = $('.form-check-input:checked').map(function() {
            return $(this).attr('id');
		}).get().join(',');
		
        dataDireitos.acessos = _acessos;
		
        RestRequest({
			method: (dataDireitos.id === 0 ? 'POST' : 'PUT'),
            url: $baseApiUrl+"Role"+(dataDireitos.id === 0 ? '' : `/${dataDireitos.id}`),
            data: dataDireitos,
			success: function (response, textStatus, jqXHR) {
				if (jqXHR.status === 201){
					dataDireitos.id = response.id;
				}                
				hideLoadingModal();
				modalDireitos.modal('hide');
				TbDireitos.ajax.reload();
			}
		});  
	}    
}

function ExcluirDireitosClick(e){
    if ((dataDireitos !== undefined) && (dataDireitos !== null)){
        if (dataDireitos.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"Role/"+dataDireitos.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarDireitosClick(e);
                            TbDireitos.ajax.reload();
						}, 500);                     
					});  
			});        
		}
	}
}

function exibeAcessos(response, status, xhr){
	$('#modulesList').empty();
	$('#moduleacessos').empty();
	
	hideLoadingModal();
	
	$.each(response,function(i,v){
		$('#modulesList').append(`<li class="list-group-item p-0">
			<a href="#" id="modulo${v.id}" data-id="${v.id}" class="list-group-item list-group-item-module border-0 list-group-item-action d-flex justify-content-between align-items-center">
			${v.titulo}
			<span class="badge bg-light text-dark rounded-pill">${v.menu}</span>
			</a>                            
		</li>`);
		
		$('#moduleBotao').append(`<button id="btn-modulo${v.id}" data-module="modulo${v.id}" class="btn btn-sm w-100 btn-light btn-module ${(i === 0) ? '':'d-none'}">Marcar Todos</button>`);                            
		
		$.each(v.acessos,function(idx,val){
			$('#moduleacessos').append(`<label class="list-group-item list-group-item-acesso d-none modulo${v.id}">
				<input id="${val.acesso}" class="form-check-input me-1 ${val.parent}" type="checkbox" data-parent="${val.parent}" value="">
				${val.title}
			</label>`);
		});                              
	});
		
	$('.form-check-input').change(CheckAcessoChange);	
	$('.btn-module').click(BtnModuleClick);                	
	$('.list-group-item-module').click(ItemModuleClick);	
	$('.list-group-item-module').first().trigger('click');	
	
	if ((dataDireitos.acessos !== null) && (dataDireitos.acessos !== undefined)){
		var _acessos = dataDireitos.acessos.split(',');
		
		$.each(_acessos,function(i,v){
			$('#'+v).prop('checked',true);
		});
	}

	modalDireitos.modal('show');
	
	setTimeout(() => {
		$('#DireitosDescricao').focus();
	}, 500);  	
}

function CheckAcessoChange(){
	const $this = $(this);
	
	if (($this.data('parent') === null) && ($('.'+$this.attr('id')).is(':checked')))
	{
		$this.prop('checked', true);
		return;
	} 
	
	const dataParent = $('#'+$this.data('parent'));
	
	// Verificação completa em uma linha
	if (!dataParent || !$(dataParent).length || !$(dataParent).is('input[type="checkbox"]')) {
		console.warn('data-parent inválido ou elemento não encontrado');
		return;
	}
	
	const $parentCheckbox = $(dataParent);
	
	if ($this.is(':checked')) {
		$parentCheckbox.prop('checked', true);
		} else if (!$parentCheckbox.is(':checked')) {
		$parentCheckbox.prop('checked', false);
	}
}

function BtnModuleClick(e){
	e.preventDefault();
	var $thisBotao = $(this);
	if ($.trim($thisBotao.text()) === 'Marcar Todos'){
		$thisBotao
		.text('Desmarcar Todos');
		$(`.${$thisBotao.data('module')}`).find('input[type="checkbox"]').prop('checked',true);
		} else {
		$thisBotao
		.text('Marcar Todos');
		$(`.${$thisBotao.data('module')}`).find('input[type="checkbox"]').prop('checked',false);
	}
}

function ItemModuleClick(){
	var $this = $(this);
	$('.list-group-item-module').removeClass('active');
	$this.addClass('active');
	
	$('.list-group-item-acesso').addClass('d-none');
	$('.'+$(this).attr('id')).removeClass('d-none');
	
	$('.btn-module').addClass('d-none');
	$('#btn-'+$(this).attr('id')).removeClass('d-none');
}