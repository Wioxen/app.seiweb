var dataBairro = undefined;
var $modalBairro = undefined;

function bairroClick(onSuccessCallback)
{
    $modalBairro = createDynamicModal();

     configurarAutocomplete(
        '#Pesquisar'+$modalBairro.attr('id'),
        $baseApiUrl+'AutoComplete?table=Bairro',
        {
            minLength: 2,
            delay: 300,
            onSelect: function(item) {
                toggleModalBody('#'+$modalBairro.attr('id'), false);
                
                if (item.id !== 0)
                {
                    RestRequest('GET',
                        $baseApiUrl+"Bairro/"+item.id,
                        null,
                        null,
                        function (r) {
                            dataBairro = r;
                            hideLoadingModal();
                            setTimeout(() => {
                                $('#BairroDescricao').val(dataBairro.descricao).focus();
                                $('#BairroMunicipio').val(dataBairro.municipio.descricao);
                            }, 500);            
                        });    
                }
            }
        }
    );    

    $('#btnNovo'+$modalBairro.attr('id')).click(NovoBairroClick);
    $('#btnCancelar'+$modalBairro.attr('id')).click(CancelarBairroClick);
    $('#btnExcluir'+$modalBairro.attr('id')).click(ExcluirBairroClick);
    $('#btnSalvar'+$modalBairro.attr('id')).click(e => {
        e.preventDefault();
        SalvarBairro(onSuccessCallback);
    });

    LoadBairro();
}

function NovoBairroClick(e){
    e.preventDefault();
    dataBairro = {id: 0};
    LoadBairro(function(response, status, xhr){
        toggleModalBody('#'+$modalBairro.attr('id'), false);
        setTimeout(() => {
            $('#BairroDescricao').focus();
        }, 500);
    });
}

function CancelarBairroClick(e){
    e.preventDefault();
    dataBairro = undefined;
    $modalBairro.modal('hide');
}

function ExcluirBairroClick(e){
    e.preventDefault();
    if ((dataBairro !== undefined) && (dataBairro !== null)){
        if (dataBairro.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"Bairro/"+dataBairro.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarBairroClick(e);
                        }, 500);                     
                    });  
            });        
        }
    }
}

function SalvarBairro(onSuccessCallback)
{
    if ((dataBairro !== undefined) && (dataBairro !== null)){
        dataBairro.descricao = $('#BairroDescricao').val().toUpperCase();
    
        RestRequest((dataBairro.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Bairro"+(dataBairro.id === 0 ? '' : `/${dataBairro.id}`),
            dataBairro,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataBairro.id = response.id;
                }
                RestRequest('GET',
                    $baseApiUrl+'bairro/' + dataBairro.id,
                    null,
                    function (xhr) {
                        xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    },
                    function (response, textStatus, jqXHR) {
                        hideLoadingModal();

                        $modalBairro.modal('hide');
                        
                        if (typeof onSuccessCallback === 'function') {
                            onSuccessCallback(response, textStatus, jqXHR);
                        }                
                    });                  
            });  
    }    
}

function LoadBairro(onLoadCallback)
{
    carregarTemplateModal('#'+$modalBairro.attr('id'),
    'templates/Bairro.html #frmBairro', {
        modalTitle: 'Bairro',
        modalSize: 'modal-dialog-centered modal-md animate__animated animate__backInDown',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=Bairro',
        autocompleteCampo: '#Pesquisar'+$modalBairro.attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if ((item.id !== 0) && (item.id !== null))
                {
                    RestRequest('GET',
                        $baseApiUrl+"Bairro/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataBairro = data;
                            hideLoadingModal();
                            toggleModalBody('#'+$modalBairro.attr('id'), false);
                            setTimeout(() => {
                                preencherFormularioCompleto(data, '#frmBairro');
                                $('#BairroDescricao').focus();
                            }, 500);             
                        });
                }
            }
        },
        onLoad: function(response, status, xhr)
        {
            configurarAutocomplete(
                '#BairroMunicipio',
                $baseApiUrl+'AutoComplete?table=Municipio',
                {
                    minLength: 2,
                    delay: 300,    
                    onResponse: function(event,ui) {
                        if (!ui.content.length) {
                            ui.content.push({id: 0, descricao: $('#BairroMunicipio').val().toUpperCase()});
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
                            dataMunicipio = {id: 0, descricao: item.descricao};
                            MunicipioClick(BairroMunicipioSuccess);
                        }
                        else 
                        {
                            GetMunicipio(item.id,function(response){
                                dataBairro.municipio = response;
                                dataBairro.municipioId = response.id;
                                $('#municipio').val(response.descricao);                                                    
                            });
                        }                      
                    }
                }
            );  

            toggleModalBody('#'+$modalBairro.attr('id'), false);

            setTimeout(() => {
                $('#BairroDescricao').val((dataBairro === null || dataBairro === undefined)?"":dataBairro.descricao).focus();
                $('#BairroMunicipio').val((dataBairro === null || dataBairro === undefined)?"":dataBairro.municipio.descricao);
            }, 600);

            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }        
    });  
}

function BairroEditarMunicipioClick(e){
    event.preventDefault();
    dataMunicipio = dataBairro.municipio;
    MunicipioClick(BairroMunicipioSuccess);
}

function BairroNovoMunicipioClick(e){
    event.preventDefault();
    dataMunicipio = {id: 0,descricao:"",municipio:null};
    MunicipioClick(BairroMunicipioSuccess);
}

function BairroMunicipioSuccess(){
    dataBairro.municipioId = response.id;
    dataBairro.municipio = response;    
    $('#BairroMunicipio').val(response.descricao);
}

function GetBairro(id,onSuccessCallback)
{
    RestRequest('GET',
                $baseApiUrl+'bairro/' + id,
                null,
                null,
                function (response, textStatus, jqXHR) {
                    hideLoadingModal();
                    if (typeof onSuccessCallback === 'function') {
                        onSuccessCallback(response, textStatus, jqXHR);
                    }
                });    
}