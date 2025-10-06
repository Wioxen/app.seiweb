// Função para ajustar z-index dos modais
/*function adjustModalZIndex() {
    const modals = document.querySelectorAll('.modal.show');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    
    // Resetar todos os z-index primeiro
    modals.forEach(modal => {
        if (modal.id !== 'loadingModal') {
            modal.style.zIndex = '';
        }
    });
    
    backdrops.forEach(backdrop => {
        backdrop.style.zIndex = '';
    });

    // Agora aplicar z-index na ordem correta
    backdrops.forEach((backdrop, index) => {
        backdrop.style.zIndex = 1040 + (index * 10);
    });
    
    modals.forEach((modal, index) => {
        if (modal.id !== 'loadingModal') {
            modal.style.zIndex = 1050 + (index * 10);
        }
    });
    
    // Ajustar o loadingModal para ficar acima de tudo
    adjustLoadingModalZIndex();
}*/
var zIndex = 0;

$(document).on({
    'show.bs.modal': function () {
        zIndex = 1040 + (10 * $('.modal:visible').length);
        var $this = $(this);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1)
                .addClass('modal-stack')
                .attr('id', 'stack-' + $this.attr('id'));
        }, 0);
    },
    'shown.bs.modal': function () {
        if ($('#stack-' + $(this).attr('id')).length) {
            if ((parseInt($('#stack-' + $(this).attr('id')).css('z-index'))) !== (zIndex - 1)) {
                $('#stack-' + $(this).attr('id')).css('z-index', zIndex - 1);
            }
        }
    },
    'hidden.bs.modal': function () {
        $(this).removeAttr('style');
        if ($('.modal:visible').length === 0) {
            setTimeout(function () {
                $(document.body).removeClass('modal-open');
            }, 200);
        } else {
            setTimeout(function () {
                $(document.body).addClass('modal-open');
            }, 200);
        }
    }
}, '.modal');

// Função específica para o loadingModal
/*function adjustLoadingModalZIndex() {
    const loadingModal = document.getElementById('loadingModal');
    if (!loadingModal || !loadingModal.classList.contains('show')) return;
    
    // Encontrar o maior z-index entre os modais
    let maxZIndex = 1050;
    document.querySelectorAll('.modal.show').forEach(modal => {
        if (modal.id !== 'loadingModal') {
            const zIndex = parseInt(modal.style.zIndex) || 1050;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // Encontrar o maior z-index entre os backdrops
    let maxBackdropZIndex = 1040;
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        const zIndex = parseInt(backdrop.style.zIndex) || 1040;
        if (zIndex > maxBackdropZIndex) maxBackdropZIndex = zIndex;
    });
    
    // Aplicar z-index acima do maior encontrado
    loadingModal.style.zIndex = maxZIndex + 100;
    
    // Ajustar o backdrop do loadingModal
    const loadingBackdrop = document.querySelector('.modal-backdrop[data-bs-target="#loadingModal"]');
    if (loadingBackdrop) {
        loadingBackdrop.style.zIndex = maxBackdropZIndex + 100;
    }
}*/

// Sobrescrever a função padrão do Bootstrap para abrir modais
/*const originalModal = $.fn.modal;
$.fn.modal = function(options) {
    // Chamar a função original
    const result = originalModal.apply(this, arguments);
    
    // Ajustar z-index após um pequeno delay
    setTimeout(adjustModalZIndex, 100);
    
    return result;
};

// Ouvir eventos de modais
document.addEventListener('show.bs.modal', adjustModalZIndex);
document.addEventListener('shown.bs.modal', adjustModalZIndex);
document.addEventListener('hidden.bs.modal', adjustModalZIndex);

document.addEventListener('DOMContentLoaded', adjustModalZIndex);*/

// Funções para controlar o loadingModal (mantidas como estão)
function showLoadingModal() {
    const modalHTML = `
    <div class="modal fade loading-modal" id="loadingModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <div class="spinner-border loading-spinner text-primary" style="width: 4rem; height: 4rem;"  role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p class="mt-3 text-white">Processando ...</p>
                </div>
            </div>
        </div>
    </div>
    `;
    
    $('body').append(modalHTML);      
    
    const loadingModal = document.getElementById('loadingModal');

    if (!loadingModal) return;

    const $modal = $('#loadingModal');

    $modal.on('hidden.bs.modal', function () {
        $(this).remove();
        console.log('Modal destruído');
    });

    loadingModal.classList.add('show');
    loadingModal.style.display = 'block';
    
    // Criar backdrop manualmente se não existir
    if (!document.querySelector('.modal-backdrop[data-bs-target="#loadingModal"]')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.setAttribute('data-bs-target', '#loadingModal');
        document.body.appendChild(backdrop);
    }
    
    //adjustLoadingModalZIndex();
}

function hideLoadingModal() {
    const loadingModal = document.getElementById('loadingModal');
    
    if (!loadingModal) return;
    
    loadingModal.classList.remove('show');
    loadingModal.style.display = 'none';
    
    // Remover backdrop do loadingModal
    const loadingBackdrop = document.querySelector('.modal-backdrop[data-bs-target="#loadingModal"]');
    
    if (loadingBackdrop) {
        loadingBackdrop.remove();
    }
    
    //adjustModalZIndex();
}

function $Loading(status) {
    $('#loadingModal').modal(status);
}

function redirectToLogin() {
    localStorage.setItem('token', null);
    window.location.replace(localStorage.getItem('login_url'));
}

function processErrorData(errorData, errorList) {
    if (errorData.errors) {
        // Adiciona cada erro à lista
        for (const [field, messages] of Object.entries(errorData.errors)) {
            messages.forEach(message => {
                errorList.append(`
                    <div class="list-group-item list-group-item-danger text-start">
                        ${message}
                    </div>
                `);
            });
        }
    } else if (errorData.detail) {
        // Se não houver erros específicos, mostra a mensagem geral
        errorList.append(`
            <div class="list-group-item list-group-item-danger text-start">
                ${errorData.detail}
            </div>
        `);
    } else if (errorData.title) {
        // Se não houver erros específicos, mostra a mensagem geral
        errorList.append(`
            <div class="list-group-item list-group-item-danger text-start">
                ${errorData.title}
            </div>
        `);
    } else {
        // Se o formato for desconhecido, mostra o erro completo
        errorList.append(`
            <div class="list-group-item list-group-item-danger text-start">
                ${JSON.stringify(errorData)}
            </div>
        `);
    }
}

function showErrors(errorResponse) {
    try 
    {
        const modalId = 'dynamicModal-e01-' + new Date().getTime();
    
        // Criar a estrutura do modal
        const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog animate__animated animate__backInUp">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="errorModalLabel">Erros de Validação</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="list-group" id="errorList">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>	    
        `;
        
        $('body').append(modalHTML);
        
        const $modal = $('#' + modalId);
    
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
            console.log('Modal destruído');
        });

        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModalLabel.innerText = "Ocorreram um ou mais erros de validação.";

        if (errorResponse.status === 403){
            $('#errorModalLabel').text("Acesso negado");
        }

        if (errorResponse.status === 401){
            //$('#errorModalLabel').text("Acesso não autorizado");
            redirectToLogin();
        }

        const errorList = $('#errorList');
        
        // Limpa a lista de erros anterior
        errorList.empty();
        
        // Tenta parsear o responseText se existir
        if (errorResponse.responseText) {
            try {
                const errorData = JSON.parse(errorResponse.responseText);
                processErrorData(errorData, errorList);
            } catch (e) {
                // Se não conseguir parsear, mostra o texto cru
                errorList.append(`
                    <div class="list-group-item list-group-item-danger text-start">
                        ${errorResponse.responseText}
                    </div>
                `);
            }
        } 
        // Se não houver responseText, verifica se há objeto errors
        else if (errorResponse.errors) {
            processErrorData(errorResponse, errorList);
        }
        // Se não houver nenhum dos anteriores, mostra a mensagem genérica
        else {
            errorList.append(`
                <div class="list-group-item list-group-item-danger text-start">
                    ${typeof errorResponse === 'string' ? errorResponse : 'Ocorreu um erro desconhecido.'}
                </div>
            `);
        }
        
        // Mostra o modal    
        errorModal.show();
    } catch (e) {
        console.error('Erro ao processar mensagem de erro:', e);
        $('#errorContainer').removeClass('d-none').html(
            typeof errorResponse === 'string' ? errorResponse : 'Erro ao processar mensagem de erro.'
        );
    }
}

function handleDefaultError(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);

    if (jqXHR.responseText || (jqXHR.status && jqXHR.status >= 400)) {
        showErrors(jqXHR);
    } else {
        let errorMessage = 'Ocorreu um erro ao processar a requisição.';
        
        if (status === 'timeout') {
            errorMessage = 'Tempo de requisição excedido. Tente novamente.';
        } else if (errorThrown) {
            errorMessage = errorThrown;
        }
        
        showErrors(errorMessage);
    }					
}

function RestRequest(_type, resource, payload, beforeSendCallback, successCallback, errorCallback) 
{
    var ajaxConfig = 
    {
        url: resource,
        beforeSend: function(xhr){
            if (typeof beforeSendCallback === 'function') {
                beforeSendCallback(xhr);
            } else {
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                xhr.setRequestHeader('turnstile_token', $('[name="cf-turnstile-response"]').val());
                if (!$('#loadingModal').hasClass('show') && !$('#loadingModal').is(':visible')) {
                    showLoadingModal();       
                }
            }            
        },
        datatype: 'json',
        contentType: 'application/json',
        type: _type
    };

    // Adiciona data apenas se payload não for null
    if (payload !== null) {
        ajaxConfig.data = JSON.stringify(payload);
        console.log(ajaxConfig.data);
    }
    
    $.ajax(ajaxConfig)    
    .done(function(response, textStatus, jqXHR) {
        if (typeof successCallback === 'function') {
            successCallback(response, textStatus, jqXHR);
        } else {
            console.log('Operação concluída com sucesso');
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        if (typeof errorCallback === 'function') {
            errorCallback(jqXHR, textStatus, errorThrown);
        } else {
            hideLoadingModal();
            handleDefaultError(jqXHR, textStatus, errorThrown);
        }
    });
}

function exibeerror(xhr, status, error) {
    hideLoadingModal();
    console.log(xhr);
    console.log(status);
    console.log(error);
    handleDefaultError(xhr, status, error);
}

function toggleModalBody(modalId, desabilitar) {
    var $modalBody = $(modalId).find('.modal-body');
    
    if (desabilitar) {
        // Desabilitar o modal
        $modalBody
            .css('opacity', '0.6')
            .css('pointer-events', 'none')
            .find('input, button, textarea, select, a')
            .prop('disabled', true);
        
        // Adicionar overlay visual se não existir
        if (!$modalBody.find('.overlay-disabled').length) {
            $modalBody.prepend(
                '<div class="overlay-disabled" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.8); z-index:1050; display:flex; align-items:center; justify-content:center;">' +
                '<span class="spinner-border text-primary"></span>' +
                '</div>'
            );
        }
        
        console.log('Body do modal ' + modalId + ' desabilitado');
    } else {
        // Habilitar o modal
        $modalBody
            .css('opacity', '1')
            .css('pointer-events', 'auto')
            .find('input, button, textarea, select, a')
            .prop('disabled', false);
        
            $modalBody.find('.overlay-disabled').remove();
    }
}

function zPergunta(texto, OkCallback) {
    /*$('#alertModal .modal-body').html(texto);
    $('#alertModal .modal-footer').find('button').first().off('click').on('click', function(e){
        OkCallback(e);
    });
    $('#alertModal').modal('show');
    setTimeout(adjustModalZIndex, 100); // Ajusta após a abertura*/

    // Gerar um ID único para o modal
    const modalId = 'dynamicModal-p01-' + new Date().getTime();
    
    // Criar a estrutura do modal
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog animate__animated animate__backInLeft" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title"><i class="fa fa-question-circle"></i> Responda</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    ${texto}
                    </div>
                    <div class="modal-footer">
                        <button id="btn${modalId}" class="btn btn-primary btn-sm">Sim</button>
                        <button type="button" class="btn btn-danger btn-sm" data-bs-dismiss="modal">Não</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);

    const $modal = $('#' + modalId);

    $('#btn'+modalId).off('click').on('click', function(e){
        $modal.modal('hide');
        OkCallback(e);
    });
    
    $modal.on('hidden.bs.modal', function () {
        $(this).remove();
        console.log('Modal destruído');
    });
    
    $modal.modal('show');
    
    return $modal;    
}

function zPergunta_Exclui(OkCallback){
    zPergunta("Confirma a exclusão deste registro ?", OkCallback);
}

function zAlerta(texto) {
    // Gerar um ID único para o modal
    const modalId = 'dynamicModal-p01-' + new Date().getTime();
    
    // Criar a estrutura do modal
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog animate__animated animate__backInLeft" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title"><i class="fa fa-question-circle"></i> alerta</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    ${texto}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Sair</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);

    const $modal = $('#' + modalId);

    $modal.on('hidden.bs.modal', function () {
        $(this).remove();
    });
    
    $modal.modal('show');
    
    return $modal;    
}

/*function checkTurnstileStatus() {
    const response = turnstile.getResponse();
    if (response) {
        hideLoadingModal();
    } else {
        if (!$('#loadingModal').hasClass('show') && !$('#loadingModal').is(':visible')) {
            showLoadingModal();
        }
    }
}*/
function preencherCampo($campo, valor) {
    const tipo = $campo.attr('type');
    const tagName = $campo.prop('tagName').toLowerCase();
    
    // Converte valores null/undefined para string vazia
    if (valor === null || valor === undefined) {
        valor = '';
    }
    
    switch (tagName) {
        case 'input':
            switch (tipo) {
                case 'checkbox':
                    $campo.prop('checked', Boolean(valor));
                    break;
                case 'radio':
                    $campo.filter(`[value="${valor}"]`).prop('checked', true);
                    break;
                case 'file':
                    // Campos file geralmente não podem ser preenchidos por segurança
                    console.warn('Campos do tipo file não podem ser preenchidos programaticamente');
                    break;
                default:
                    $campo.val(valor);
                    break;
            }
            break;
            
        case 'select':
            if ($campo.attr('multiple')) {
                // Select múltiplo
                $campo.val(Array.isArray(valor) ? valor : [valor]);
            } else {
                $campo.val(valor);
            }
            break;
            
        case 'textarea':
            $campo.val(valor);
            break;
            
        default:
            $campo.text(valor);
            break;
    }
    
    // Dispara evento change para atualizar qualquer validação ou comportamento
    $campo.trigger('change');
}

function preencherFormularioCompleto(payload, formSelector = 'form') {
    const $form = $(formSelector);
    
    function preencherRecursivo(obj, prefixo = '') {
        $.each(obj, function(key, value) {
            // Trata casos especiais de notação com colchetes aninhados
            const chaveCompleta = prefixo ? `${prefixo}[${key}]` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Se for objeto, chama recursivamente
                preencherRecursivo(value, chaveCompleta);
            } else if (Array.isArray(value)) {
                // Se for array, trata cada elemento
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        preencherRecursivo(item, `${chaveCompleta}[${index}]`);
                    } else {
                        // Para arrays simples, procura por campos com nome no formato "nome[index]"
                        const nomeCampo = `${chaveCompleta}[${index}]`;
                        const $campo = $form.find(`[name="${nomeCampo}"], [id="${nomeCampo}"], [data-field="${nomeCampo}"]`);
                        if ($campo.length) preencherCampo($campo, item);
                    }
                });
            } else {
                // Valor simples - procura por campos com o nome exato
                const $campo = $form.find(`[name="${chaveCompleta}"], [id="${chaveCompleta}"], [data-field="${chaveCompleta}"]`);
                
                // Se não encontrar com o nome completo, tenta encontrar campos com namesets aninhados
                if (!$campo.length && chaveCompleta.includes('[')) {
                    // Extrai apenas a parte final do nome (último nível)
                    const partes = chaveCompleta.split('[');
                    const nomeSimples = partes[partes.length - 1].replace(']', '');
                    
                    // Procura por campos com o nome simples (última parte)
                    const $campoSimples = $form.find(`[name="${nomeSimples}"], [id="${nomeSimples}"], [data-field="${nomeSimples}"]`);
                    if ($campoSimples.length) {
                        preencherCampo($campoSimples, value);
                        return;
                    }
                }
                
                if ($campo.length) {
                    preencherCampo($campo, value);
                }
            }
        });
    }
    
    preencherRecursivo(payload);
}

function buscaCep(element, callbackSuccess, callbackError) {
    console.log($(element).val());

    RestRequest('POST',
        $baseApiUrl+'viacep',
        {cep: $(element).val()},
        null,
        callbackSuccess,
        callbackError);
}

function buscaCnpj(_cnpj, callbackSuccess, callbackError) {
    RestRequest('POST',
        $baseApiUrl+'receitaws',
        {cnpj: _cnpj},
        null,
        callbackSuccess,
        callbackError);
}

// Função para criar e abrir o modal dinâmico
function createDynamicModal_01(title, size, modal_body, modal_footer = "", callbackOnClose = null) {
    // Gerar um ID único para o modal
    const modalId = 'dynamicModal-01-' + new Date().getTime();
    
    // Criar a estrutura do modal
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog modal-dialog-scrollable ${size}">
                <div class="modal-content">
                    <div class="modal-header bg-primary" style="color: white;">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${modal_body}
                    </div>
                    <div class="modal-footer x-modal-footer">
                        ${modal_footer}					
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    
    const $modal = $('#' + modalId);

    $modal.on('hidden.bs.modal', function () {
        $(this).remove();
        console.log('Modal destruído');

        if (typeof callbackOnClose === 'function') {
            callbackOnClose();
        }        
    });

    return $modal;
}

// Função para criar e abrir o modal dinâmico
function createDynamicModal() {
    // Gerar um ID único para o modal
    const modalId = 'dynamicModal-02-' + new Date().getTime();
    
    // Criar a estrutura do modal
    const modalHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-header modal-header-search border-0 pb-0">
                        <div class="input-group input-group-sm">
                            <input id="Pesquisar${modalId}" type="text" class="form-control form-control-sm text-uppercase" placeholder="Digite 3 ou mais caracteres">
                            <span class="input-group-text"><i class="fa fa-search"></i></span>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Carregando...</span>
                            </div>
                            <p>Carregando conteúdo...</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="me-auto">
                            <button id="${gerarHash(16)}" class="btn btn-warning btn-cancelar"><i class="fa fa-ban"></i> Cancelar</button>
                            <button id="${gerarHash(16)}" class="btn btn-danger btn-excluir"><i class="fa fa-trash"></i> Excluir</button>
                            <button id="${gerarHash(16)}" class="btn btn-success btn-salvar"><i class="fa fa-check"></i> Salvar</button>
                        </div>	
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHTML);
    
    const $modal = $('#' + modalId);

    $modal.on('hidden.bs.modal', function () {
        $(this).remove();
        console.log('Modal destruído');
        /*if (typeof callbackOnClose === 'function') {
            callbackOnClose();
        }*/
    });

    return $modal;
}

function carregaSelect(resource, selectContainerId, fieldkey, concatenar = true, _defaultValue = null){
    RestRequest('GET',
        $baseApiUrl+resource,
        null,
        function(xhr){
            $(selectContainerId).html(`<div class="loading-label w-100">
                        <span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
                        Carregando ...
                    </div>`);
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, textStatus, jqXHR){
            $(selectContainerId).html(`<select id="${$(selectContainerId).attr('data-control')}" class="form-select form-select-sm text-uppercase"></select>`); 
            $('#'+$(selectContainerId).attr('data-control')).append(`<option value="0"></option>`);
            $.each(response,function(index,value){
                $('#'+$(selectContainerId).attr('data-control')).append(`<option value="${value[fieldkey]}">${((concatenar === true) ? value[fieldkey] + ' - ' : '') + value.descricao}</option>`);
            });

            if (_defaultValue !== null){
               $('#'+$(selectContainerId).attr('data-control')).val(_defaultValue); 
            }
         },
        function(jqXHR, textStatus, errorThrown){
            $(selectContainerId).html(`${jqXHR.responseText}`);
        });    
}

function carregaSelect2(resource, _modal, selectContainerId, fieldkey, _defaultValue = 0){
    RestRequest('GET',
        $baseApiUrl+'select2?table='+resource,
        null,
        function(xhr){
            $(selectContainerId).html(`<div class="loading-label w-100">
                        <span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
                        Carregando ...
                    </div>`);
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, textStatus, jqXHR){
            $(selectContainerId)
            .html(`<select id="${$(selectContainerId).attr('data-control')}" class="form-select form-select-sm"></select>`); 
            
            var thisSelect = $('#'+$(selectContainerId)
            .attr('data-control'));

            thisSelect
            .append(`<option value="0"></option>`);

            $.each(response,function(index,value){
                thisSelect
                .append(`<option value="${value[fieldkey]}">${value.descricao}</option>`);
            });

            thisSelect
            .select2({
                placeholder: '',
                theme: "bootstrap-5",
                dropdownParent: _modal,
                allowClear: true                
            });

            thisSelect.val(_defaultValue);
            thisSelect.trigger('change'); // Notify Select2 of the change            
        },
        function(jqXHR, textStatus, errorThrown){
            $(selectContainerId)
            .html(`${jqXHR.responseText}`);
        });    
}

function TabToEnter(e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        $.focusNext();
    }
}

function soNumeros(e) {
    var keyCode = e.keyCode || e.which,
        pattern = /\d/,
        // Permite somente Backspace, Delete e as setas direita e esquerda, números do teclado numérico - 96 a 105 - (além dos números)
        keys = [46, 8, 9, 13, 37, 39, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

    if (!pattern.test(String.fromCharCode(keyCode)) && $.inArray(keyCode, keys) === -1) {
        return false;
    }
}

function extrairNumeros(texto) {
    // Remove todos os caracteres não numéricos
    if ((texto === undefined) || (texto === null))
    {
        return null;
    } else {
        return texto.replace(/\D/g, '');
    }
}

function StrToNumber(number) {
    var $string = $.trim(number);

    if (($string === '') || ($string === null) || ($string === undefined)) {
        return 0;
    } else {
        $string = $string.replace(/[^0-9]/g, '');
        return parseInt(number);
    }
}

function StrToDecimal(decimalString) {
    var $string = $.trim(decimalString);
    return ($string === '') ? 0 : $.trim($string).replaceAll('.', '').replaceAll(',', '.');
}

function CheckedToValue($this){
    return $this.prop('checked') ? 1 : 0
}

function EnviarImagem($this, successCallback, errorCallback) {
    var fdata = new FormData();
    var fileInput = $this[0];
    var file = fileInput.files[0];
    fdata.append("file", file);

    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = function () {
        showLoadingModal();       

        $.ajax({
            type: 'POST',
            url: $baseApiUrl + 'imagem',
            data: fdata,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": localStorage.getItem('token')
            },
            success: function(response, textStatus, jqXHR) {
                hideLoadingModal();
    
                if (typeof successCallback === 'function') {
                    successCallback(response, textStatus, jqXHR);
                } else {
                    console.log('Operação concluída com sucesso');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                hideLoadingModal();

                handleDefaultError(jqXHR, textStatus, errorThrown);

                if (typeof errorCallback === 'function') {
                    errorCallback(jqXHR, textStatus, errorThrown);
                }
            }
        });
    };

    reader.onerror = function () {
        console.log('there are some problems');
    };
}

function CarregaDataTable(resource, title_modal, size_modal, body_modal, footer_modal, showModalCallback, columns, 
    _drawCallback = null, _select = false, _formatFunction = null)
{
    const defaultColumns = [];    
    const finalColumns = columns || defaultColumns;

    function defaultFormat(d) {
        return (
            ''
        );
    }

    const format = _formatFunction || defaultFormat;    

    if (_select === true){
        columns.unshift({data: null, orderable: false, searchable: false, "width": "5%", render: DataTable.render.select()});
    }

    if (_formatFunction !== null){
        columns.unshift({class: 'details-control', orderable: false, searchable: false, data: null, defaultContent: '', "width": "5%" });
    }

    var $modal = createDynamicModal_01(title_modal,size_modal,body_modal,footer_modal);
    var tableId = $modal.find('table').attr('id');

    var $tabela = $(`#${tableId}`)
    .DataTable({
        "order": [[0, '']], // Sets an initial sort order (optional)      
        "stateSave": false,
        "autoWidth": false, // Desativa o cálculo automático de largura                
        "headerCallback": function(thead, data, start, end, display) {
            //$(thead).hide();
            //$('.dt-scroll-head').remove();
            //$('.dt-scroll-foot').remove();
            /*$('.dt-layout-row').first().addClass('dt-layout-row modal-header');
            $('.dt-layout-row').last().addClass('dataTables_paginate');
            $('.dt-paging-button').addClass('btn btn-sm btn-primary')
            $('.dataTables_paginate').appendTo(modalId+' .modal-footer');*/
        },
        scrollX: false,
        ajax: 
        {
            "url" :$baseApiUrl+resource,
            "type": "GET", // Or POST, PUT, etc.
            "beforeSend": function (xhr) {
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            "error": function(xhr, error, thrown){
                alert('x');
            }            
        },          
        select: (_select === true) ? {style: 'os', selector: (_formatFunction === null) ? 'td:nth-child(1)':'td:nth-child(2)'} : false,
        processing: true,
        serverSide: true,        
        rowId: 'id', // ← Aqui você define qual campo do JSON será o ID
        columns: finalColumns,
        "language": {
            "info": "Mostrando _START_ até _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 até 0 de 0 registros",
            //"infoFiltered": "(filtrados de _MAX_ registros no total)",
            select: {
                rows: " %d selecionado(s)"
            },
            "emptyTable": "Nenhum registro disponível",            
            "infoFiltered": "",
            "infoPostFix": "",
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "loadingRecords": "Carregando...",
            "processing": "",
            "search": "Pesquisar:",
            "zeroRecords": "Nenhum registro encontrado",
            "paginate": {
                "first": "<i class='fa fa-angle-double-left'></i>",
                "previous": "<i class='fa fa-chevron-left'></i>",
                "next": "<i class='fa fa-chevron-right'></i>",
                "last": "<i class='fa fa-angle-double-right'></i>"
            }
        },               
        "drawCallback": function (settings) {
            $('.dt-layout-row').first().addClass('dt-layout-row modal-header pt-0');
            $('.dt-layout-row').last().addClass('dataTables_paginate');
            $('.dt-paging-button').addClass('btn btn-sm btn-primary')
            $('.dataTables_paginate').appendTo('#'+$modal.attr('id')+' .modal-footer');

            if (typeof _drawCallback === 'function') {
                _drawCallback(settings);
            }
        },                        
        "initComplete": function() {
            $('.dt-layout-row').first().addClass('dt-layout-row modal-header pt-0');
            $('.dt-layout-row').last().addClass('dataTables_paginate');
            $('.dt-paging-button').addClass('btn btn-sm btn-primary')
            $('.dataTables_paginate').appendTo('#'+$modal.attr('id')+' .modal-footer');
        }        
    });    

    $(`#${tableId} tbody`).on('click', 'td.details-control', function () {
        var tr = $(this).parents('tr');
        var row = $tabela.row(tr);
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');          
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
            //alert('x');
        }
    } );    

    if (!$modal.hasClass('show') && !$modal.is(':visible')) {        
        $modal.on('shown.bs.modal', function () {
            $tabela.draw();

            $('#dt-search-0').focus();

            if (typeof showModalCallback === 'function') {
                showModalCallback();
            }
        });
    
        $modal.modal('show');
    }

    return {
        tabela: $tabela,
        modal: $modal
    };
}

function CarregarFotoLista(_class){
    $(_class).each(function(){
        var $this = $(this);
        if ($this.data('foto') === "")
        {
            $this.html(`<img class="avatar-img rounded-circle" src="assets/img/semfoto.png" style="width: 39px; height: 39px;" />`);      
        } else {
            RestRequest(
                'GET',
                $baseApiUrl+'Imagem?codigo=' + $this.data('foto'),
                null,
                function (xhr) {
                    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                },
                function (response, textStatus, jqXHR) {
                    $this.html(`<img class="avatar-img rounded-circle" src="${response}" style="width: 39px; height: 39px;" />`);      
                },
                function(jqXHR, textStatus, errorThrown)
                {
                    $this.html(`<img class="avatar-img rounded-circle" src="assets/img/semfoto.png" style="width: 39px; height: 39px;" />`);      
                }); 
        }
    })

}

// Função para formatar a data e hora
function formatarDataHora() {
    const data = new Date();
    
    // Dias da semana em português
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    // Meses em português
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const diaSemana = diasSemana[data.getDay()];
    const dia = data.getDate();
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear();
    
    // Formatar hora, minutos e segundos com dois dígitos
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');
    
    return `${diaSemana}, ${dia} de ${mes} de ${ano}, ${hora}h ${minutos}min ${segundos}s`;
}

// Função para atualizar o display em tempo real
function atualizarDataHora() {
    const dataHoraFormatada = formatarDataHora();
    $('#data-hora').text(dataHoraFormatada);
}

function StrToValue(_value)
{
    return ($.trim(_value) === "") ? null : $.trim(_value);
}

function StrToInt(_number){
    var _string = $.trim(_number);

    if ((_string === '') || (_string === null) || (_string === undefined)) {
        return 0;
    } else {
        _string = _string.replace(/[^0-9]/g, '');
        return parseInt(_number);
    }

}

function StrToDate($value) {
    var $string = $.trim($value);
    return ($string === '') ? null :
        $.trim($string).split('/')[2] + '-' +
        $.trim($string).split('/')[1] + '-' +
        $.trim($string).split('/')[0];
}


function DateToStr($value) {
    var $string = $.trim($value);

    if ($string === '')
        return '';

    $string = $string.substr(0, 10);

    return $.trim($string).split('-')[2] + '/' + $.trim($string).split('-')[1] + '/' + $.trim($string).split('-')[0];
}

function VarToStr($value) {
    return (($value === null) || ($value === undefined)) ? '' : $.trim($value);

}

function gerarHash (_size = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    
    for (let i = 0; i < _size; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return hash;
};

function CarregarFoto(thisFoto,_photo,_size="140px")
{
    if ((_photo !== null) && (_photo !== undefined)){
        RestRequest(
            'GET',
            $baseApiUrl+'Imagem?codigo=' + _photo,
            null,
            function (xhr) {
                thisFoto.html('<i class="fa fa-spin fa-spinner fa-3x"></i>');
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            function (response, textStatus, jqXHR) {
                thisFoto.html(`<img class="card-img-top rounded-circle" src="${response}" alt="[FOTO]" style="max-height: ${_size}; width: ${_size};" />`);      
            },
            function(jqXHR, textStatus, errorThrown)
            {
                thisFoto.html(`<img class="card-img-top rounded-circle" src="#" alt="[FOTO]" style="max-height: ${_size}; width: ${_size};" />`);      
            });    
    }
}


function checkboxValue(checkbox, valorA, valorB) {
    // Verifica se o checkbox está marcado
    const estaChecado = $(checkbox).is(':checked');
    
    // Retorna valorA se estiver checado, valorB se não estiver
    return estaChecado ? valorA : valorB;
}

function ConvertToInt(_value)
{
    console.log(_value);

    if ((_value === undefined) || (_value === null))
    {
        return 0;
    }

    return parseInt(_value);
}

function IntToValue(_value)
{
    if (_value === 0)
    {
        return null;
    } else {
        return _value;
    }
}