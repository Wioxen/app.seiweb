var dataEmpresa = undefined;
var modalEmpresa = undefined;
var cadastroEmpresa = undefined;
var resourceEmpresa = "Empresa";

function meuFormatoPersonalizado(d) {
    return `
        <div class="row-details">
            <h5>Detalhes do Registro #${d.id}</h5>
            <p><strong>Nome:</strong> ${d.id}</p>
            <p><strong>Email:</strong> ${d.id}</p>
        </div>
    `;
}

function EmpresaClick(e) {
    RestRequest('GET',
        `${$baseApiUrl}${resourceEmpresa}`,
        null,
        null,
        function (data) {
            hideLoadingModal();

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

            cadastroEmpresa = 
                CarregaDataTable
                (
                    'datatable?table=Empresa',
                    'Empresa',
                    'modal-lg',
                    `<table id="EmpresaTb" class="row-border stripe hover" style="width:100%"></table>`,
                    `<div class="footer-buttons">
                        <button id="btnNovoEmpresa" type="button" class="btn btn-success" onclick="NovoEmpresaClick(this);">
                            <i class="fa fa-plus-circle me-2"></i>Novo Cadastro
                        </button>
                    </div>`,
                    null,
                    defaultColumns,
                    null,
                    false
                );                       
        });           
}

function ResetDefaultEmpresa(onLoadCallback){
    hideLoadingModal();

    modalEmpresa = createDynamicModal(function(){
        dataEmpresa = null;
    });        

    modalEmpresa.find('.modal-header-search').hide();

    carregarTemplateModal('#'+modalEmpresa.attr('id'),
        'templates/'+resourceEmpresa+'.html #frm'+resourceEmpresa, {
        modalTitle: 'Cadastrar Empresa',       
        modalSize: 'modal-dialog-scrollable modal-xl',
        onLoad: function(response, status, xhr)
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

    			$('#LogoEmpresa').attr('src', $imageUrl+dataEmpresa.logo);
                
                if (dataEmpresa.aliquota !== 0){
			        $('#aliquota').maskMoney('mask', dataEmpresa.aliquota).trigger('input').trigger('change');			
                }
            }   

            modalEmpresa.find('.btn-cancelar').click(CancelarEmpresaClick);
            modalEmpresa.find('.btn-excluir').click(ExcluirEmpresaClick);    
            modalEmpresa.find('.btn-salvar').click(SalvarEmpresaClick);            

            CarregaEmpresaBairro();

            carregaSelect2('CertificadoDigital',modalEmpresa,'#selectCertificado',function(response, textStatus, jqXHR){
                $('#CertificadoDigital')
                    .val(safeGet(dataEmpresa,'certificadoDigitalId'))
                    .trigger('change');                    
            },
            {},
            null,
            function(data,value,element){
                if ((data !== null) && (data !== undefined)){
                    dataEmpresa.certificadoDigitalId = data.id;
                    $('#DtValidadeCert').html(`<span class="badge ${data.badgeValidade}">Valido até ${data.dtValidade}</span>`);
                }
            },
            function(e){
            },
            function(e){
            },
            function(e){
                $('#DtValidadeCert').empty();
            }); 

            carregaSelect('lista/naturezas','#selectNatureza','codigo',true,function(response, textStatus, jqXHR){
                if ((dataEmpresa !== undefined) && (dataEmpresa != null) && (dataEmpresa.naturezaOperacao !== 0))
                {
                    $('#naturezaOperacao')
                        .val(dataEmpresa.naturezaOperacao)
                        .trigger('change');                    
                }
            });

            carregaSelect('lista/regimes','#selectRegime','codigo',true,function(response, textStatus, jqXHR){
                if ((dataEmpresa !== undefined) && (dataEmpresa != null) && (dataEmpresa.regimeTributacao !== 0))
                {
                    $('#regimeTributacao')
                        .val(dataEmpresa.regimeTributacao)
                        .trigger('change');                    
                }
            });


            if (typeof onLoadCallback === 'function') 
            {
                onLoadCallback(response, status, xhr);
            }
        }
    });                
}

function CarregaEmpresaBairro(){
    carregaSelect2('Bairro',
        modalEmpresa,
        '#selectEmpresaBairro',
        function(response, textStatus, jqXHR){
            $('#EmpresaBairro')
                .val(safeGet(dataEmpresa, 'bairroId'))
                .trigger('change');
        },
        {municipio: 'municipio', uf: 'uf'},
        null,
        function(data, value, element){
            if ((data !== null) && (data !== undefined)){
                dataEmpresa.bairroId = data.id;
                RestRequest('GET',
                $baseApiUrl+'Municipio/'+data.municipioId,
                null,
                function(xhr){
                    $('#EmpresaMunicipio').empty().html(`<span><i class="fa fa-spin fa-spinner"></i></span>`);
                    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                },
                function(data){
                    $('#EmpresaMunicipio').html(`<span class="badge text-bg-dark">${data.descricao}-${data.uf}</span>`);
                });
            }
        },
        function(e){
        },
        function(e){
        },
        function(e){
            $('#EmpresaMunicipio').empty();
        });    
}


function NovoEmpresaClick(e)
{
    event.preventDefault();
    ResetDefaultEmpresa(
    function(response, status, xhr){
        dataEmpresa = { id: 0 };
        if (!modalEmpresa.hasClass('show') && !modalEmpresa.is(':visible')) 
        {
            modalEmpresa.modal('show');                
            toggleModalBody('#'+modalEmpresa.attr('id'), false);
            setTimeout(() => {
                $('#descricao').focus();
            }, 500);            
        }          
    });     
}

function CancelarEmpresaClick(e){
    e.preventDefault();
    dataEmpresa = undefined;
    modalEmpresa.modal('hide');
}

function EditarEmpresaClick(e){
    event.preventDefault();

    RestRequest('GET',
        `${$baseApiUrl}${resourceEmpresa}`,
        null,
        null,
        function (data) {
            GetEmpresa(e.closest('tr').id,
            function (data) {
                hideLoadingModal();
                dataEmpresa = data;
                ResetDefaultEmpresa(function(response, status, xhr){
                    if (!modalEmpresa.hasClass('show') && !modalEmpresa.is(':visible')) 
                    {
                        modalEmpresa.modal('show');                
                        toggleModalBody('#'+modalEmpresa.attr('id'), false);
                        setTimeout(() => {
                            $('#descricao').focus();
                        }, 500);            
                    }
                });
            });
        });
}

function ExcluirEmpresaClick(e){
    e.preventDefault();
    if ((dataEmpresa !== undefined) && (dataEmpresa !== null)){
        if (dataEmpresa.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+resourceEmpresa+"/"+dataEmpresa.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarEmpresaClick(e);
                            cadastroEmpresa.tabela.ajax.reload();
                        }, 500);                     
                    });  
            });        
        }
    }
}

function SalvarEmpresaClick(e){
    e.preventDefault();
    if ((dataEmpresa !== undefined) && (dataEmpresa !== null)){
        dataEmpresa.descricao = validarValor($('#descricao').val());
        dataEmpresa.nomeFantasia = validarValor($('#nomeFantasia').val());
        dataEmpresa.cep = validarValor($('#cep').val(),false,true);
        dataEmpresa.endereco = validarValor($('#endereco').val());
        dataEmpresa.numero = validarValor($('#numero').val());
        dataEmpresa.complemento = validarValor($('#complemento').val());
        dataEmpresa.cnpj = validarValor($('#cnpj').val(),false,true);
        dataEmpresa.im = validarValor($('#im').val());
        dataEmpresa.ie = validarValor($('#ie').val());
        dataEmpresa.nis = validarValor($('#nis').val());
        dataEmpresa.url = validarValor($('#url').val());
        dataEmpresa.email = validarValor($('#email').val());
        dataEmpresa.telefone = validarValor($('#telefone').val(),false,true);
        dataEmpresa.celular = validarValor($('#celular').val(),false,true);
        dataEmpresa.naturezaOperacao = validarValor($('#naturezaOperacao').val(),true);
        dataEmpresa.regimeTributacao = validarValor($('#regimeTributacao').val(),true);
        dataEmpresa.optanteSimples = checkboxValue($('#optanteSimples'));
        dataEmpresa.icentivoFiscal = checkboxValue($('#icentivoFiscal'));
        dataEmpresa.empresaConveniada = checkboxValue($('#empresaConveniada'));
        dataEmpresa.cnae = validarValor($('#cnae').val());
        dataEmpresa.itemServico = validarValor($('#itemServico').val());
        //dataEmpresa.aliquota = StrToNumber($('#aliquota').val());
        dataEmpresa.codigoTributacao = validarValor($('#codigoTributacao').val(),false,true);
        dataEmpresa.usuario = validarValor($('#usuario').val());
        dataEmpresa.senha = validarValor($('#senha').val());
        dataEmpresa.cscId = validarValor($('#cscId').val(),true);
        dataEmpresa.csc = validarValor($('#csc').val());
    
        RestRequest((dataEmpresa.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Empresa"+(dataEmpresa.id === 0 ? '' : `/${dataEmpresa.id}`),
            dataEmpresa,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataEmpresa.id = response.id;
                }                
                hideLoadingModal();
                modalEmpresa.modal('hide');
                cadastroEmpresa.tabela.ajax.reload();
            });  
    }    
}

function ConsultaCepEmpresa(){
    buscaCep(resourceEmpresa,$('#cep').val(),
        function(data){
            hideLoadingModal();
            dataEmpresa.bairroId = data.bairroId;
            CarregaEmpresaBairro();            
			preencherFormularioCompleto(data, '#frm'+resourceEmpresa);
            $('#numero').focus();
        });
}


function ConsultaCnpjEmpresa(){
    buscaCnpj(resourceEmpresa,$.trim($('#cnpj').val()),
        function(data){
            hideLoadingModal();
            
            dataEmpresa.bairroId = data.bairroId;
            CarregaEmpresaBairro();

			preencherFormularioCompleto(data, '#frm'+resourceEmpresa);

            $('#descricao').focus();
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


function GetEmpresa(id,onSuccessCallback){
    RestRequest('GET',
        $baseApiUrl+resourceEmpresa+"/"+id,
        null,
        function(xhr){
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, status, xhr){
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });    
}