var dataEmpresa = undefined;
var modalEmpresa = undefined;
var tbEmpresa = undefined;
var resourceEmpresa = "Empresa";

/*function DetailEmpresa(d) {
    return `
        <div class="row-details">
            <h5>Detalhes do Registro #${d.id}</h5>
            <p><strong>Nome:</strong> ${d.id}</p>
            <p><strong>Email:</strong> ${d.id}</p>
        </div>
    `;
}*/

function exibeEmpresa(data) {
	const defaultColumns  = [
		{ 
			//title: 'Descrição',
			data: 'descricao',    
			orderable: false,
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
						<li><a class="dropdown-item" href="#" onclick="EditarEmpresaClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
						</ul>
						</div>`                        
			}
		},
	];	
	
    var modalTbEmpresa = createDynamicModal();        
	
	modalTbEmpresa.find('.modal-title').text('Empresa');
	modalTbEmpresa.find('.modal-dialog').addClass('modal-lg');
	modalTbEmpresa.find('.modal-body').html(`<table id="EmpresaTb" class="row-border stripe hover" style="width:100%"></table>`);
	modalTbEmpresa.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoEmpresaClick(this);">
	<i class="icon-plus me-2"></i>Novo Cadastro
	</button>
	</div>`);
	
	tbEmpresa = CarregaDataTable({
		resource: 'Empresa/DataTable',
		modal: modalTbEmpresa,
		columns: defaultColumns
	});
}

function EmpresaClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourceEmpresa}/acesso`,
		success: exibeEmpresa
	});  
}

function exibeLoadEmpresa(response, status, xhr)
{
	$('#itemServico').mask('00.00');
	$('#codigoTributacao').mask('0000-0/00');

	$('#btnCep').off('click').on('click', ConsultaCepEmpresa);
	$('#btnCnpj').off('click').on('click', ConsultaCnpjEmpresa);

	$('#uploadLogoEmpresa').off('click').on('click', uploadLogoEmpresa);
	$('#apagarLogoEmpresa').off('click').on('click', apagarLogoEmpresa);
	$('#fileUploadEmpresa').off('change').on('change', fileUploadEmpresa);

	$('#cnpj').trigger('input').trigger('change');
	$('#cep').trigger('input').trigger('change');
	$('#telefone').trigger('input').trigger('change');
	$('#celular').trigger('input').trigger('change');
	$('#codigoTributacao').trigger('input').trigger('change');         
	
	if ((dataEmpresa !== undefined) && (dataEmpresa !== null))
	{
		preencherFormularioCompleto(dataEmpresa, '#frm'+resourceEmpresa);    
		
		if (dataEmpresa.logo != null){
			$('#LogoEmpresa').attr('src', $imageUrl+dataEmpresa.logo);
		}
		
		if (dataEmpresa.aliquota !== 0){
			$('#aliquota').maskMoney('mask', dataEmpresa.aliquota).trigger('input').trigger('change');			
		}
	}   

	CarregaEmpresaBairro();

    carregaSelect2({
		url: $baseApiUrl+'CertificadoDigital',
		container: '#selectCertificado',
        modal: modalEmpresa,
        success: function(response, textStatus, jqXHR){
            $('#selectCertificado')
				.find('select')
                .val(safeGet(dataEmpresa, 'certificadoDigitalId'))
                .trigger('change');
        },
        change: function(data, value, element){
			if ((data !== null) && (data !== undefined)){
				dataEmpresa.certificadoDigitalId = data.id;
				$('#DtValidadeCert').html(`<span class="badge ${data.badgeValidade}">Valido até ${data.dtValidade}</span>`);
			}
        },
        unselect: function(e){
			$('#DtValidadeCert').empty();
		}	
	});  

    carregaSelect2({
		url: $baseApiUrl+'lista/naturezas',
		container: '#selectNatureza',
        modal: modalEmpresa,
        success: function(response, textStatus, jqXHR){
			if ((dataEmpresa !== undefined) && (dataEmpresa != null) && (dataEmpresa.naturezaOperacao !== 0))
			{
				$('#selectNatureza')
					.find('select')
					.val(dataEmpresa.naturezaOperacao)
					.trigger('change');                    
			}
        },
        change: function(data, value, element){
            if ((data !== null) && (data !== undefined)){
				dataEmpresa.naturezaOperacao = data.id;				
            }
        },
        unselect: function(e){
			dataEmpresa.naturezaOperacao = null;
		}		
	}); 
	
    carregaSelect2({
		url: $baseApiUrl+'lista/regimes',
		container: '#selectRegime',
        modal: modalEmpresa,
        success: function(response, textStatus, jqXHR){
			if ((dataEmpresa !== undefined) && (dataEmpresa != null) && (dataEmpresa.naturezaOperacao !== 0))
			{
				$('#selectRegime')
					.find('select')
					.val(dataEmpresa.regimeTributacao)
					.trigger('change');                    
			}
        },
        change: function(data, value, element){
            if ((data !== null) && (data !== undefined)){
				dataEmpresa.regimeTributacao = data.id;
            }
        },
        unselect: function(e){
			dataEmpresa.regimeTributacao = null;
		}		
	});
}


function ResetDefaultEmpresa(onAfterModalCallback){
    hideLoadingModal();

	/*Create modal*/
    modalEmpresa = createDynamicModal(function(){
        dataEmpresa = null;
    }); 

    modalEmpresa.find('.modal-title').text('Cadastrar Empresa');
    modalEmpresa.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-xl');
    modalEmpresa.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarEmpresaClick(this);"><i class="icon-close"></i> Cancelar</button>
	<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirEmpresaClick(this);"><i class="icon-trash"></i> Excluir</button>
	<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarEmpresaClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalEmpresa.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalEmpresa,       
        template: 'templates/'+resourceEmpresa+'.html #frm'+resourceEmpresa,
		onLoad: exibeLoadEmpresa,
		afterModal: onAfterModalCallback
	});                
}

function CarregaEmpresaBairro(){
    carregaSelect2({
		url: $baseApiUrl+'Bairro',
		container: '#selectEmpresaBairro',
        modal: modalEmpresa,
        success: function(response, textStatus, jqXHR){
            $('#selectEmpresaBairro')
				.find('select')
                .val(safeGet(dataEmpresa, 'bairroId'))
                .trigger('change');
        },
        change: function(data, value, element){
            if ((data !== null) && (data !== undefined)){
                dataEmpresa.bairroId = data.id;
                
				RestRequest({
					method: 'GET',
					url: $baseApiUrl+'Municipio/'+data.municipioId,
					beforeSend: function(xhr){
						$('#EmpresaMunicipio').empty().html(`<span><i class="fa fa-spin fa-spinner"></i></span>`);
						xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
					},
					success: function(data){
						$('#EmpresaMunicipio').html(`<span class="badge text-bg-dark">${data.descricao}-${data.uf}</span>`);
					}
				});
            }
        },
        unselect: function(e){
			dataEmpresa.bairroId = null;
            $('#EmpresaMunicipio').empty();
		}	
	});    
}

function NovoEmpresaClick(e)
{
    event.preventDefault();
	
	dataEmpresa = { id: 0 };
	
	ResetDefaultEmpresa(function(){
		$('#descricao').focus();
	});	
}

function CancelarEmpresaClick(){
    dataEmpresa = undefined;
    modalEmpresa.modal('hide');
}

function EditarEmpresaClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceEmpresa+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataEmpresa = response;
			ResetDefaultEmpresa(function(){
				$('#descricao').focus();
			});
		}
	});  	
}

function ExcluirEmpresaClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourceEmpresa+"/"+dataEmpresa.id,
		success: function(data){
			setTimeout(() => {
				CancelarEmpresaClick();
				tbEmpresa.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarEmpresaClick(e){
    event.preventDefault();
	
	dataEmpresa.descricao = validarInput($('#descricao'));
	dataEmpresa.nomeFantasia = validarInput($('#nomeFantasia'));
	dataEmpresa.cep = validarInput($('#cep'));
	dataEmpresa.endereco = validarInput($('#endereco'));
	dataEmpresa.numero = validarInput($('#numero'));
	dataEmpresa.complemento = validarInput($('#complemento'));
	dataEmpresa.cnpj = validarInput($('#cnpj'));
	dataEmpresa.im = validarInput($('#im'));
	dataEmpresa.ie = validarInput($('#ie'));
	dataEmpresa.nis = validarInput($('#nis'));
	dataEmpresa.url = validarInput($('#url'));
	dataEmpresa.email = validarInput($('#email'));
	dataEmpresa.telefone = validarInput($('#telefone'));
	dataEmpresa.celular = validarInput($('#celular'));
	dataEmpresa.optanteSimples = checkboxValue($('#optanteSimples'));
	dataEmpresa.icentivoFiscal = checkboxValue($('#icentivoFiscal'));
	dataEmpresa.empresaConveniada = checkboxValue($('#empresaConveniada'));
	dataEmpresa.cnae = validarInput($('#cnae'));
	dataEmpresa.itemServico = validarInput($('#itemServico'));
	dataEmpresa.aliquota = validarInput($('#aliquota'));
	dataEmpresa.codigoTributacao = validarInput($('#codigoTributacao'));
	dataEmpresa.usuario = validarInput($('#usuario'));
	dataEmpresa.senha = validarInput($('#senha'));
	dataEmpresa.cscId = validarInput($('#cscId'));
	dataEmpresa.csc = validarInput($('#csc'));

	RestRequest({
		method: (dataEmpresa.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourceEmpresa+(dataEmpresa.id === 0 ? '' : `/${dataEmpresa.id}`),
		data: dataEmpresa,
		success: function (response, textStatus, jqXHR) {
			if (jqXHR.status === 201){
				dataEmpresa.id = response.id;
			}                
			hideLoadingModal();
			modalEmpresa.modal('hide');
			tbEmpresa.ajax.reload();
		}
	}); 
}

function ConsultaCepEmpresa(){
    RestRequest({
		method: 'POST',
        url: $baseApiUrl+'apiservice/cep',
        data: {modulo: resourceEmpresa, cep: $('#cep').val()},
        success: function(data){
            hideLoadingModal();
            dataEmpresa.bairroId = data.bairroId;
            CarregaEmpresaBairro();            
			preencherFormularioCompleto(data, '#frm'+resourceEmpresa);
            $('#numero').focus();
        }
	});
}

function ConsultaCnpjEmpresa(){
    RestRequest({
		method: 'POST',
        url: $baseApiUrl+'apiservice/receitaWs',
        data: {modulo: resourceEmpresa, cnpj: $.trim($('#cnpj').val())},
        success: function(data){
            hideLoadingModal();
            
            dataEmpresa.bairroId = data.bairroId;

            CarregaEmpresaBairro();

			preencherFormularioCompleto(data, '#frm'+resourceEmpresa);

            $('#descricao').focus();
        }
	});
}

function uploadLogoEmpresa(e) {
    e.preventDefault();
    $('#fileUploadEmpresa').trigger('click');
}

function apagarLogoEmpresa() {
    dataEmpresa.logo = null;
    $('#LogoEmpresa').attr('src', '#');
}

function fileUploadEmpresa(e) {
    EnviarImagem($(this), 
    function (repo) {
        dataEmpresa.logo = repo;
        $('#LogoEmpresa').attr('src', $imageUrl+dataEmpresa.logo);
    });
}

function EmpresaNovoBairroClick(e){
    event.preventDefault();
    bairroClick(EmpresaBairroSuccess);
}

function EmpresaBairroSuccess (response, textStatus, jqXHR){
    dataEmpresa.bairroId = dataBairro.id;
    CarregaEmpresaBairro();
}