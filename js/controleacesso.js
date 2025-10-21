var dataControleAcesso = undefined;
var cadastroControleAcesso = undefined;
var modalControleAcesso = undefined;

function ControleAcessoClick(e){
    var thisControleAcesso = $(e);
    
    RestRequest('GET',
        `${$baseApiUrl}${resourceEmpresa}`,
        null,
        null,
        function (data) {
            hideLoadingModal();

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
                                <li><a class="dropdown-item" href="#" onclick="EditarControleAcessoClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
                                </ul>
                                </div>`                        
                    }
                }];  

            cadastroControleAcesso = 
                CarregaDataTable
                (
                    'datatable?table=ControleAcesso',
                    'Controle de acesso',
                    'modal-lg',
                    `<table id="ControleAcessoTb" class="row-border stripe hover" style="width:100%"></table>`,
                    `<div class="footer-buttons">
                        <button id="btnNovoControleAcesso" type="button" class="btn btn-success" onclick="NovoControleAcessoClick(this);">
                            <i class="fa fa-plus-circle me-2"></i>Novo Cadastro
                        </button>
                    </div>`,
                    null,
                    defaultColumns,
                    null,
                    false
                );
        }
    );
}

function ResetDefaultControleAcesso(onLoadCallback){
    hideLoadingModal();
    
    modalControleAcesso = createDynamicModal(function(){
        dataControleAcesso = null;
    });        

    modalControleAcesso.find('.modal-header-search').hide();

    carregarTemplateModal('#'+modalControleAcesso.attr('id'),
        'templates/ControleAcesso.html #frmControleAcesso', {
        modalTitle: 'Configuração de acesso',       
        modalSize: 'modal-dialog-scrollable modal-lg',
        onLoad: function(response, status, xhr)
        {            
            preencherFormularioCompleto(dataControleAcesso, '#frmControleAcesso');

            modalControleAcesso.find('.btn-cancelar').click(CancelarControleAcessoClick);
            modalControleAcesso.find('.btn-excluir').click(ExcluirControleAcessoClick);    
            modalControleAcesso.find('.btn-salvar').click(SalvarControleAcessoClick);             
            
            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }
    });  
}

function NovoControleAcessoClick(e){
    event.preventDefault();
    
    dataControleAcesso = {id: 0, descricao: null};

    ResetDefaultControleAcesso(function(){
        GetModuloAcessos(function(){
            modalControleAcesso.modal('show');
            toggleModalBody('#'+modalControleAcesso.attr('id'), false);
            setTimeout(() => {
                $('#ControleAcessoDescricao').focus();
            }, 500);            
        });
    })  
}

function CancelarControleAcessoClick(e){
    e.preventDefault();
    dataControleAcesso = undefined;
    modalControleAcesso.modal('hide');
}

function EditarControleAcessoClick(e){
    GetControleAcesso(e.closest('tr').id,function(data){
        dataControleAcesso = data;
        ResetDefaultControleAcesso(function(){
            GetModuloAcessos(function(data){
                var _acessos = dataControleAcesso.acessos.split(',');
                
                $.each(_acessos,function(i,v){
                    $('#'+v).prop('checked',true);
                });

                modalControleAcesso.modal('show');
                toggleModalBody('#'+modalControleAcesso.attr('id'), false);            
                setTimeout(() => {
                    $('#ControleAcessoDescricao').focus();
                }, 500);            
            });
        });       
    })
}

function SalvarControleAcessoClick(e){
    e.preventDefault();

    if ((dataControleAcesso !== undefined) && (dataControleAcesso !== null)){
        dataControleAcesso.descricao = StrToValue($('#ControleAcessoDescricao').val());

        var _acessos = $('.form-check-input:checked').map(function() {
            return $(this).attr('id');
        }).get().join(',');

        dataControleAcesso.acessos = _acessos;

        RestRequest((dataControleAcesso.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"ControleAcesso"+(dataControleAcesso.id === 0 ? '' : `/${dataControleAcesso.id}`),
            dataControleAcesso,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataControleAcesso.id = response.id;
                }                
                hideLoadingModal();
                modalControleAcesso.modal('hide');
                cadastroControleAcesso.tabela.ajax.reload();
            });  
    }    
}

function ExcluirControleAcessoClick(e){
    e.preventDefault();
    if ((dataControleAcesso !== undefined) && (dataControleAcesso !== null)){
        if (dataControleAcesso.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"ControleAcesso/"+dataControleAcesso.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarControleAcessoClick(e);
                            cadastroControleAcesso.tabela.ajax.reload();
                        }, 500);                     
                    });  
            });        
        }
    }
}

function GetControleAcesso(id,onSuccessCallback){
    RestRequest('GET',
        $baseApiUrl+"ControleAcesso/"+id,
        null,
        null,
        function(response, status, xhr){
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });    
}