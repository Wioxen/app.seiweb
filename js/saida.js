var dataSaida = undefined;
var modalSaida = undefined;

function ExibeSaida(configDinamico = {})
{
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
    modalSaida = createDynamicModal();
	modalSaida.find('.modal-title').html(`<i class="fa fa-plus-circle"></i> Saida do aluno`);
    modalSaida.find('.modal-dialog').addClass('modal-dialog-centered');
	modalSaida.find('.modal-footer')
	.html(`<button id="${gerarHash(16)}" class="btn btn-success">Salvar</button>`)
	.click(e => {
        e.preventDefault();
		
		dataSaida.descricao = validarInput($('#SaidaDescricao'));
		dataSaida.cor = $('input[name="color"]:checked').val();
		
		RestRequest({
			method: (dataSaida.id === 0 ? 'POST' : 'PUT'),
			url: $baseApiUrl+'saidadoaluno'+(dataSaida.id === 0 ? '' : `/${dataSaida.id}`),
			data: dataSaida,
			success: function (response, textStatus, jqXHR) {                    
				if (jqXHR.status === 201){
					dataSaida = response;
				}
				
				hideLoadingModal();
				
				modalSaida.modal('hide');
				
				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}                
			}
		}); 
	});

    carregarTemplateModal({
        modal: modalSaida,       
        template: 'templates/Saida.html #frmSaida',
		onModal: function(){
			$(`input[name="color"][value="${dataSaida.cor}"]`).prop('checked', true);	
			$('#SaidaDescricao').val(dataSaida.descricao).focus();
		}
	});    
}