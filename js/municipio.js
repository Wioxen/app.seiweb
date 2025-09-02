var dataMunicipio = undefined;
var $thisMunicipio = undefined;
var $modalMunicipio = undefined;

function MunicipioClick(e, data, callbackOnClose)
{
    $thisMunicipio = $(e);

    $modalMunicipio = createDynamicModal("Município", 
        "modal-md modal-dialog-centered animate__animated animate__backInUp", 
        "",
    callbackOnClose);

    configurarAutocomplete(
        '#Pesquisar'+$modalMunicipio.attr('id'),
        $baseApiUrl+'AutoComplete?table=Municipio',
        {
            minLength: 2,
            delay: 300,
            onSelect: function(item) {
                toggleModalBody('#'+$modalMunicipio.attr('id'), false);
                if (item.id != 0)
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
    $('#btnSalvar'+$modalMunicipio.attr('id')).click(SalvarMunicipioClick);

    if ((data !== null) && (data !== undefined))
    {
        dataMunicipio = data;
        LoadMunicipio(function(response, status, xhr){
            toggleModalBody('#'+$modalMunicipio.attr('id'), false);
            setTimeout(() => {
                $('#MunicipioDescricao').val(dataMunicipio.descricao).focus();
            }, 600);
        });
    } else 
    {
        LoadMunicipio();
    }    
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
    LoadMunicipio(function(response, status, xhr){
        setTimeout(() => {
            $('#Pesquisar'+$modalMunicipio.attr('id')).focus();
        }, 500);            
    });
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

function SalvarMunicipioClick(e){
    e.preventDefault();

    if ((dataMunicipio !== undefined) && (dataMunicipio !== null)){
        dataMunicipio.descricao = $('#MunicipioDescricao').val().toUpperCase();
        dataMunicipio.uf = $('#MunicipioUf').val().trim() ? $('#MunicipioUf').val().toUpperCase() : null;
        dataMunicipio.ibge = $('#MunicipioIbge').val().toUpperCase();
    
        RestRequest((dataMunicipio.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Municipio"+(dataMunicipio.id === 0 ? '' : `/${dataMunicipio.id}`),
            dataMunicipio,
            null,
            function (response, textStatus, jqXHR) {
                hideLoadingModal();

                if (jqXHR.status === 201){
                    dataMunicipio.id = response.id;
                }

                $modalMunicipio.modal('hide');
            });  
    }    
}

function LoadMunicipio(onLoadCallback)
{
    carregarTemplateModal('#'+$modalMunicipio.attr('id'),
    'templates/Municipio.html #frmMunicipio', {
        modalTitle: 'Municipio',
        modalSize: 'modal-md',
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