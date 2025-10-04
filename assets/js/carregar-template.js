function carregarTemplateModal(modalId, templateUrl, configDinamico = {}) {    
    // Configurações fixas
    const configFixo = {
        modalTitle: 'CRUD',
        modalSize: 'modal-lg',
        masks: {
            '.telefone': '(00) 0000-0000',
            '.celular': '(00) 00000-0000',
            '.cpf': '000.000.000-00',
            '.cnpj': '00.000.000/0000-00',
            '.cep': '00000-000',
            '.data': '00/00/0000',
            '.hora': '00:00',
            '.dinheiro': {
                mask: 'R$ 999.999.999.999,99',
                reverse: true
            },
            '.numero': '9999999999'
        },
        autocompleteCampo: '#pesquisaCrud',
        autocomplete: {
            minLength: 3,
            delay: 500,
            classes: {
                "ui-autocomplete": "list-group list-group-flush",
                "ui-menu-item": "list-group-item"
            }
        }
    };

    // Mescla configurações
    const config = { ...configFixo, ...configDinamico };

    // Configura o evento de fechamento do modal se callback for fornecido
    /*if (typeof config.callbackOnClose === 'function') {
        $(modalId).on('hidden.bs.modal', function (e) {          
            config.callbackOnClose();
        });
    }*/

    // Configura título e tamanho do modal
    $(modalId+' .modal-title').text(config.modalTitle);
    $(modalId+' .modal-dialog').removeClass('modal-sm modal-md modal-lg modal-xl').addClass(config.modalSize);

    toggleModalBody(modalId, true);

    // Limpa campo de autocomplete antes de carregar
    if (config.autocompleteCampo) {
        $(config.autocompleteCampo).val('');
    }

    // Carrega o template
    $(modalId+' .modal-body').load(templateUrl, function(response, status, xhr) {
        if (status === "error") {
            console.error("Erro ao carregar template:", xhr.status, xhr.statusText);
            $(modalId+' .modal-body').html('<div class="alert alert-danger">Erro ao carregar o formulário</div>');
            return;
        }

        // Aplica máscaras nos inputs
        aplicarMascaras(config.masks);

        //
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))        
        
        // Configura autocomplete se especificado
        if (config.autocompleteCampo && config.autocompleteUrl) {
            configurarAutocomplete(config.autocompleteCampo, config.autocompleteUrl, config.autocomplete);
        }

        if (typeof config.onLoad === 'function') {
            config.onLoad(response, status, xhr);
        } else {        
            if (!$(modalId).hasClass('show') && !$(modalId).is(':visible')) {
                $(modalId).modal('show');
                
                setTimeout(() => {
                    // Limpa campo de autocomplete após carregar
                    if (config.autocompleteCampo) {
                        $(config.autocompleteCampo).val('').focus();
                    }            
                }, 500);
            }
        }
    });
}

// Função para aplicar máscaras (mantida)
function aplicarMascaras(masks) {
    $.each(masks, function(selector, mask) {
        if ($(selector).length > 0) {
            if (typeof mask === 'string') {
                $(selector).mask(mask);
            } else if (typeof mask === 'object') {
                $(selector).mask(mask.mask, mask);
            }
        }
    });

    $('input.numero').off('keydown').on('keydown', soNumeros);
    $("input, select, textarea").bind('keypress', TabToEnter);

    $('.float').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false, precision: 6 });
    $('.currency').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });

    $(".data").css('text-align', 'center');
    $(".currency").css('text-align', 'right');
    $(".float").css('text-align', 'right');
}

// Função para configurar autocomplete (mantida)
function configurarAutocomplete(campo, url, options) {
    const defaultOptions = {
        minLength: 3,
        delay: 500,
        classes: {
            "ui-autocomplete": "list-group list-group-flush",
            "ui-menu-item": "list-group-item"
        },
        source: function(request, response) {
            if (!request.term.trim()) {
                response([]);
                return;
            }

            $.ajax({
                url: url,
                dataType: "json",
                contentType: 'application/json',
                type: 'POST',
                data:JSON.stringify({ term: request.term }),                
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    $(campo).addClass('loading');
                },
                success: function(data) {
                    response(data);
                },
                error: exibeerror,
                complete: function() {
                    $(campo).removeClass('loading');
                }
            });
        },
        select: function(event, ui) {            
            $(this).val('').blur();
            
            if (typeof options.onSelect === 'function') {
                options.onSelect(ui.item);
                return false;
            }
        },
        response: function (event, ui) {
            if (typeof options.onResponse === 'function') {
                options.onResponse(event, ui);
            } else {
                if (!ui.content.length) {
                    ui.content.push({id: null, descricao: "Nenhum registro encontrado"});
                }
            }
        },
        change: function (event, ui) {
            if (ui.item === null) {
                $(this).val('');
            }
        },
        create: function() {
            const autocompleteInstance = $(this).data('ui-autocomplete');
            
            // Usa o renderItem personalizado se fornecido, caso contrário usa o padrão
            if (typeof options.renderItem === 'function') {
                autocompleteInstance._renderItem = options.renderItem;
            } else {
                autocompleteInstance._renderItem = function(ul, item) {
                    return $('<li></li>')
                        .addClass("list-group-item list-group-item-action")
                        .append(item.descricao)
                        .appendTo(ul);
                };
            }
        }                     
    };

    const finalOptions = { ...defaultOptions, ...options };
    $(campo).autocomplete(finalOptions);
}