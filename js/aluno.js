var dataAluno = undefined;
var modalAluno = undefined;
var tbAluno = undefined;

const resourceAluno = "Aluno";

function exibeAluno(data) {
	const defaultColumns  = [
		{
			data: 'foto',
			orderable: false,
			"width": "6%",
			"render": function(data, type, row) {
				var _data = (data === null) ? 'assets/img/semfoto.png':$imageUrl+data;
				return `<img class="avatar-img rounded-circle" src="${_data}" style="width: 39px; height: 39px;" />`
			}
		},
		{ 
			data: null,              
			orderable: false,
			"width": "80%",
			"render": function(data, type, row) {
				return `<span>${row.descricao}</span>`
			}                    
		},
		{ 
			data: null,              
			orderable: false,
			"width": "5%",
			"render": function(data, type, row) {
				return `<span class="badge bg-secondary w-100">${data.rm}</span>`
			}                    
		},		
		{
			data: null,
			orderable: false,
			"width": "8%",
			"render": function(data, type, row) {
				return `<div class="dropdown">
				<button class="btn btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
				<i class="fa fa-ellipsis-h"></i>
				</button>
				<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
				<li><a class="dropdown-item" href="#" onclick="EditarAlunoClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
				</ul>
				</div>`                        
			}
		},
	];	
	
    var modalTbAluno = createDynamicModal();        
	
	modalTbAluno.find('.modal-title').html('<i class="fa-solid fa-user-graduate"></i> Alunos');
	modalTbAluno.find('.modal-dialog').addClass('modal-lg');
	modalTbAluno.find('.modal-body')
	.html(`<table id="AlunoTb" class="row-border stripe hover" style="width:100%"></table>`)
	modalTbAluno.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoAlunoClick(this);">
		<i class="icon-plus me-2"></i>Novo Cadastro
		</button>
	</div>`);
	
	tbAluno = CarregaDataTable({
		resource: 'Aluno/DataTable',
		modal: modalTbAluno,
		columns: defaultColumns
	});
	
}

function AlunoClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourceAluno}/acesso`,
		success: exibeAluno
	});  
}

function ResetDefaultAluno(onModalCallback){
    hideLoadingModal();
	
	/*Create modal*/
    modalAluno = createDynamicModal(function(){
        dataAluno = null;
	}); 
	
    modalAluno.find('.modal-title').text('Cadastrar Aluno');
    modalAluno.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-xl');
    modalAluno.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarAlunoClick(this);"><i class="icon-close"></i> Cancelar</button>
		<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirAlunoClick(this);"><i class="icon-trash"></i> Excluir</button>
		<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarAlunoClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalAluno.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalAluno,       
        template: 'templates/'+resourceAluno+'.html #frmAluno',
		onLoad: exibeLoadAluno,
		onModal: onModalCallback
	});                
}

function exibeLoadAluno(response, status, xhr)
{
	preencherFormularioCompleto(dataAluno, '#frmAluno');  
	
	LoadPessoaSelect2({
		container: '#SelectAluno',
		modal: modalAluno,
		url: $baseApiUrl+'pessoa/repositories',
		thisFoto: '#FotoAluno',
        change: function(data){
            if ((data !== null) && (data !== undefined)){
				dataAluno.pessoaId = data.id;				
				} else {
				dataAluno.pessoaId = null;
			}						
		}
	});
	
	LoadPessoaSelect2({
		container: '#SelectPaiAluno',
		modal: modalAluno,
		url: $baseApiUrl+'pessoa/repositories',
        change: function(data){
            if ((data !== null) && (data !== undefined)){
				dataAluno.paiId = data.id;				
				} else {
				dataAluno.paiId = null;
			}						
		}
	});	
	
	LoadPessoaSelect2({
		container: '#SelectMaeAluno',
		modal: modalAluno,
		url: $baseApiUrl+'pessoa/repositories',
        change: function(data){
            if ((data !== null) && (data !== undefined)){
				dataAluno.maeId = data.id;				
				} else {
				dataAluno.maeId = null;
			}						
		}
	});	
	
	if ((dataAluno.pessoa !== undefined) && (dataAluno.pessoa !== null))
	SetValueSelect2($('#SelectAluno'),dataAluno.pessoa.id, dataAluno.pessoa.descricao);		
	
	if ((dataAluno.pai !== undefined) && (dataAluno.pai !== null))
	SetValueSelect2($('#SelectPaiAluno'),dataAluno.pai.id, dataAluno.pai.descricao);		
	
	if ((dataAluno.mae !== undefined) && (dataAluno.mae !== null))
	SetValueSelect2($('#SelectMaeAluno'),dataAluno.mae.id, dataAluno.mae.descricao);		
}

function Salvar2(e, field, objeto, $thisSelect){
	SalvarPessoa(function(response, textStatus, jqXHR){
		hideLoadingModal();
		modalPessoa.modal('hide');
		
		dataAluno[field] = response.id;
		dataAluno[objeto] = response;					
		
		$thisSelect.empty();
		
		var _id = response.id;
		var _text = response.descricao;
		
		var option = new Option(_text, _id, true, true);
		
		$thisSelect.append(option);
		$thisSelect.trigger('change');
		
		if ($thisSelect.data('select2')) {
			$thisSelect.trigger('change.select2');
		}							
	})						
}

function BtnEditarPessoaAlunoClick(e){
    var $btn = $(e);
    
    // Encontra a row
    var $row = $btn.closest('[data-field1]');
	
	if (!$row.length) {
        alert('Erro de configuração: data-field1 não encontrado.');
        return;
	}
    
	var $thisSelect = $btn.closest('.input-group').find('select');
	
    var field = $row.attr('data-field1');
    var objeto = $row.attr('data-field2');
    
	if ((dataAluno[field] !== undefined) && (dataAluno[field] !== null)) {
		RestRequest({
			method: 'GET',
			url: $baseApiUrl+"pessoa/"+dataAluno[field],
			success: function(response, textStatus, jqXHR){
				hideLoadingModal();
				dataPessoa = response;
				ResetDefaultPessoa({
					saveClick: function(e){
						Salvar2(e,field,objeto,$thisSelect);
					},
					showDelete: false,
					modalCallback: function(){
						$('#descricao').focus();
					}
				});					
			}
		});  	
	}
}

function BtnNovoPessoaAlunoClick(e){
    var $btn = $(e);
    
    // Encontra a row
    var $row = $btn.closest('[data-field1]');
	
	if (!$row.length) {
        alert('Erro de configuração: data-field1 não encontrado.');
        return;
	}
    
	var $thisSelect = $btn.closest('.input-group').find('select');
	
    var field = $row.attr('data-field1');
    var objeto = $row.attr('data-field2');
	
	dataPessoa = {id: 0};
	
	ResetDefaultPessoa({
		saveClick: function(e){
			Salvar2(e,field,objeto,$thisSelect);
		},
		showDelete: false,
		modalCallback: function(){
			$('#descricao').focus();
		}
	});					
}

function NovoAlunoClick(e)
{
    event.preventDefault();
	
	dataAluno = { id: 0 };
	
	ResetDefaultAluno(function(){
		$('#SelectAluno').focus();
	});	
}

function CancelarAlunoClick(){
    dataAluno = undefined;
    modalAluno.modal('hide');
}

function EditarAlunoClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceAluno+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataAluno = response;
			ResetDefaultAluno(function(){
				$('#SelectAluno').focus();
			});
		}
	});  	
}

function ExcluirAlunoClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourceAluno+"/"+dataAluno.id,
		success: function(data){
			setTimeout(() => {
				CancelarAlunoClick();
				tbAluno.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarAlunoClick(e){
    event.preventDefault();
	
	dataAluno.pessoa = null;
	dataAluno.pai = null;
	dataAluno.mae = null;
	//dataAluno.rm = validarInput($('#rm'));
	
	RestRequest({
		method: (dataAluno.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourceAluno+(dataAluno.id === 0 ? '' : `/${dataAluno.id}`),
		data: dataAluno,
		success: function (response, textStatus, jqXHR) {
			if (jqXHR.status === 201){
				dataAluno.id = response.id;
			}                
			hideLoadingModal();
			modalAluno.modal('hide');
			tbAluno.ajax.reload();
		}
	}); 
}