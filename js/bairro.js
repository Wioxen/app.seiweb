var dataBairro = undefined;
var $thisBairro = undefined;
var $modalBairro = undefined;

function bairroClick(e, data, callbackOnClose)
{
    $thisBairro = $(e);
    //dataBairro = undefined;    
    $modalBairro = createDynamicModal
    (
        "Bairro", 
        "modal-md modal-dialog-centered animate__animated animate__backInDown", 
        `<div class="dropdown dropup">
            <button class="btn btn-secondary btn-crud-x1" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-list"></i>
            </button>
            <ul id="crud-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
            <a class="dropdown-item" href="#" onclick="BairroMunicipioClick(this);">MUNICÍPIO</a></li>
            </ul>
        </div>`
    , callbackOnClose);

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
                        function (data) {
                            dataBairro = data;
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
    $('#btnSalvar'+$modalBairro.attr('id')).click(SalvarBairroClick);

    if ((data !== null) && (data !== undefined))
    {
        dataBairro = data;
        LoadBairro(function(response, status, xhr){
            toggleModalBody('#'+$modalBairro.attr('id'), false);
            setTimeout(() => {
                $('#BairroDescricao').val(dataBairro.descricao).focus();
            }, 600);
        });
    } else 
    {
        LoadBairro();
    }    
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
    LoadBairro(function(response, status, xhr){
        setTimeout(() => {
            $('#Pesquisar'+$modalBairro.attr('id')).focus();
        }, 500);            
    });
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

function SalvarBairroClick(e){
    e.preventDefault();

    if ((dataBairro !== undefined) && (dataBairro !== null)){
        dataBairro.descricao = $('#BairroDescricao').val().toUpperCase();
    
        RestRequest((dataBairro.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Bairro"+(dataBairro.id === 0 ? '' : `/${dataBairro.id}`),
            dataBairro,
            null,
            function (response, textStatus, jqXHR) {
                hideLoadingModal();
                if (jqXHR.status === 201){
                    dataBairro.id = response.id;
                }
                $modalBairro.modal('hide');
            });  
    }    
}

function LoadBairro(onLoadCallback)
{
    carregarTemplateModal('#'+$modalBairro.attr('id'),
    'templates/Bairro.html #frmBairro', {
        modalTitle: 'Bairro',
        modalSize: 'modal-md',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=Bairro',
        autocompleteCampo: '#Pesquisar'+$modalBairro.attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if (item.id != 0)
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
                        dataBairro.municipioId = null;
                        dataBairro.municipio = null;
                        $('#BairroMunicipio').val('');    

                        if ((item.id !== 0) && (item.id !== null))
                        {
                            dataBairro.municipioId = item.id;
                            $('#BairroMunicipio').val(item.descricao);    
                        }

                        if (item.id === 0){
                            MunicipioClick(
                            $('#BairroMunicipio'),
                            {id: 0, descricao: item.descricao, ibge: ""}, 
                            function()
                            {
                                if ((dataMunicipio !== undefined) && (dataMunicipio !== null))
                                {
                                    dataBairro.municipioId = dataMunicipio.id;
                                    dataBairro.municipio = dataMunicipio;
                                    $('#BairroMunicipio').val(dataMunicipio.descricao);
                                }
                            });
                        }                        
                    }
                }
            );  

            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }        
    });  
}

function BairroMunicipioClick(e){
    MunicipioClick(e);
}