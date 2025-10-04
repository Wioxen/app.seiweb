var dataMunicipio = undefined;
var $modalMunicipio = undefined;

function MunicipioClick(onSuccessCallback)
{
    $modalMunicipio = createDynamicModal();
    
    configurarAutocomplete(
        '#Pesquisar'+$modalMunicipio.attr('id'),
        $baseApiUrl+'AutoComplete?table=Municipio',
        {
            minLength: 2,
            delay: 300,
            onSelect: function(item) {
                toggleModalBody('#'+$modalMunicipio.attr('id'), false);
                if ((item.id !== 0) && (item.id !== null))
                {
                    RestRequest('GET',
                        $baseApiUrl+"Municipio/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataMunicipio = data;
                            hideLoadingModal();
                            setTimeout(() => {
                                $('#MunicipioDescricao').val(dataMunicipio.descricao).focus();
                                $('#MunicipioUf').val(dataMunicipio.uf);
                                $('#MunicipioIbge').val(dataMunicipio.ibge);
                            }, 500);            
                        });    
                }
            }
        }
    );    

    $('#btnNovo'+$modalMunicipio.attr('id')).click(NovoMunicipioClick);
    $('#btnCancelar'+$modalMunicipio.attr('id')).click(CancelarMunicipioClick);
    $('#btnExcluir'+$modalMunicipio.attr('id')).click(ExcluirMunicipioClick);
    $('#btnSalvar'+$modalMunicipio.attr('id')).click(e => {
        e.preventDefault();
        SalvarMunicipio(onSuccessCallback);
    });

    LoadMunicipio();
}

function NovoMunicipioClick(e){
    e.preventDefault();
    dataMunicipio = {id: 0};
    LoadMunicipio(function(response, status, xhr){
        toggleModalBody('#'+$modalMunicipio.attr('id'), false);
        setTimeout(() => {
            $('#MunicipioDescricao').focus();
        }, 500);
    });
}

function CancelarMunicipioClick(e){
    e.preventDefault();
    dataMunicipio = undefined;
    $modalMunicipio.modal('hide');
}

function ExcluirMunicipioClick(e){
    e.preventDefault();
    if ((dataMunicipio !== undefined) && (dataMunicipio !== null)){
        if (dataMunicipio.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"Municipio/"+dataMunicipio.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarMunicipioClick(e);
                        }, 500);                     
                    });  
            });        
        }
    }
}

function SalvarMunicipio(onSuccessCallback){
    if ((dataMunicipio !== undefined) && (dataMunicipio !== null)){
        dataMunicipio.descricao = $('#MunicipioDescricao').val().toUpperCase();
        dataMunicipio.uf = ($('#MunicipioUf').val() !== null) ? ($('#MunicipioUf').val().trim() ? $('#MunicipioUf').val().toUpperCase() : null) : null;
        dataMunicipio.ibge = $('#MunicipioIbge').val().toUpperCase();
    
        RestRequest((dataMunicipio.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Municipio"+(dataMunicipio.id === 0 ? '' : `/${dataMunicipio.id}`),
            dataMunicipio,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataMunicipio.id = response.id;
                }
                RestRequest('GET',
                    $baseApiUrl+'municipio/' + dataMunicipio.id,
                    null,
                    function (xhr) {
                        xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    },
                    function (response, textStatus, jqXHR) {
                        hideLoadingModal();

                        $modalMunicipio.modal('hide');
                        
                        if (typeof onSuccessCallback === 'function') {
                            onSuccessCallback(response, textStatus, jqXHR);
                        }                
                    }); 
            });  
    }    
}

function LoadMunicipio(onLoadCallback)
{
    carregarTemplateModal('#'+$modalMunicipio.attr('id'),
    'templates/Municipio.html #frmMunicipio', {
        modalTitle: 'Municipio',
        modalSize: 'modal-dialog-centered modal-md animate__animated animate__backInDown',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=Municipio',
        autocompleteCampo: '#Pesquisar'+$modalMunicipio.attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if (item.id != 0)
                {
                    RestRequest('GET',
                        $baseApiUrl+"Municipio/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataMunicipio = data;
                            hideLoadingModal();
                            toggleModalBody('#'+$modalMunicipio.attr('id'), false);
                            setTimeout(() => {
                                $('#MunicipioDescricao').val(dataMunicipio.descricao).focus();
                                $('#MunicipioUf').val(dataMunicipio.uf).change();
                                $('#MunicipioIbge').val(dataMunicipio.ibge);
                            }, 500);             
                        });
                }
            }
        },
        onLoad: function(response, status, xhr)
        {
            carregaSelect('lista/estados','#selectMunicipioUf','uf');

            $('#btnIbge').off('click').on('click', BuscarCodigoIbge);

            toggleModalBody('#'+$modalMunicipio.attr('id'), false);

            setTimeout(() => {
                $('#MunicipioDescricao').val((dataMunicipio === null || dataMunicipio === undefined)?"":dataMunicipio.descricao).focus();
                $('#MunicipioUf').val((dataMunicipio === null || dataMunicipio === undefined)?"":dataMunicipio.uf);
                $('#MunicipioIbge').val((dataMunicipio === null || dataMunicipio === undefined)?"":dataMunicipio.ibge);
            }, 600);

           if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }
    });  
}

function BuscarCodigoIbge(e){
    e.preventDefault();

    RestRequest('POST',
        $baseApiUrl+'municipio/ibge',
        {descricao: $('#MunicipioDescricao').val() , uf: $('#MunicipioUf').val() },
        null,
        function(data){
            hideLoadingModal();
            $('#MunicipioIbge').val(data);
        });
}

function GetMunicipio(id, onSuccessCallback){
    RestRequest('GET',
                $baseApiUrl+'municipio/' + id,
                null,
                null,
                function (response, textStatus, jqXHR) {
                    hideLoadingModal();
                    if (typeof onSuccessCallback === 'function') {
                        onSuccessCallback(response, textStatus, jqXHR);
                    }
                });      
}