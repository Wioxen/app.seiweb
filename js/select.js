function carregaSelect2(configDinamico = {}) { // Novos parâmetros    
	const configFixo = {
		defaultText: 'descricao'
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
						text: item[config.defaultText],
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


function SetValueSelect2(_this, id, text) {
    if (!id || !text) return;
    
    // Limpa todas as opções existentes
    _this.empty();
    
    // Cria a nova opção
    var option = new Option(text, id, true, true);
    
    // Adiciona a nova opção
    _this.append(option);
    
    // Dispara os eventos de mudança
    _this.trigger('change');
    
    // Para Select2, dispara evento específico se necessário
    if (_this.data('select2')) {
        _this.trigger('change.select2');
    }
}

function LoadPessoaSelect2(configDinamico = {}) {
	const configFixo = {
		defaultText: 'descricao'
	};
    
	const config = { ...configFixo, ...configDinamico };
	
	const thisContainer = $(config.container);
	const thisFoto = $(config.thisFoto);
	
	thisContainer.select2({
		theme: "bootstrap-5",
		dropdownParent: config.modal,
		language: "pt-BR",
		ajax: {
			url: config.url, // URL do seu endpoint
			dataType: 'json',
			delay: 250, // Delay em ms para evitar muitas requisições
			data: function (params) {
				//console.log(params);
				return {
					q: params.term, // O que o usuário digitou
					page: params.page || 1,
					per_page: 30
				};
			},
			processResults: function (data, params) {
				params.page = params.page || 1;
				
				// Mapeie os dados do seu formato para o formato que o Select2 espera
				return {
					results: data.items.map(function(item) {
						return {
							id: item.id, // ou item.id dependendo do seu JSON
							text: item.descricao,
							// Se quiser adicionar dados extras
							foto: item.foto
						};
					}),
					pagination: {
						more: (params.page * 30) < data.total_count
					}
				};
			},
			cache: true
		},
		minimumInputLength: 1, // Número mínimo de caracteres antes de pesquisar
		placeholder: 'Pesquisar...',
		allowClear: true,
		templateResult: function(item) {
			// Personalize como o item aparece na dropdown
			if (!item.id) {
				return item.text;
			}
			var $result = $(`<div class="d-flex">
				<div class="avatar">
				<img src="${$imageUrl+item.foto}" alt="..." class="avatar-img rounded-circle">
				</div>
				<div class="info-post ms-2">
				<span class="username">${item.text}</span> <br/>
				<span class="date text-muted">20 Jan 18</span>
				</div>
			</div>`);
			return $result;
		},
		templateSelection: function(item) {
			// Personalize como o item selecionado aparece
			return item.text || item.descricao;
		}
		}).on("change", function (e) { 		
			//var selectedValue = $(this).select2('data')[0];
			var selectedValue = $(this).select2('data')[0];
			
			if ((selectedValue !== undefined) && (selectedValue !== null)){
				RestRequest({
					method: 'GET',
					url: $baseApiUrl+'pessoa/'+selectedValue.id,
					beforeSend: function(xhr){
						thisFoto.html('<span class="fa fa-spin fa-spinner fa-2x"></span>');
					},
					success: function(data)
					{
						thisFoto.html(`<img class="card-img-top rounded-circle mb-3" src="${$imageUrl+data.foto}" alt="[FOTO]" style="max-height: 130px; max-width: 130px;" />`);
					}
				});							
			} else {
				thisFoto.text('[FOTO]');
			}
			
			if (typeof config.change === 'function') {
				config.change(selectedValue);
			}                    			
		});
}