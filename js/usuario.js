var dataUsuario = undefined;
var modalUsuario = undefined;
var TbUsuario = undefined;

const resourceUsuario = 'Usuario';

function DetailUsuario (d) {
    return `
    <div class="row">
    <div class="col-12">
    <ul class="list-group list-group-flush w-100">
    <li class="list-group-item d-flex justify-content-between align-items-center">
	Criado em
	<small>${d.createdAt}</small>
    </li>
    <li class="list-group-item d-flex justify-content-between align-items-start">
	<div>
	<div class="fw-bold">${d.email}</div>
	${(d.verifiedAt === null) ? `<a onclick="ReenviarEmail(this);" data-email=${d.email} href="#" class="badge text-bg-primary text-decoration-none"><i class="fa fa-envelope"></i> Reenviar</a>`:``}
	</div>
	${(d.verifiedAt === null) ? '<span class="badge bg-warning text-dark rounded-pill"><i class="fa fa-refresh fa-spin"></i> Não Verificado</span>':`<small class="badge text-bg-success"><i class="fa fa-check"></i> Verificado</small>`}
    </li>
    </ul>
    </div>
    </div>
    `;
}

function ReenviarEmail(e){
    event.preventDefault();
    var $this = $(e);
    RestRequest('POST',
        $baseApiUrl+"ReenviarNotificacaoDeRegistro?email="+$this.data('email'),
        null,
        null,
        function (data) {
            hideLoadingModal();
            zAlerta("Solicitação enviada com sucesso.");
		});
}

function exibeUsuarios(data) {
	const defaultColumns = [
		{
			data: 'foto',
			orderable: false,
			"width": "6%",
			"render": function(data, type, row) {
				var _data = (data === '') ? 'assets/img/semfoto.png':$imageUrl+data;
				return `<img class="avatar-img rounded-circle" src="${_data}" style="width: 39px; height: 39px;" />`
			}
		},
		{ 
			data: null,              
			orderable: false,
			"width": "80%",
			"render": function(data, type, row) {
				return `<span>${row.firstName} ${row.lastName}</span>`
			}                    
		},
		{ 
			data: null,              
			orderable: false,
			"width": "5%",
			"render": function(data, type, row) {
				return `<span class="badge text-bg-${(row.role === "gerente") ? 'dark':'primary'}">${row.role}</span>`
			}                    
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
				<li><a class="dropdown-item" href="#" onclick="Editar${resourceUsuario}Click(this);"><i class="fas fa-edit"></i> Editar</a></li>					
				</ul>
				</div>`                        
			}
		}
	];
	
    var modalTbUsuario = createDynamicModal();        
	
	modalTbUsuario.find('.modal-title').text(data.label);
	modalTbUsuario.find('.modal-dialog').addClass('modal-lg');
	modalTbUsuario.find('.modal-body')
	.html(`<table id="${resourceUsuario}Tb" class="row-border stripe hover" style="width:100%"></table>`)
	modalTbUsuario.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoUsuarioClick(this);">
		<i class="icon-plus me-2"></i>Novo Cadastro
		</button>
	</div>`);
	
	TbUsuario = CarregaDataTable({
		resource: resourceUsuario+'/datatable',
		modal: modalTbUsuario,
		columns: defaultColumns,
	});	      	
}

function UsuarioClick(e) {
	RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}usuario/acesso`,
		success: exibeUsuarios
	});                	
}

function exibeLoadUsuario(response, status, xhr){
	preencherFormularioCompleto(dataUsuario, '#frmUsuario');
	
	if ((dataUsuario.photo != undefined) && (dataUsuario.photo != null))
	{					
		$('#Foto'+resourceUsuario).attr('src',$imageUrl+dataUsuario.photo);
	}
	
	$('#UsuarioPhone').trigger('input').trigger('change');
	
	$(`input[name="UsuarioRole"][value="${dataUsuario.roleType}"]`).prop('checked', true);	
	
	LoadSelect3({
		url: $baseApiUrl+'Role',
		modal: modalUsuario,
		container: '#selectUsuarioAcesso',
		data: dataUsuario,
		field: 'roleId'
    });

	$('#uploadFotoUsuario').off('click').on('click', uploadFotoUsuario);	
	$('#apagarFotoUsuario').off('click').on('click', apagarFotoUsuario);
}

function ResetDefaultUsuario(onModalCallback){
    hideLoadingModal();
	
	/*Create modal*/
    modalUsuario = createDynamicModal(function(){
        dataUsuario = null;
	}); 
	
    modalUsuario.find('.modal-title').text($title);
    modalUsuario.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-lg');
    modalUsuario.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarUsuarioClick(this);"><i class="icon-close"></i> Cancelar</button>
		<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirUsuarioClick(this);"><i class="icon-trash"></i> Excluir</button>
		<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarUsuarioClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    carregarTemplateModal({
        modal: modalUsuario,       
        template: 'templates/'+resourceUsuario+'.html #frm'+resourceUsuario,
		onLoad: exibeLoadUsuario,
		onModal: onModalCallback
	});    
}

function NovoUsuarioClick(e){
    dataUsuario = {id: 0, descricao: null};
	
	ResetDefaultUsuario(function(){
		$('#descricao').focus();
	});	   
}

function CancelarUsuarioClick(){
    dataUsuario = undefined;
    modalUsuario.modal('hide');
}

function EditarUsuarioClick(e){
	event.preventDefault();
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceUsuario+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataUsuario = response;
			ResetDefaultUsuario(function(){
				$('#descricao').focus();
			});
		}
	});  
}

function SalvarUsuarioClick(e){
	dataUsuario.firstname = validarInput($('#UsuarioFirstName'));
	dataUsuario.lastname = validarInput($('#UsuarioLastName'));
	dataUsuario.email = validarInput($('#UsuarioEmail'));
	dataUsuario.phone = validarInput($('#phone'));
	dataUsuario.phoneWhats = checkboxValue($('#phoneWhats'));
	dataUsuario.roleType = $('input[name="UsuarioRole"]:checked').val();
	dataUsuario.status = checkboxValue($('#UsuarioStatus'));
	dataUsuario.level = validarInput($('#UsuarioNivel'));
	
	console.log(dataUsuario);
	
	RestRequest({
		method: (dataUsuario.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+"Usuario"+(dataUsuario.id === 0 ? '' : `/${dataUsuario.id}`),
		data: dataUsuario,
		success: function (response, textStatus, jqXHR) {
			hideLoadingModal();
			TbUsuario.ajax.reload(); 
			modalUsuario.modal('hide');            
		}
	});  
}

function ExcluirUsuarioClick(e){
	zPergunta_Exclui({
		url: $baseApiUrl+resourceUsuario+"/"+dataUsuario.id,
		success: function(data){
			setTimeout(() => {
				CancelarUsuarioClick();
				tbUsuario.ajax.reload();
			}, 10); 
		}
	});
}

function apagarFotoUsuario() {
    dataUsuario.photo = null;
    $('#FotoUsuario').attr('src', '#');
}

async function uploadFotoUsuario(event) {
	const { value: file } = await Swal.fire({
		title: "Selecione uma imagem",
		input: "file",
		inputAttributes: {
			"accept": "image/*",
			"aria-label": "Carregue sua imagem"
		},
		showCancelButton: true,
		confirmButtonText: "Enviar",
		cancelButtonText: "Sair",
		showLoaderOnConfirm: true,
		allowOutsideClick: () => !Swal.isLoading()
	});
	
	UploadSingleImage({
		file: file,
		success: function(response, textStatus, jqXHR){
			dataUsuario.photo = response;
			$('#FotoUsuario').attr('src', $imageUrl+dataUsuario.photo);	
			$('#FotoUsuario').click(function(){
				Swal.fire({
					imageUrl: $imageUrl+dataUsuario.photo,
					imageHeight: 300,				  
					imageAlt: "A tall image"
				});				
			});			
		}
	});
}