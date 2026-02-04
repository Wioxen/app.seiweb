var dataBasico = undefined;
var modalBasico = undefined;

function ExibeBasico(configDinamico = {})
{
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
    modalBasico = createDynamicModal();
	modalBasico.find('.modal-title').html(`<i class="fa fa-plus-circle"></i> ${config.title}`);
    modalBasico.find('.modal-dialog').addClass('modal-dialog-centered');
	modalBasico.find('.modal-footer')
	.html(`<button id="${gerarHash(16)}" class="btn btn-success">Salvar</button>`)
	.click(e => {
        e.preventDefault();
		
		dataBasico.descricao = validarInput($('#BasicoDescricao'));
		
		RestRequest({
			method: (dataBasico.id === 0 ? 'POST' : 'PUT'),
			url: config.url,
			data: dataBasico,
			success: function (response, textStatus, jqXHR) {                    
				if (jqXHR.status === 201){
					dataBasico = response;
				}
				
				hideLoadingModal();
				
				modalBasico.modal('hide');
				
				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}                
			}
		}); 
	});

    carregarTemplateModal({
        modal: modalBasico,       
        template: 'templates/Basico.html #frmBasico',
		onModal: function(){
			$('#BasicoDescricao').val(dataBasico.descricao).focus();
		}
	});    
}