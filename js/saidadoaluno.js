var dataSaidaDoAluno = undefined;
var $modalSaidaDoAluno = undefined;

function SaidaDoAlunoClick(onSuccessCallback, onExcluirSuccessCallback)
{
    $modalSaidaDoAluno = createDynamicModal();

    $('#btnNovo'+$modalSaidaDoAluno.attr('id')).click(NovoSaidaDoAlunoClick);
    $('#btnCancelar'+$modalSaidaDoAluno.attr('id')).click(CancelarSaidaDoAlunoClick);
    $('#btnExcluir'+$modalSaidaDoAluno.attr('id')).click(e => {
        e.preventDefault();
        ExcluirSaidaDoAluno(onExcluirSuccessCallback);
    });
    $('#btnSalvar'+$modalSaidaDoAluno.attr('id')).click(e => {
        e.preventDefault();
        SalvarSaidaDoAluno(onSuccessCallback);
    });

    LoadSaidaDoAluno();
}

function NovoSaidaDoAlunoClick(e){
    e.preventDefault();
    dataSaidaDoAluno = {id: 0};
    LoadSaidaDoAluno(function(response, status, xhr){
        toggleModalBody('#'+$modalSaidaDoAluno.attr('id'), false);
        setTimeout(() => {
            $('#SaidaDoAlunoDescricao').focus();
        }, 500);
    });
}

function CancelarSaidaDoAlunoClick(e){
    e.preventDefault();
    dataSaidaDoAluno = undefined;
    $modalSaidaDoAluno.modal('hide');
}

function ExcluirSaidaDoAluno(onExcluirSuccessCallback){
    if ((dataSaidaDoAluno !== undefined) && (dataSaidaDoAluno !== null)){
        if (dataSaidaDoAluno.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"SaidaDoAluno/"+dataSaidaDoAluno.id,
                    null,
                    null,
                    function (response, textStatus, jqXHR) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarSaidaDoAlunoClick(e);
                            if (typeof onExcluirSuccessCallback === 'function') {
                                onExcluirSuccessCallback(response, textStatus, jqXHR);
                            }                                 
                        }, 500);                     
                    });  
            });        
        }
    }
}

function SalvarSaidaDoAluno(onSuccessCallback)
{
    if ((dataSaidaDoAluno !== undefined) && (dataSaidaDoAluno !== null)){
        dataSaidaDoAluno.descricao = $('#SaidaDoAlunoDescricao').val().toUpperCase();
        dataSaidaDoAluno.cor = $('input[name="color"]:checked').val();

        RestRequest((dataSaidaDoAluno.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"SaidaDoAluno"+(dataSaidaDoAluno.id === 0 ? '' : `/${dataSaidaDoAluno.id}`),
            dataSaidaDoAluno,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataSaidaDoAluno.id = response.id;
                }
                RestRequest('GET',
                    $baseApiUrl+'SaidaDoAluno/' + dataSaidaDoAluno.id,
                    null,
                    function (xhr) {
                        xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    },
                    function (response, textStatus, jqXHR) {
                        hideLoadingModal();

                        $modalSaidaDoAluno.modal('hide');
                        
                        if (typeof onSuccessCallback === 'function') {
                            onSuccessCallback(response, textStatus, jqXHR);
                        }                
                    });                  
            });  
    }    
}

function LoadSaidaDoAluno(onLoadCallback)
{
    carregarTemplateModal('#'+$modalSaidaDoAluno.attr('id'),
    'templates/SaidaDoAluno.html #frmSaidaDoAluno', {
        modalTitle: 'Saída',
        modalSize: 'modal-dialog-centered modal-md animate__animated animate__backInDown',
        autocompleteUrl: $baseApiUrl+'AutoComplete?table=SaidaDoAluno',
        autocompleteCampo: '#Pesquisar'+$modalSaidaDoAluno.attr('id'),
        autocomplete: {
            onSelect: function(item) {
                if ((item.id !== 0) && (item.id !== null))
                {
                    RestRequest('GET',
                        $baseApiUrl+"SaidaDoAluno/"+item.id,
                        null,
                        null,
                        function (data) {
                            dataSaidaDoAluno = data;
                            hideLoadingModal();
                            toggleModalBody('#'+$modalSaidaDoAluno.attr('id'), false);
                            setTimeout(() => {
                                preencherFormularioCompleto(data, '#frmSaidaDoAluno');
                                $(`input[name="color"][value="${dataSaidaDoAluno.cor}"]`).prop('checked', true);
                                $('#SaidaDoAlunoDescricao').focus();
                            }, 500);             
                        });
                }
            }
        },
        onLoad: function(response, status, xhr)
        {
            toggleModalBody('#'+$modalSaidaDoAluno.attr('id'), false);

            setTimeout(() => {
                if ((dataSaidaDoAluno !== null) && (dataSaidaDoAluno !== undefined)){
                    $('#SaidaDoAlunoDescricao').val(dataSaidaDoAluno.descricao).focus();
                }
            }, 600);

            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }        
    });  
}

function GetSaidaDoAluno(id,onSuccessCallback)
{
    RestRequest('GET',
                $baseApiUrl+'SaidaDoAluno/' + id,
                null,
                null,
                function (response, textStatus, jqXHR) {
                    hideLoadingModal();
                    if (typeof onSuccessCallback === 'function') {
                        onSuccessCallback(response, textStatus, jqXHR);
                    }
                });    
}