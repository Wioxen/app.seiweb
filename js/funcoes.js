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


// Funções para controlar o loadingModal (mantidas como estão)
function showLoadingModal() {
	Swal.fire({
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
		background: 'transparent',
		backdrop: 'rgba(0,0,0,0.4)', // ou 'transparent' para totalmente transparente
		didOpen: () => {
			Swal.showLoading();					
			/*setTimeout(() => {
				const loader = document.querySelector('.swal2-loader');
				if (loader) {
					loader.style.width = '70px';
					loader.style.height = '70px';
					loader.style.borderWidth = '6px';
					loader.style.borderTopColor = '#3498db';
				}
			}, 10); */
		}
	});	
}

function hideLoadingModal() {
    Swal.close();
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
	
	/*console.log(errorData);
	
	if (errorData.status === 403){
		errorList.append(`
			<div class="list-group-item list-group-item-danger text-start">
				${$('#first-name').text()}, você não tem permissão para acessar este modulo!
			</div>
		`);
	}*/	
}

function showErrors(errorResponse) {
    try 
    {
        if (errorResponse.status === 401){
            redirectToLogin();
        }
		
		var errorModalLabel = "Ops!";
		
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
			if (errorResponse.status === 403){
				errorList.append(`
					<div class="list-group-item list-group-item-danger text-start">
						${$('#first-name').text()}, você não tem permissão para acessar este modulo!
					</div>
				`);
			}	else {			
				errorList.append(`
					<div class="list-group-item list-group-item-danger text-start">
						${typeof errorResponse === 'string' ? errorResponse : 'Ocorreu um erro desconhecido.'}
					</div>
				`);
			}
        }
		
		Swal.fire({
		  title: errorModalLabel,
		  icon: 'error',
		  html: errorList,
		  scrollbarPadding: true,
		  customClass: {
			confirmButton: "btn btn-success"
			},
		});
		
		errorList.empty();
    } catch (e) {
        console.log('Erro ao processar mensagem de erro:', e);
        $('#errorContainer').removeClass('d-none').html(
            typeof errorResponse === 'string' ? errorResponse : 'Erro ao processar mensagem de erro.'
        );
    }
}

function handleDefaultError(jqXHR, textStatus, errorThrown) {
    hideLoadingModal();

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

function RestRequest(configDinamico = {})
{
	const configFixo = {
		method: 'GET'
	};
    
	const config = { ...configFixo, ...configDinamico };
	
	var ajaxConfig =
	{
		url: config.url,
        beforeSend: function(xhr){
            if (typeof config.beforeSend === 'function')
			{
                config.beforeSend(xhr);
            } else {
                xhr.setRequestHeader('remoteip', localStorage.getItem('remoteip'));
                xhr.setRequestHeader('user_agent', localStorage.getItem('user_agent'));
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
				showLoadingModal();       
            }            
        },
		type: config.method,
        datatype: 'json',
        contentType: 'application/json'
	};	
	
    if ((config.data !== null) && (config.data !== undefined)) {
        ajaxConfig.data = JSON.stringify(config.data);
        console.log(ajaxConfig.data);
    }	
	
	$.ajax(ajaxConfig)
	.done(function(response, textStatus, jqXHR) {
        if (typeof config.success === 'function') {
            config.success(response, textStatus, jqXHR);
        } else {
            console.log('Operação concluída com sucesso');
        }
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
        if (typeof config.error === 'function') {
            config.error(jqXHR, textStatus, errorThrown);
        } else {
            hideLoadingModal();
            handleDefaultError(jqXHR, textStatus, errorThrown);
        }
	})
	.always(function() {
        if (typeof config.always === 'function') {
            config.always();
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

function zPergunta(texto, yesCallback) {
	Swal.fire({
	  title: 'Responda',
	  text: `${texto}`,
	  icon: "question",
	  showCancelButton: true,
	  customClass: {
		confirmButton: "btn btn-success",
		cancelButton: "btn btn-danger"
	  },
	  confirmButtonText: "Sim, eu confirmo",
	  cancelButtonText: "Não",	  
	}).then((result) => {
		if (result.isConfirmed) {
			if (yesCallback && typeof yesCallback === 'function') {
				yesCallback();
			}
		} else {
			swal.close();
		}								
	});	
}

function zPergunta_Exclui(configDinamico = {}){
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
	zPergunta("Confirma a exclusão deste registro ?", function(){
		RestRequest({
			method: 'DELETE',
			url: config.url,
			success: function (response, textStatus, jqXHR) {
				hideLoadingModal();
				
				/*Swal.fire({
				  title: "Excluído!",
				  text: "Registro excluído com sucesso.",
				  icon: "success"
				});*/
							
				$.notify({
					icon: 'icon-bell',
					title: 'Mensagem',
					message: "Registro excluído com sucesso.",
				},{
					type: 'success',
					placement: {
						from: "bottom",
						align: "center"
					},
					time: 300,
				});
				
				/*const Toast = Swal.mixin({
				  toast: true,
				  position: "bottom",
				  showConfirmButton: false,
				  timer: 5000,
				  timerProgressBar: true,
				  didOpen: (toast) => {
					toast.onmouseenter = Swal.stopTimer;
					toast.onmouseleave = Swal.resumeTimer;
				  }
				});
				
				Toast.fire({
				  icon: "success",
				  title: "Registro excluído com sucesso"
				});*/  				

				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}				
			}
		});  	
	});
}

function zAlerta(_message) {
	$.notify({
		icon: 'icon-bell',
		title: 'alerta',
		message: _message,
	},{
		type: 'success',
		placement: {
			from: "top",
			align: "center"
		},
		time: 500,
	});  
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

function createDynamicModal(callbackOnClose = null) {
    // Gerar um ID único para o modal
    const modalId = gerarHash(32);
    
    // Criar a estrutura do modal
    const modalHTML = `
        <div class="modal fade" id="${modalId}"  data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary" style="color: white;">
                        <h5 class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    </div>
                    <div class="modal-footer">
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
            url: 'https://api.seiweb.com.br/uploads/images',
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

function UploadSingleImage(configDinamico = {}) {
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };

    var fdata = new FormData();
    fdata.append("file", config.file);

    var reader = new FileReader();
	
    reader.onload = (e) => {
        showLoadingModal();       

        $.ajax({
            type: 'POST',
            url: 'https://api.seiweb.com.br/uploads/images',
            data: fdata,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": localStorage.getItem('token')
            },
            success: function(response, textStatus, jqXHR) {
                hideLoadingModal();
    
				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}       

				Swal.fire({
				  title: "Imagem enviada",
				  imageUrl: e.target.result,
				  imageAlt: "Image"
				});				
            },
            error: handleDefaultError
        });
    };
	
	if ((config.file !== null) && (config.file !== undefined))
	{
		reader.readAsDataURL(config.file);
	}

    reader.onerror = function () {
        console.log('there are some problems');
    };
}

function CarregaDataTable(configDinamico = {})
{
    const configFixo = {
        select: false,
		formatFunction: null
    };	
	
    const config = { ...configFixo, ...configDinamico };
	
    const defaultColumns = [];    
    const finalColumns = config.columns || defaultColumns;

    function defaultFormat(d) {
        return (
            ''
        );
    }
	
    const format = config.formatFunction || defaultFormat;    

    if (config.select === true){
        config.columns.unshift({data: null, orderable: false, searchable: false, "width": "5%", render: DataTable.render.select()});
    }

    if (config.formatFunction !== null){
        config.columns.unshift({class: 'details-control', orderable: false, searchable: false, data: null, defaultContent: '', "width": "5%" });
    }
    
	var tableId = config.modal.find('table').attr('id');
	
    var modalOpened = false;
	
    var $tableElement = $(`#${tableId}`);

	if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
		var existingTable = $tableElement.DataTable();
		existingTable.destroy();
		$tableElement.empty();
	}
	
    var $tabela = $tableElement
    .DataTable({
        "order": [[0, '']], // Sets an initial sort order (optional)      
        "stateSave": false,
        "autoWidth": false, // Desativa o cálculo automático de largura                
        "headerCallback": function(thead, data, start, end, display) {
        },
        scrollX: false,
        ajax: 
        {
            "url" :$baseApiUrl+config.resource,
            "type": "GET", // Or POST, PUT, etc.
            "beforeSend": function (xhr) {
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            "dataSrc": function (json) {
				hideLoadingModal();

                if (!modalOpened) {
                    modalOpened = true;
                    
                    // Aguarda um momento para garantir que o DOM esteja pronto
                    setTimeout(() => {
                        if (!config.modal.hasClass('show') && !config.modal.is(':visible')) {
                            config.modal.on('shown.bs.modal', function () {
                                $('#dt-search-0').focus();
                                
                                if (typeof showModalCallback === 'function') {
                                    showModalCallback();
                                }
                            });
                            
                            config.modal.modal('show');
                        }
                    }, 50);
                }
                
                // Retorna os dados para o DataTable processar
                return json.data || json;
            },	
            "error": handleDefaultError    
        },          
        select: (config.select === true) ? {style: 'os', selector: (_formatFunction === null) ? 'td:nth-child(1)':'td:nth-child(2)'} : false,
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
            $('.dataTables_paginate').appendTo('#'+config.modal.attr('id')+' .modal-footer');

            if (typeof _drawCallback === 'function') {
                _drawCallback(settings);
            }
        },                        
        "initComplete": function() {
            $('.dt-layout-row').first().addClass('dt-layout-row modal-header pt-0');
            $('.dt-layout-row').last().addClass('dataTables_paginate');
            $('.dt-paging-button').addClass('btn btn-sm btn-primary')
            $('.dataTables_paginate').appendTo('#'+config.modal.attr('id')+' .modal-footer');
        }        
    });    

    $tableElement.find('tbody').on('click', 'td.details-control', function () {
        var tr = $(this).parents('tr');
        var row = $tabela.row(tr);
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');       
        }
        else {
            // Open this row
            var childRow = row.child( format(row.data()) );
            childRow.show();
            tr.addClass('shown');
        }
    } );    

    return $tabela;
}

function CarregarFotoLista(_class){
    $(_class).each(function(){
        var $this = $(this);
        if ($this.data('foto') !== "")
        {
            $this.html(`<img class="avatar-img rounded-circle" src="assets/img/semfoto.png" style="width: 39px; height: 39px;" />`);      
        } else {
            RestRequest(
                'GET',
                $imageUrl+$this.data('foto'),
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
            $imageUrl+_photo,
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


function checkboxValue(checkbox) {
    // Verifica se o checkbox está marcado
    const estaChecado = $(checkbox).is(':checked');
    
    // Retorna valorA se estiver checado, valorB se não estiver
    return estaChecado ? true : false;
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

function IntToValue(_value) {
    try {
        console.log(_value);
        if (_value === 0) {
            return null;
        } else {
            return _value;
        }
    } catch (error) {
        console.error('Erro na função IntToValue:', error);
        return 0;
    }
}

function safeGet(objeto, campo, defaultValue = 0) {
    // Verificação em etapas
    if (!objeto) return defaultValue;
    if (typeof objeto !== 'object') return defaultValue;
    if (!(campo in objeto)) return defaultValue;
    
    return objeto[campo] ?? defaultValue;
}

function safeGetDeep(objeto, caminho, defaultValue = 0) {
    try {
        if (!objeto) return defaultValue;
        
        const campos = Array.isArray(caminho) ? caminho : caminho.split('.');
        let resultado = objeto;
        
        for (const campo of campos) {
            if (resultado === null || resultado === undefined || !(campo in resultado)) {
                return defaultValue;
            }
            resultado = resultado[campo];
        }
        
        return resultado ?? defaultValue;
    } catch (error) {
        console.error('Erro em safeGetDeep:', error);
        return defaultValue;
    }
}

function validarInput($input) {
    let valor = $input.val();
    
    // Verifica se o valor está vazio
    if (valor === null || valor === undefined || String(valor).trim() === '') {
        return null;
    }
    
    // Converte para string e remove espaços
    valor = String(valor).trim();
    
    const type = $input.attr('type');
    const hasCurrency = $input.hasClass('currency');
    const hasFloat = $input.hasClass('float');
    const hasDouble = $input.hasClass('double');
    
    // Se for campo numérico ou tiver classes numéricas
    if (type === 'number' || hasCurrency || hasFloat || hasDouble) {
        let valorNumerico = valor;
        
        // Tratamento especial para currency
        if (hasCurrency) {
            // Remove símbolos de moeda e converte vírgula para ponto
            valorNumerico = valorNumerico.replace(/[^\d,.-]/g, '').replace(',', '.');
        }
        
        const num = parseFloat(valorNumerico);
        
        if (isNaN(num)) {
            return null;
        }
        
        // Aplica casas decimais conforme a classe
        if (hasCurrency) {
            return parseFloat(num.toFixed(2));
        } else if (hasFloat) {
            return parseFloat(num.toFixed(7));
        } else if (hasDouble) {
            return parseFloat(num.toFixed(15));
        } else {
            return num; // type="number" sem classe especial
        }
    }
    
    // Para campos textuais, aplica text-transform
    const textTransform = $input.css('text-transform');
    
    switch (textTransform) {
        case 'uppercase':
            return valor.toUpperCase();
        case 'lowercase':
            return valor.toLowerCase();
        case 'capitalize':
            return valor.replace(/\b\w/g, function(char) {
                return char.toUpperCase();
            });
        default:
            return valor;
    }
}

function ConsultaCep(configDinamico = {}){
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };

    RestRequest({
		method: 'POST',
        url: $baseApiUrl+'apiservice/cep',
        data: {modulo: config.resource, cep: $('#cep').val()},
        success: function(response, textStatus, jqXHR){
            hideLoadingModal();

            if (typeof config.success === 'function') {
                config.success(response, textStatus, jqXHR);
            }   
        }
	});	
}

function ConsultaCnpj(configDinamico = {}){
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };

    RestRequest({
		method: 'POST',
        url: $baseApiUrl+'apiservice/receitaWs',
        data: {modulo: config.resource, cnpj: $.trim($('#cnpj').val())},
        success: function(response, textStatus, jqXHR){
            hideLoadingModal();

            if (typeof config.success === 'function') {
                config.success(response, textStatus, jqXHR);
            }   
        }
	});	
}