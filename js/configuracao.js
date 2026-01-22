function ConfiguracaoClick(e){
    event.preventDefault();

	var $this = $(e);
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+"Configuracoes/1",
        beforeSend: function(xhr){
            showLoadingModal();       
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function(data, status, xhr){
			dataConfiguracao = data;
			
            hideLoadingModal();
			
			modalConfiguracao = createDynamicModal(function(){
				dataUsuario = null;
			}); 
			
			modalConfiguracao.find('.modal-title').html('<i class="fa fa-gear"></i> Configurações');
			modalConfiguracao.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-lg');
			modalConfiguracao.find('.modal-footer').html(`<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarConfiguracaoClick(this);"><i class="icon-note"></i> Salvar</button>`);
			
			carregarTemplateModal({
				modal: modalConfiguracao,       
				template: 'templates/Configuracao.html #frmConfiguracao',
				onLoad: exibeLoadConfiguracao,
				onModal: function(){
					$('#Ano').focus().select();
				}
			}); 	
			
		}
	});
}

function exibeLoadConfiguracao(response, status, xhr)
{
	$('#Ano').val(dataConfiguracao.ano);
}

function SalvarConfiguracaoClick(){
	dataConfiguracao.ano = validarInput($('#Ano'));
	
	RestRequest({
		method: 'PUT',
		url: $baseApiUrl+"Configuracoes/1",
		data: dataConfiguracao,
		success: function (response, textStatus, jqXHR) {
			dataConfiguracao = response;                
			hideLoadingModal();
			$('#AnoTexto').text(response.ano);
			modalConfiguracao.modal('hide');
		}
	});	
}
