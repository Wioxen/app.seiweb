var dataMunicipio = undefined;
var modalMunicipio = undefined;

function MunicipioClick(configDinamico = {})
{
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
	dataMunicipio = {};
    
	modalMunicipio = createDynamicModal();
	modalMunicipio.find('.modal-title').html(`<i class="fa fa-plus-circle"></i> Adicionar Município`);
    modalMunicipio.find('.modal-dialog').addClass('modal-dialog-centered');
	modalMunicipio.find('.modal-footer')
	.html(`<button id="${gerarHash(16)}" class="btn btn-success btn-sm"><i class="fa fa-check"></i> Salvar</button>`)
	.click(e => {
        e.preventDefault();
		
		dataMunicipio.id = 0;
		dataMunicipio.ibge = validarInput($('#MunicipioIbge'));
		dataMunicipio.descricao = validarInput($('#MunicipioDescricao'));
		
		RestRequest({
			method: 'POST',
			url: $baseApiUrl+'Municipio',
			data: dataMunicipio,
			success: function (response, textStatus, jqXHR) {                    
				if (jqXHR.status === 201){
					dataMunicipio = response;
				}
				
				hideLoadingModal();
				
				modalMunicipio.modal('hide');
				
				if (typeof config.success === 'function') {
					config.success(response, textStatus, jqXHR);
				}                
			}
		});
	});

    carregarTemplateModal({
        modal: modalMunicipio,       
        template: 'templates/Municipio.html #frmMunicipio',
		onLoad: exibeLoadMunicipio,
		onModal: function(){
			$('#MunicipioDescricao').focus();
		}
	});    
}

function exibeLoadMunicipio(response, status, xhr){
	carregaSelect2({
		url: $baseApiUrl+'lista/estados',
		container: '#selectMunicipioUf',
		customProperties: {uf: 'uf'},
		modal: modalMunicipio,
		success: function(response, textStatus, jqXHR){
			if ((dataMunicipio !== undefined) && (dataMunicipio != null))
			{
				$('#selectMunicipioUf')
					.find('select')
					.val(dataMunicipio.uf)
					.trigger('change');                    
			}
		},
		change: function(data, value, element){
			if ((data !== null) && (data !== undefined)){
				dataMunicipio.uf = data.uf;				
			}
		},
		unselect: function(e){
			dataMunicipio.uf = null;
		}		
	}); 		

	$('#btnIbge').off('click').on('click',function(e){
		e.preventDefault();
		RestRequest({
			method: 'POST',
			url: $baseApiUrl+'apiservice/ibge',
			data: {modulo:"Municipio", descricao: $('#MunicipioDescricao').val() , uf: $('#selectMunicipioUf').find('select').select2('data')[0].uf },
			success: function(data){
				hideLoadingModal();
				$('#MunicipioIbge').val(data);
			}
		});				
	});
}