var dataMunicipio = undefined;
var modalMunicipio = undefined;

function MunicipioClick(onSuccessCallback)
{
    modalMunicipio = createDynamicModal();       

    modalMunicipio = createDynamicModal();
    modalMunicipio.find('.modal-footer').html(`
        <div class="me-auto">
        <button id="${gerarHash(16)}" onclick="NovoMunicipioClick(this);" class="btn btn-primary"><i class="fa fa-plus-circle"></i> Novo cadastro</button>
        </div>
        <div class="ms-auto">
        <button id="${gerarHash(16)}" class="btn btn-success btn-salvar-municipio"><i class="fa fa-check"></i> Salvar</button>
        </div>
        `);

    modalMunicipio.find('.btn-salvar-municipio').click(e => {
        e.preventDefault();
        SalvarMunicipio(onSuccessCallback);
    });

    ResetDefaultMunicipio();
}

function NovoMunicipioClick(e){
    event.preventDefault();
    ResetDefaultMunicipio();
}

function SalvarMunicipio(onSuccessCallback){
    dataMunicipio.descricao = validarValor($('#MunicipioDescricao').val());
    dataMunicipio.uf = validarValor($('#MunicipioUf').val());
    dataMunicipio.ibge = validarValor($('#MunicipioIbge').val());

    RestRequest((dataMunicipio.id === 0 ? 'POST' : 'PUT'),
        $baseApiUrl+"Municipio"+(dataMunicipio.id === 0 ? '' : `/${dataMunicipio.id}`),
        dataMunicipio,
        null,
        function (response, textStatus, jqXHR) {
            if (jqXHR.status === 201){
                dataMunicipio = response;
            }

            hideLoadingModal();

            modalMunicipio.modal('hide');
            
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, textStatus, jqXHR);
            }                   
        });     
}

function ResetDefaultMunicipio(onLoadCallback)
{
    dataMunicipio = {id: 0, descricao: null};

    carregarTemplateModal('#'+modalMunicipio.attr('id'),
    'templates/Municipio.html #frmMunicipio', {
        modalTitle: 'Municipio',
        modalSize: 'modal-md animate__animated animate__backInUp',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=Municipio',
        autocompleteCampo: '#'+modalMunicipio.find('.search').attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if ((item.id !== 0) && (item.id !== null) && (item !== undefined))
                {
                    RestRequest('GET',
                        $baseApiUrl+"Municipio/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataMunicipio = data;
                            hideLoadingModal();
                            toggleModalBody('#'+modalMunicipio.attr('id'), false);
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
            
            modalMunicipio.modal('show');

            setTimeout(() => {
                toggleModalBody('#'+modalMunicipio.attr('id'), false);
                $('#MunicipioDescricao').focus();
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
        $baseApiUrl+'apiservice/ibge',
        {modulo:"Municipio", descricao: $('#MunicipioDescricao').val() , uf: $('#MunicipioUf').val() },
        null,
        function(data){
            hideLoadingModal();
            $('#MunicipioIbge').val(data);
        });
}