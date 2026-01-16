var dataPais = undefined;
var modalPais = undefined;

function PaisClick(configDinamico = {})
{
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
    modalPais = createDynamicModal();
	modalPais.find('.modal-title').html(`<i class="fa fa-plus-circle"></i> Nacionalidade`);
    modalPais.find('.modal-dialog').addClass('modal-dialog-centered');
	modalPais.find('.modal-footer')
	.html(`<button id="${gerarHash(16)}" class="btn btn-success">Salvar</button>`)
	.click(e => {
        e.preventDefault();
		
		RestRequest({
			method: 'POST',
			url: config.url,
			data: dataPais,
			success: function (response, textStatus, jqXHR) {                    
				if (jqXHR.status === 201){
					dataPais = response;
				}
				
				hideLoadingModal();
				
				modalPais.modal('hide');
				
				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}                
			}
		}); 
	});

    carregarTemplateModal({
        modal: modalPais,       
        template: 'templates/Pais.html #frmPais',
		onLoad: function(){
			carregaSelect2({
				url: $baseApiUrl+'tabelaPaises',
				defaultText: 'nacionalidade',
				customProperties: {descricao: 'descricao'},
				container: '#selectNac',
				modal: modalPais,			
				change: function(data, value, element){
					if ((data !== null) && (data !== undefined)){
						dataPais = {};
						dataPais.id = data.id;
						dataPais.codigo = data.codigo;
						dataPais.descricao = data.descricao;
						dataPais.nacionalidade = data.nacionalidade;
						dataPais.ddi = data.ddi;
						dataPais.latitude = data.latitude;
						dataPais.longitude = data.longitude;
					}
				},
				unselect: function(e){
					dataPais = undefined;
				}		
			}); 			
		}
	});    
}