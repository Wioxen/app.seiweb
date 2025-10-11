var dataBairro = undefined;
var modalBairro = undefined;

function bairroClick(onSuccessCallback)
{
    modalBairro = createDynamicModal();
    modalBairro.find('.modal-footer').html(`
        <div class="me-auto">
        <button id="${gerarHash(16)}" onclick="NovoBairroClick(this);" class="btn btn-primary"><i class="fa fa-plus-circle"></i> Novo cadastro</button>
        </div>
        <div class="ms-auto">
        <button id="${gerarHash(16)}" class="btn btn-success btn-salvar-bairro"><i class="fa fa-check"></i> Salvar</button>
        </div>
        `);

    modalBairro.find('.btn-salvar-bairro').click(e => {
        e.preventDefault();
        console.log(dataBairro)
        SalvarBairro(onSuccessCallback);
    });

    ResetDefaultBairro();
}

function NovoBairroClick(e){
    event.preventDefault();
    ResetDefaultBairro();
}

function SalvarBairro(onSuccessCallback)
{
    dataBairro.descricao = validarValor($('#BairroDescricao').val());

    RestRequest((dataBairro.id === 0 ? 'POST' : 'PUT'),
        $baseApiUrl+"Bairro"+(dataBairro.id === 0 ? '' : `/${dataBairro.id}`),
        dataBairro,
        null,
        function (response, textStatus, jqXHR) {                    
            if (jqXHR.status === 201){
                dataBairro = response;
            }

            hideLoadingModal();

            modalBairro.modal('hide');
            
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, textStatus, jqXHR);
            }                
        });     
}

function ResetDefaultBairro(onLoadCallback)
{
    dataBairro = {id: 0, descricao: null};
    
    carregarTemplateModal('#'+modalBairro.attr('id'),
    'templates/Bairro.html #frmBairro', {
        modalTitle: 'Bairro',
        modalSize: 'modal-md animate__animated animate__backInDown',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=Bairro',
        autocompleteCampo: '#'+modalBairro.find('.search').attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if ((item.id !== 0) && (item.id !== null) && (item !== undefined))
                {
                    RestRequest('GET',
                        $baseApiUrl+"Bairro/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataBairro = data;
                            hideLoadingModal();
                            toggleModalBody('#'+modalBairro.attr('id'), false);
                            setTimeout(() => {
                                preencherFormularioCompleto(data, '#frmBairro');
                                CarregaBairroMunicipio();
                                $('#BairroDescricao').focus();
                            }, 500);             
                        });
                }
            }
        },
        onLoad: function(response, status, xhr)
        {
            CarregaBairroMunicipio();

            modalBairro.modal('show');

            setTimeout(() => {
                toggleModalBody('#'+modalBairro.attr('id'), false);
                $('#BairroDescricao').focus();
            }, 500);

            if (typeof onLoadCallback === 'function') 
            {
                onLoadCallback(response, status, xhr);
            }            
        }        
    });  
}

function BairroNovoMunicipioClick(e){
    event.preventDefault();
    MunicipioClick(BairroMunicipioSuccess);
}

function BairroMunicipioSuccess(){
    dataBairro.municipioId = dataMunicipio.id;
    CarregaBairroMunicipio();
}

function CarregaBairroMunicipio(){
    carregaSelect2('Municipio',modalBairro,'#selectBairroMunicipio',
    function(response, textStatus, jqXHR){
        $('#BairroMunicipio')
            .val(safeGet(dataBairro, 'municipioId'))
            .trigger('change');    
    },
    {},
    function(data,element){
    },
    function(data, value, element){
        $('#MunicipioUF').empty();
        if ((data !== null) && (data !== undefined)){
            dataBairro.municipioId = data.id;
            $('#MunicipioUF').html(`<span class="badge text-bg-dark">${data.uf}</span>`);
        }
    });    
}
