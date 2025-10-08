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

    modalEmpresa = createDynamicModal();        
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

            configurarAutocomplete(
                '#bairro',
                $baseApiUrl+'AutoComplete?table=Bairro',
                {
                    minLength: 2,
                    delay: 300,
                    onResponse: function(event,ui) {
                        if (!ui.content.length) {
                            ui.content.push({id: 0, descricao: $('#bairro').val().toUpperCase()});
                            ui.content.push({id: null, descricao: "Nenhum registro encontrado"});
                        }
                    },
                    create: function() {
                        $(this).data('ui-autocomplete')._renderItem = function(ul, item) {
                            return $('<li></li>')
                            .addClass((item.id === 0) ? "list-group-item list-group-item-action fw-bold fst-italic" : "list-group-item list-group-item-action")
                            .append((item.id === 0) ? '<i class="fa fa-plus bg-transparent border-0 text-dark"></i> Adicionar "' + item.descricao + '"' : item.descricao)
                            .appendTo(ul);
                        };
                    },                        
                    onSelect: function(item) {
                        if ((item.id === 0) || (item.id === undefined) || (item.id === null))
                        {
                            dataBairro = {id: 0, descricao: item.descricao};
                            bairroClick(EmpresaBairroSuccess);
                        }
                        else 
                        {
                            GetBairro(item.id,function(response){
                                dataEmpresa.bairro = response;
                                dataEmpresa.bairroId = response.id;
                                $('#bairro').val(response.descricao);                                                    
                            });
                        }
                    }
                }
            );
			
			preencherFormularioCompleto(dataEmpresa, '#frm'+resourceEmpresa);
            
			CarregarLogoEmpresa();

			$('#cnpj').trigger('input').trigger('change');
			$('#cep').trigger('input').trigger('change');
			$('#telefone').trigger('input').trigger('change');
			$('#celular').trigger('input').trigger('change');
			$('#codigoTributacao').trigger('input').trigger('change');                                
			$('#aliquota').maskMoney('mask', dataEmpresa.aliquota).trigger('input').trigger('change');			

            modalEmpresa.find('.btn-cancelar').click(CancelarEmpresaClick);
            modalEmpresa.find('.btn-excluir').click(ExcluirEmpresaClick);    
            modalEmpresa.find('.btn-salvar').click(SalvarEmpresaClick);            

            carregaSelect2('CertificadoDigital',modalEmpresa,'#selectCertificado','id',function(response, textStatus, jqXHR){
                if ((dataEmpresa !== undefined) && (dataEmpresa != null) && (dataEmpresa.certificadoDigitalId !== 0))
                {
                    var thisSelect = $('#CertificadoDigital');
                    thisSelect
                        .val(dataEmpresa.certificadoDigitalId)
                        .trigger('change');                    
                }
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


function NovoEmpresaClick(e)
{
    event.preventDefault();
    RestRequest('GET',
        `${$baseApiUrl}${resourceEmpresa}/novo`,
        null,
        null,
        function (data) {
            dataEmpresa = {id: 0, descricao: null };
            ResetDefaultEmpresa(
            function(response, status, xhr){
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
        dataEmpresa.descricao = $('#descricao').val().trim() ? $('#descricao').val().toUpperCase() : null;
        dataEmpresa.nomeFantasia = $('#nomeFantasia').val().trim() ? $('#nomeFantasia').val().toUpperCase() : null;
        dataEmpresa.cep = $('#cep').val().trim() ? extrairNumeros($('#cep').val().toUpperCase()) : null;
        dataEmpresa.endereco = $('#endereco').val().trim() ? $('#endereco').val().toUpperCase() : null;
        dataEmpresa.numero = $('#numero').val().trim() ? $('#numero').val().toUpperCase() : null;
        dataEmpresa.complemento = $('#complemento').val().trim() ? $('#complemento').val().toUpperCase() : null;
        dataEmpresa.cnpj = $('#cnpj').val().trim() ? extrairNumeros($('#cnpj').val().toUpperCase()) : null;
        dataEmpresa.im = $('#im').val().trim() ? $('#im').val().toUpperCase() : null;
        dataEmpresa.ie = $('#ie').val().trim() ? $('#ie').val().toUpperCase() : null;
        dataEmpresa.nis = $('#nis').val().trim() ? $('#nis').val().toUpperCase() : null;
        dataEmpresa.url = $('#url').val().trim() ? $('#url').val().toUpperCase() : null;
        dataEmpresa.email = $('#email').val().trim() ? $('#email').val().toLowerCase() : null;
        dataEmpresa.telefone = $('#telefone').val().trim() ? extrairNumeros($('#telefone').val().toUpperCase()) : null;
        dataEmpresa.celular = $('#celular').val().trim() ? extrairNumeros($('#celular').val().toUpperCase()) : null;
        dataEmpresa.naturezaOperacao = StrToNumber($('#naturezaOperacao').val());
        dataEmpresa.regimeTributacao = StrToNumber($('#regimeTributacao').val());
        dataEmpresa.optanteSimples = CheckedToValue($('#optanteSimples'));
        dataEmpresa.icentivoFiscal = CheckedToValue($('#icentivoFiscal'));
        dataEmpresa.empresaConveniada = CheckedToValue($('#empresaConveniada'));
        dataEmpresa.cnae = $('#cnae').val();
        dataEmpresa.itemServico = $('#itemServico').val();
        dataEmpresa.aliquota = StrToNumber($('#aliquota').val());
        dataEmpresa.codigoTributacao = extrairNumeros($('#codigoTributacao').val());
        dataEmpresa.certificadoDigitalId = IntToValue(parseInt($('#CertificadoDigital').val()));
        dataEmpresa.Empresa = $('#Empresa').val();
        dataEmpresa.senha = $('#senha').val();
        dataEmpresa.cscId = StrToNumber($('#cscId').val());
        dataEmpresa.csc = $('#csc').val();

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
    buscaCep($('#cep'),
        function(data){
            hideLoadingModal();
            dataEmpresa.bairroId = data.bairro.id;
            $('#endereco').val(data.endereco);
            $('#bairro').val(data.bairro.descricao);
            $('#complemento').val(data.complemento);
            $('#municipio').val(data.bairro.municipio.descricao);
            $('#uf').val(data.bairro.municipio.uf);
        });
}


function ConsultaCnpjEmpresa(){
    buscaCnpj($.trim($('#cnpj').val()),
        function(data){
            hideLoadingModal();
            dataEmpresa.bairroId = data.bairro.id;
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
    $('#logo').attr('src', '#');
}

function fileUploadEmpresa(e) {
    if ((dataEmpresa.logo === undefined) || (dataEmpresa.logo === null)){
        EnviarImagem($(this), 
        function (repo) {
            dataEmpresa.logo = repo;
            CarregarLogoEmpresa();
        });
    }
}

function CarregarLogoEmpresa()
{
    if ((dataEmpresa.logo !== null) && (dataEmpresa.logo !== undefined) && (dataEmpresa.logo !== 0)){
        RestRequest(
            'GET',
            $baseApiUrl+'Imagem?codigo=' + dataEmpresa.logo,
            null,
            function (xhr) {
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            function (response, textStatus, jqXHR) {
                $('#LogoEmpresa').attr('src', response);      
            });    
    }
}

function EmpresaEditarBairroClick(e){
    event.preventDefault();
    dataBairro = dataEmpresa.bairro;
    bairroClick(EmpresaBairroSuccess);
}

function EmpresaNovoBairroClick(e){
    event.preventDefault();
    dataBairro = {id: 0,descricao:"",municipio:null};
    bairroClick(EmpresaBairroSuccess);
}

function EmpresaBairroSuccess (response, textStatus, jqXHR){
    dataEmpresa.bairroId = response.id;
    dataEmpresa.bairro = response;    
                                    
    $('#bairro').val(response.descricao);
    $('#municipio').val(response.municipio.descricao);
    $('#uf').val(response.municipio.uf);                                              
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