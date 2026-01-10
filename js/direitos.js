var dataDireitos = undefined;
var cadastroDireitos = undefined;
var modalDireitos = undefined;

const resourceDireitos = 'Role';

function DireitosClick(e){
    var thisDireitos = $(e);
    
    RestRequest('GET',
        `${$baseApiUrl}${resourceDireitos}`,
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
                                <li><a class="dropdown-item" href="#" onclick="EditarDireitosClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
                                </ul>
                                </div>`                        
                    }
                }];  

            cadastroDireitos = 
                CarregaDataTable
                (
                    'datatable?table='+resourceDireitos,
                    'Direitos do usuário',
                    'modal-lg',
                    `<table id="${resourceDireitos}Tb" class="row-border stripe hover" style="width:100%"></table>`,
                    `<div class="footer-buttons">
                        <button id="btnNovo${resourceDireitos}" type="button" class="btn btn-success" onclick="Novo${resourceDireitos}Click(this);">
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

function ResetDefaultDireitos(onLoadCallback){
    hideLoadingModal();
    
    modalDireitos = createDynamicModal(function(){
        dataDireitos = null;
    });        

    modalDireitos.find('.modal-header-search').hide();

    carregarTemplateModal('#'+modalDireitos.attr('id'),
        'templates/Direitos.html #frmDireitos', {
        modalTitle: 'Direitos',       
        modalSize: 'modal-dialog-scrollable modal-lg',
        onLoad: function(response, status, xhr)
        {            
            preencherFormularioCompleto(dataDireitos, '#frmDireitos');

            modalDireitos.find('.btn-cancelar').click(CancelarDireitosClick);
            modalDireitos.find('.btn-excluir').click(ExcluirDireitosClick);    
            modalDireitos.find('.btn-salvar').click(SalvarDireitosClick);             
            
            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }
    });  
}

function NovoDireitosClick(e){
    event.preventDefault();
    
    dataDireitos = {id: 0, descricao: null};

    ResetDefaultDireitos(function(){
        GetModuloAcessos(function(){
            modalDireitos.modal('show');
            toggleModalBody('#'+modalDireitos.attr('id'), false);
            setTimeout(() => {
                $('#DireitosDescricao').focus();
            }, 500);            
        });
    })  
}

function CancelarDireitosClick(e){
    e.preventDefault();
    dataDireitos = undefined;
    modalDireitos.modal('hide');
}

function EditarDireitosClick(e){
    GetDireitos(e.closest('tr').id,function(data){
        dataDireitos = data;
        ResetDefaultDireitos(function(){
            GetModuloAcessos(function(data){
                var _acessos = dataDireitos.acessos.split(',');
                
                $.each(_acessos,function(i,v){
                    $('#'+v).prop('checked',true);
                });

                modalDireitos.modal('show');
                toggleModalBody('#'+modalDireitos.attr('id'), false);            
                setTimeout(() => {
                    $('#DireitosDescricao').focus();
                }, 500);            
            });
        });       
    })
}

function SalvarDireitosClick(e){
    e.preventDefault();

    if ((dataDireitos !== undefined) && (dataDireitos !== null)){
        dataDireitos.descricao = StrToValue($('#DireitosDescricao').val());

        var _acessos = $('.form-check-input:checked').map(function() {
            return $(this).attr('id');
        }).get().join(',');

        dataDireitos.acessos = _acessos;

        RestRequest((dataDireitos.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Role"+(dataDireitos.id === 0 ? '' : `/${dataDireitos.id}`),
            dataDireitos,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataDireitos.id = response.id;
                }                
                hideLoadingModal();
                modalDireitos.modal('hide');
                cadastroDireitos.tabela.ajax.reload();
            });  
    }    
}

function ExcluirDireitosClick(e){
    e.preventDefault();
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
                            cadastroDireitos.tabela.ajax.reload();
                        }, 500);                     
                    });  
            });        
        }
    }
}

function GetDireitos(id,onSuccessCallback){
    RestRequest('GET',
        $baseApiUrl+"Role/"+id,
        null,
        null,
        function(response, status, xhr){
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });    
}

function GetModuloAcessos(onSuccessCallback)
{
    RestRequest('GET',
        $baseApiUrl+"DireitosUsuario",
        null,
        function(xhr){
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, status, xhr){
            $('#modulesList').empty();
            $('#moduleacessos').empty();
			
			console.log(response);
			
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
                        <input id="${val.module}" class="form-check-input me-1 ${val.parent}" type="checkbox" data-parent="${val.parent}" value="">
                        ${val.title}
                    </label>`);
                });                              
            });

            $('.form-check-input').change(function(){
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
            });

            $('.btn-module').click(function(e){
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
            });                

            $('.list-group-item-module').click(function(){
                var $this = $(this);
                $('.list-group-item-module').removeClass('active');
                $this.addClass('active');

                $('.list-group-item-acesso').addClass('d-none');
                $('.'+$(this).attr('id')).removeClass('d-none');

                $('.btn-module').addClass('d-none');
                $('#btn-'+$(this).attr('id')).removeClass('d-none');
            });

            $('.list-group-item-module').first().trigger('click');

            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }           
        });       
}