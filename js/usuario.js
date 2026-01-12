var dataUsuario = undefined;
var modalUsuario = undefined;
var cadastroUsuario = undefined;
var resourceUsuario = "Usuario";
    
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


function UsuarioClick(e) {
	const defaultColumns = [
		/*{
			class: 'warning-Usuario', orderable: false, searchable: false, data: null, defaultContent: '', "width": "2%",
			"render": function(data, type, row) {
				return `<span><i class="fa fa-exclamation-triangle text-warning"></i></span>`
			} 
		},*/
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

	cadastroUsuario = 
		CarregaDataTable
		(
			resourceUsuario+'/datatable',
			'Usuários',
			'modal-lg',
			`<table id="${resourceUsuario}Tb" class="row-border stripe hover" style="width:100%"></table>`,
			`<div class="footer-buttons">
				<button id="${gerarHash(16)}" type="button" class="btn btn-success" onclick="Novo${resourceUsuario}Click(this);">
					<i class="icon-plus me-2"></i>Novo Cadastro
				</button>
			</div>`,
			null,
			defaultColumns,
			function(settings)
			{
				//
			},
			false,
			DetailUsuario
		);                         	
}

function ResetDefaultUsuario(onLoadCallback){
    hideLoadingModal();

    modalUsuario = createDynamicModal(function(){
        dataUsuario = null;
    });
	
    modalUsuario.find('.modal-header-search').hide();
    /*modalUsuario.find('.modal-footer').append(`<button id="direitosUsuario" class="btn btn-dark">
        <i class="fas fa-users-cog"></i> Direitos
    </button>`);*/

    carregarTemplateModal('#'+modalUsuario.attr('id'),
        'templates/'+resourceUsuario+'.html #frm'+resourceUsuario, {
        modalTitle: 'Cadastrar Usuário',       
        modalSize: 'modal-dialog-scrollable modal-lg',
        onLoad: function(response, status, xhr)
        {            
            modalUsuario.find('.btn-cancelar').click(CancelarUsuarioClick);
            modalUsuario.find('.btn-excluir').click(ExcluirUsuarioClick);    
            modalUsuario.find('.btn-salvar').click(SalvarUsuarioClick);            

            $('#uploadFoto'+resourceUsuario).off('click').on('click', uploadFotoUsuario);
            $('#apagarFoto'+resourceUsuario).off('click').on('click', apagarFotoUsuario);
            $('#fileUpload'+resourceUsuario).off('change').on('change', fileUploadUsuario);

            if ((dataUsuario !== undefined) && (dataUsuario != null) && (dataUsuario.id !== 0))
            {
                preencherFormularioCompleto(dataUsuario, '#frm'+resourceUsuario);

				if (dataUsuario.photo != null)
				{					
					$('#Foto'+resourceUsuario).attr('src',$imageUrl+dataUsuario.photo);
				}

                $('#UsuarioPhone').trigger('input').trigger('change');
                $('#UsuarioPhoneWhats').prop('checked',(dataUsuario.phoneWhats === true));
                $('#UsuarioStatus').prop('checked',(dataUsuario.status === true));
                $(`input[name="UsuarioRole"][value="${dataUsuario.role}"]`).prop('checked', true);
            }

            carregaSelect2('select2?table=Role',modalUsuario,'#selectUsuarioAcesso',function(response, textStatus, jqXHR){
                if ((dataUsuario !== undefined) && (dataUsuario != null) && (dataUsuario.roleId !== 0))
                {
                    var thisSelect = $('#'+$('#selectUsuarioAcesso').attr('data-control'));
                    thisSelect.val(dataUsuario.roleId);
                    thisSelect.trigger('change');                    
                }
            });


            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }          
        }
    });      
}

function NovoUsuarioClick(e){
    event.preventDefault();
    ResetDefaultUsuario(
    function(response, status, xhr){
        dataUsuario = {id: 0};
        if (!modalUsuario.hasClass('show') && !modalUsuario.is(':visible')) 
        {
            modalUsuario.modal('show');                
            toggleModalBody('#'+modalUsuario.attr('id'), false);
            setTimeout(() => {
                $('#UsuarioFirstName').focus();
            }, 500);            
        }          
    });   
}

function CancelarUsuarioClick(){
    dataUsuario = undefined;
    modalUsuario.modal('hide');
}

function EditarUsuarioClick(e){
    event.preventDefault();

	GetUsuario(e.closest('tr').id,
	function (data) {
		hideLoadingModal();
		dataUsuario = data;
		ResetDefaultUsuario(function(response, status, xhr){
			if (!modalUsuario.hasClass('show') && !modalUsuario.is(':visible')) 
			{
				modalUsuario.modal('show');                
				toggleModalBody('#'+modalUsuario.attr('id'), false);
				setTimeout(() => {
					$('#UsuarioFirstName').focus();
				}, 500);            
			}
		});
	});
}

function SalvarUsuarioClick(e){
    e.preventDefault();

    if ((dataUsuario !== undefined) && (dataUsuario !== null))
    {
        dataUsuario.firstname = StrToValue($('#UsuarioFirstName').val());
        dataUsuario.lastname = StrToValue($('#UsuarioLastName').val());
        dataUsuario.email = StrToValue($('#UsuarioEmail').val());
        dataUsuario.phone = StrToValue($('#UsuarioPhone').val());
        dataUsuario.phonewhats = checkboxValue($('#UsuarioPhoneWhats'),1,0);
        dataUsuario.role = $('input[name="UsuarioRole"]:checked').val();
        dataUsuario.status = checkboxValue($('#UsuarioStatus'),1,0);
        dataUsuario.roleId = IntToValue(parseInt($('#UsuarioAcesso').val()));
        dataUsuario.level = IntToValue(parseInt($('#UsuarioNivel').val()));

        RestRequest((dataUsuario.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Usuario"+(dataUsuario.id === 0 ? '' : `/${dataUsuario.id}`),
            dataUsuario,
            null,
            function (response, textStatus, jqXHR) {
                hideLoadingModal();
                cadastroUsuario.tabela.ajax.reload(); 
                modalUsuario.modal('hide');            
            });  
    }    
}

function ExcluirUsuarioClick(e){
    e.preventDefault();
    if ((dataUsuario !== undefined) && (dataUsuario !== null)){
        if (dataUsuario.id !== 0){
            zPergunta_Exclui($baseApiUrl+resourceUsuario+"/"+dataUsuario.id,
			function(){
				setTimeout(() => {
					CancelarUsuarioClick();
					cadastroUsuario.tabela.ajax.reload();
				}, 500);                     
            });        
        }
    }
}

function uploadFotoUsuario(e) {
    e.preventDefault();
    $('#fileUploadUsuario').trigger('click');
}

function apagarFotoUsuario() {
    dataUsuario.photo = null;
    $('#fileUploadUsuario').val('');
	$('#Foto'+resourceUsuario).attr('src','#');
}

function fileUploadUsuario(e) {
    EnviarImagem($(this), 
    function (repo) {
        dataUsuario.photo = repo;
        $('#FotoUsuario').attr('src',$imageUrl+dataUsuario.photo);
    });
}

function GetUsuario(id,onSuccessCallback){
    RestRequest('GET',
        $baseApiUrl+resourceUsuario+"/"+id,
        null,
        null,
        function(response, status, xhr){
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });    
}