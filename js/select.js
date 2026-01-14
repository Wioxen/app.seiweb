function carregaSelect2(configDinamico = {}) { // Novos parâmetros    
	const configFixo = {
	};
    
	const config = { ...configFixo, ...configDinamico };
	
	const thisContainer = $(config.container);

    RestRequest({
		method: 'GET',
        url: config.url,
        beforeSend: function(xhr){
            thisContainer.html(`<div class="loading-label w-100">
                        <span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
                        Carregando ...
                    </div>`);
					
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function(response, textStatus, jqXHR){
            thisContainer.html(`<select id="${gerarHash()}" class="form-select form-select-sm"></select>`); 
            
            var thisSelect = thisContainer.find('select');

            // Armazena a resposta para usar no change
            var selectData = response;
			
			var arrData = [];

			if (Array.isArray(response)) {				
				response.forEach(function (item) {
					var dataItem = {
						text: item.descricao,
						id: item.id
					};

                    // CORREÇÃO: Adiciona propriedades customizadas corretamente
                    if (config.customProperties) {
                        Object.keys(config.customProperties).forEach(function (propName) {
                            var apiFieldName = config.customProperties[propName];
                            // Verifica se o campo existe no item antes de adicionar
                            if (item.hasOwnProperty(apiFieldName)) {
                                dataItem[propName] = item[apiFieldName];
                            } else {
                                console.warn(`Campo "${apiFieldName}" não encontrado no item:`, item);
                                dataItem[propName] = null;
                            }
                        });
                    }

					arrData.push(dataItem);
				});
			}			

            thisSelect.select2({
                theme: "bootstrap-5",
                dropdownParent: config.modal,
                language: "pt-BR",
                placeholder: '',
                allowClear: true,
                data: arrData
            });          
            
            // Implementação dos eventos com callbacks
            thisSelect.on("select2:open", function (e) { 
                //console.log("select2:open", e);
                if (typeof config.open === 'function') {
                    config.open(e, thisSelect);
                }
            });
            
            thisSelect.on("select2:close", function (e) { 
                //console.log("select2:close", e);
                if (typeof config.close === 'function') {
                    config.close(e, thisSelect);
                }
            });
            
            thisSelect.on("select2:unselect", function (e) { 
                //console.log("select2:unselect", e);
                if (typeof config.unselect === 'function') {
                    config.unselect(e, thisSelect);
                }
            });

            thisSelect.on("select2:select", function (e) { 
                //console.log("select2:select", e);
                var selectedData = e.params.data;
                if (typeof config.select === 'function') {
                    config.select(selectedData, thisSelect);
                }            
            });

            thisSelect.on("change", function (e) { 
                var selectedValue = $(this).val();
                var selectedData = null;
                
                // Encontra os dados completos do item selecionado
                if (selectedValue) {
                    selectedData = selectData.find(function(item) {
                        return item.id == selectedValue;
                    });
                    
                    // Se não encontrou pelos dados originais, tenta pelos dados do Select2
                    if (!selectedData) {
                        var select2Data = $(this).select2('data');
                        if (select2Data && select2Data.length > 0) {
                            selectedData = select2Data[0];
                        }
                    }
                }
                
                if (typeof config.change === 'function') {
                    config.change(selectedData, selectedValue, thisSelect);
                }                    
            });          

            if (typeof config.success === 'function') {
                config.success(response, textStatus, jqXHR);
            }            
        },
        function(jqXHR, textStatus, errorThrown){
            thisContainer.html(`${jqXHR.responseText}`);
        }
	});    
}