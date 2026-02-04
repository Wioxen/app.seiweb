var dataAluno = undefined;
var modalAluno = undefined;
var tbAluno = undefined;
var dataAlunoLetivo = undefined;

const resourceAluno = "Aluno";

function exibeListaAlunos(data) {
	const defaultColumns  = [
		{
			data: 'foto',
			orderable: false,
			"width": "6%",
			"render": function(data, type, row) {
				var _data = (data === null) ? 'assets/img/semfoto.png':$imageUrl+data;
				return `<img class="avatar-img rounded-circle" src="${_data}" style="width: 39px; height: 39px;" />`
			}
		},
		{ 
			data: null,              
			orderable: false,
			"width": "80%",
			"render": function(data, type, row) {
				return `<span>${row.descricao}</span>`
			}                    
		},
		{ 
			data: null,              
			orderable: false,
			"width": "5%",
			"render": function(data, type, row) {
				return `<span class="badge bg-secondary w-100">RM ${data.rm.toString().padStart(6, '0') }</span>`
			}                    
		},		
		{
			data: null,
			orderable: false,
			"width": "8%",
			"render": function(data, type, row) {
				return `<div class="dropdown">
				<button class="btn btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
				<i class="fa fa-ellipsis-h"></i>
				</button>
				<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
				<li><a class="dropdown-item" href="#" onclick="EditarAlunoClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
				</ul>
				</div>`                        
			}
		},
	];	
	
    var modalTbAluno = createDynamicModal();        
	
	modalTbAluno.find('.modal-title').html('<i class="fa-solid fa-user-graduate"></i> Alunos');
	modalTbAluno.find('.modal-dialog').addClass('modal-lg');
	modalTbAluno.find('.modal-body')
	.html(`<table id="AlunoTb" class="row-border stripe hover" style="width:100%"></table>`)
	modalTbAluno.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoAlunoClick(this);">
		<i class="icon-plus me-2"></i>Novo Cadastro
		</button>
	</div>`);
	
	tbAluno = CarregaDataTable({
		resource: 'Aluno/DataTable',
		modal: modalTbAluno,
		columns: defaultColumns
	});
	
}

function AlunoClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourceAluno}/acesso`,
		success: exibeListaAlunos
	});  
}

function ResetDefaultAluno(onModalCallback){
    hideLoadingModal();
	
	/*Create modal*/
    modalAluno = createDynamicModal(function(){
        dataAluno = null;
	}); 
	
    modalAluno.find('.modal-title').text('Cadastrar Aluno');
    modalAluno.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-xl');
    modalAluno.find('.modal-footer').html(`<div class="me-auto">
		<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarAlunoClick(this);"><i class="icon-close"></i> Cancelar</button>
		<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirAlunoClick(this);"><i class="icon-trash"></i> Excluir</button>
		<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarAlunoClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalAluno.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalAluno,       
        template: 'templates/'+resourceAluno+'.html #frmAluno',
		onLoad: exibeLoadAluno,
		onModal: onModalCallback
	});                
}

function exibeLoadAluno(response, status, xhr)
{
	preencherFormularioCompleto(dataAluno, '#frmAluno'); 
	
	LoadOrigem();
	
	LoadSaida();
	
	LoadAluno();
	
	preencherFormularioCompleto(dataAlunoLetivo, '#frmAluno'); 
	
	LoadCurso();	
	
	LoadResp();			
}


function LoadAluno()
{
	const arrLoad = [];
	arrLoad.push({container: 'SelectAluno', field: 'pessoaId', field2: 'pessoa'});
	arrLoad.push({container: 'SelectPaiAluno', field: 'paiId', field2: 'pai'});
	arrLoad.push({container: 'SelectMaeAluno', field: 'maeId', field2: 'mae'});
	
	$.each(arrLoad, function(i,v){
		var thisContainer = v.container;
		var meu_id = 0;
		
		if ((dataAluno[v.field2] !== undefined) && (dataAluno[v.field2] !== null))
		meu_id = dataAluno[v.field2].id;
		
		RestRequest({
			method: 'GET',
			url: $baseApiUrl+'pessoa/'+meu_id+'/select2',
			beforeSend: function(xhr){
				$('#input-group-'+thisContainer).html(`<div class="loading-label w-100">
					<span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
					Carregando ...
				</div>`);				
			},
			success: function(response, textStatus, jqXHR){
				$('#input-group-'+thisContainer).html(`<select id="${thisContainer}" class="form-select form-select-sm"></select>
					<span id="${gerarHash}" onclick="BtnEditarPessoaAlunoClick(this, dataAluno);" class="btn btn-outline-secondary btn-sm"><i class="fas fa-user-edit"></i></span>
				<span id="${gerarHash}" onclick="BtnNovoPessoaAlunoClick(this, dataAluno);" class="btn btn-outline-secondary btn-sm"><i class="fas fa-user-plus"></i></span>`);				
				
				LoadPessoaSelect2({
					container: '#'+thisContainer,
					modal: modalAluno,
					url: $baseApiUrl+'pessoa/repositories',
					thisFoto: (thisContainer === 'SelectAluno') ? '#FotoAluno':'',
					change: function(data){
						if ((data !== null) && (data !== undefined)){
							dataAluno[v.field] = data.id;				
							} else {
							dataAluno[v.field] = null;
						}						
					}
				});		
				
				if (jqXHR.status === 200)
				SetValueSelect2($('#' + thisContainer), response.id, response.descricao);		
			}
		});		
	});
}

function BtnEditarPessoaAlunoClick(e, data){
    var $btn = $(e);
    
    // Encontra a row
    var $row = $btn.closest('[data-field1]');
	
	if (!$row.length) {
		alert('Erro de configuração: data-field1 não encontrado.');
		return;
	}
	
	var $thisSelect = $btn.closest('.input-group').find('select');
	
	var field = $row.attr('data-field1');
	var objeto = $row.attr('data-field2');
	
	if ((data !== undefined) && (data !== null)) {
		RestRequest({
			method: 'GET',
			url: $baseApiUrl+"pessoa/"+data[field],
			success: function(response, textStatus, jqXHR){
				hideLoadingModal();
				dataPessoa = response;
				ResetDefaultPessoa({
					saveClick: function(e){
						SalvarPessoa(function(response, textStatus, jqXHR){
							hideLoadingModal();
							modalPessoa.modal('hide');
							
							setTimeout(function(){
								LoadAluno();
							},100);		
							
							setTimeout(function(){
								LoadResp();
							},100);		
						})	
					},
					showDelete: false,
					modalCallback: function(){
						$('#descricao').focus();
					}
				});					
			}
		});  	
	}
}

function BtnNovoPessoaAlunoClick(e){
    var $btn = $(e);
    
    // Encontra a row
    var $row = $btn.closest('[data-field1]');
	
	if (!$row.length) {
        alert('Erro de configuração: data-field1 não encontrado.');
        return;
	}
    
	var $thisSelect = $btn.closest('.input-group').find('select');
	
    var field = $row.attr('data-field1');
    var objeto = $row.attr('data-field2');
	
	dataPessoa = {id: 0};
	
	ResetDefaultPessoa({
		saveClick: function(e){
			Salvar2(e,field,objeto,$thisSelect);
		},
		showDelete: false,
		modalCallback: function(){
			$('#descricao').focus();
		}
	});					
}

function NovoAlunoClick(e)
{
    event.preventDefault();
	
	dataAluno = { id: 0 };
	dataAlunoLetivo = {id: 0, cursoId: 0, turmaId: 0, respPedId: 0, saida: 0};
	
	ResetDefaultAluno(function(){
		$('#SelectAluno').focus();		
		LoadCurso();
		LoadResp();								
	});	
}

function CancelarAlunoClick(){
    dataAluno = undefined;
    modalAluno.modal('hide');
}

function EditarAlunoClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceAluno+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			dataAluno = response;
			RestRequest({
				method: 'GET',
				url: $baseApiUrl+"AlunoLetivo/aluno/"+e.closest('tr').id+"/ano/"+dataConfiguracao.ano,
				success: function(response, textStatus, jqXHR){
					dataAlunoLetivo = {id: 0, cursoId: 0, turmaId: 0, respPedId: 0, saida: 0};
					
					if (jqXHR.status === 200){
						dataAlunoLetivo = response;				
					}
					
					ResetDefaultAluno();					
				}
			});			
			
		}
	});  	
}

function LoadResp(){
	const arrLoad = [];
	arrLoad.push({container: 'SelectRespPed', field: 'respPedId', field2: 'respPed'});
	//arrLoad.push({container: '#SelectMaeAluno', field: 'maeId', field2: 'mae'});
	
	$.each(arrLoad, function(i,v){
		var thisContainer = v.container;
		var id = 0;
		
		if ((dataAlunoLetivo[v.field2] !== undefined) && (dataAlunoLetivo[v.field2] !== null))
		id = dataAlunoLetivo[v.field2].id;
		
		RestRequest({
			method: 'GET',
			url: $baseApiUrl+'pessoa/'+id+'/select2',
			beforeSend: function(xhr){
				$('#input-group-'+thisContainer).html(`<div class="loading-label w-100">
					<span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
					Carregando ...
				</div>`);				
			},
			success: function(response, textStatus, jqXHR){
				$('#input-group-'+thisContainer).html(`<select id="${thisContainer}" class="form-select form-select-sm"></select>
					<span id="${gerarHash}" onclick="BtnEditarPessoaAlunoClick(this, dataAlunoLetivo);" class="btn btn-outline-secondary btn-sm"><i class="fas fa-user-edit"></i></span>
				<span id="${gerarHash}" onclick="BtnNovoPessoaAlunoClick(this, dataAlunoLetivo);" class="btn btn-outline-secondary btn-sm"><i class="fas fa-user-plus"></i></span>`);				
				
				LoadPessoaSelect2({
					container: '#'+thisContainer,
					modal: modalAluno,
					url: $baseApiUrl+'pessoa/repositories',
					change: function(data){
						if ((data !== null) && (data !== undefined)){
							dataAlunoLetivo[v.field] = data.id;				
							} else {
							dataAlunoLetivo[v.field] = null;
						}						
					}
				});		
				
				if (jqXHR.status === 200)
				SetValueSelect2($('#' + thisContainer), response.id, response.descricao);		
			}
		});		
	});	
}

function LoadCurso(){
	carregaSelect2({
		url: $baseApiUrl+'Curso/Select2',
		container: '#SelectCurso',
		modal: modalAluno,
		success: function(response, textStatus, jqXHR){
			$('#SelectCurso')
			.find('select')
			.val(safeGet(dataAlunoLetivo, 'cursoId'))
			.trigger('change');  
		},
		change: function(data, value, element){
			if ((data !== null) && (data !== undefined)){
				dataAlunoLetivo.cursoId = data.id;				
				} else {
				dataAlunoLetivo.cursoId = 0;
			}
			
			LoadTurma();
		},	
		tags: true
	});			
}

function LoadTurma(){
	carregaSelect2({
		url: $baseApiUrl+'turma/curso/'+dataAlunoLetivo.cursoId+'/ano/'+dataConfiguracao.ano,
		container: '#SelectTurma',
		modal: modalAluno,
		success: function(response, textStatus, jqXHR){
			$('#SelectTurma')
			.find('select')
			.val(safeGet(dataAlunoLetivo, 'turmaId'))
			.trigger('change');  
		},
		change: function(data, value, element){
			if ((data !== null) && (data !== undefined)){
				dataAlunoLetivo.turmaId = data.id;				
				} else {
				dataAlunoLetivo.turmaId = 0;
			}
			
			LoadVagas();
		},		
	});			
}

function ExcluirAlunoClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourceAluno+"/"+dataAluno.id,
		success: function(data){
			setTimeout(() => {
				CancelarAlunoClick();
				tbAluno.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarAlunoClick(e){
    event.preventDefault();
	
	dataAluno.pessoa = null;
	dataAluno.pai = null;
	dataAluno.mae = null;
	
	RestRequest({
		method: (dataAluno.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourceAluno+(dataAluno.id === 0 ? '' : `/${dataAluno.id}`),
		data: dataAluno,
		success: function (response, textStatus, jqXHR) {				
			tbAluno.ajax.reload();					
			
			if (jqXHR.status === 201){
				dataAluno.id = response.id;
			}   
			
			dataAlunoLetivo.alunoId = dataAluno.id; 
			dataAlunoLetivo.ano = dataConfiguracao.ano; 
			dataAlunoLetivo.respPed = null;
			dataAlunoLetivo.nro = validarInput($('#Nro'));
			dataAlunoLetivo.dtMatricula = StrToDate(validarInput($('#DtMatricula')));
			
			RestRequest({
				method: (dataAlunoLetivo.id === 0 ? 'POST' : 'PUT'),
				url: $baseApiUrl+'AlunoLetivo'+(dataAlunoLetivo.id === 0 ? '' : `/${dataAlunoLetivo.id}`),
				data: dataAlunoLetivo,
				success: function (response, textStatus, jqXHR) {
					hideLoadingModal();
					if (jqXHR.status === 201){
						dataAlunoLetivo.id = response.id;
					}                
					//modalAluno.modal('hide');
				}
			});
		}
	}); 
}

function NovoOrigemClick(e){
	dataBasico = {id: 0};
	ExibeBasico({
		title: 'Colégio de Origem',
		url: $baseApiUrl+'origem',
		success: function(response, textStatus, jqXHR){
			dataAluno.origem = dataBasico.id;
			LoadOrigem();
		}
	});
}

function EditarOrigemClick(e){
	RestRequest({
		method: 'GET',
		url: $baseApiUrl+'origem/'+dataAluno.origem,
		success: function (response, textStatus, jqXHR) {
			hideLoadingModal();
			dataBasico = response;
			ExibeBasico({
				title: 'Colégio de Origem',
				url: $baseApiUrl+'origem'+(dataBasico.id === 0 ? '' : `/${dataBasico.id}`),
				success: function(response, textStatus, jqXHR){
					LoadOrigem();
				}
			});					
		}
	});
}

function NovoSaidaClick(e){
	dataSaida = {id: 0};
	ExibeSaida({
		success: function(response, textStatus, jqXHR){
			dataAlunoLetivo.saida = dataSaida.id;
			LoadSaida();
		}
	});
}

function EditarSaidaClick(e){
	RestRequest({
		method: 'GET',
		url: $baseApiUrl+'saidadoaluno/'+dataAlunoLetivo.saida,
		success: function (response, textStatus, jqXHR) {
			hideLoadingModal();
			dataSaida = response;
			ExibeSaida({
				success: function(response, textStatus, jqXHR){
					LoadSaida();
				}
			});					
		}
	});
}

function LoadOrigem(){
	LoadSelect3({
		url: $baseApiUrl+'Origem',
		container: '#SelectOrigem',
		modal: modalAluno,
		data: dataAluno,
		field: 'origem',
		success: function(response, textStatus, jqXHR){
			$('#SelectOrigem').append(`
				<span id="${gerarHash()}" onclick="EditarOrigemClick(this);" class="btn btn-outline-secondary btn-sm"><i class="fa fa-pen"></i></span>
				<span id="${gerarHash()}" onclick="NovoOrigemClick(this);" class="btn btn-outline-secondary btn-sm"><i class="fa fa-plus-circle"></i></span>
			`);
		}
	});		
}

function LoadSaida(){
	LoadSelect3({
		url: $baseApiUrl+'saidadoaluno',
		container: '#SelectSaida',
		modal: modalAluno,
		data: dataAlunoLetivo,
		field: 'saida',
		success: function(response, textStatus, jqXHR){
			$('#SelectSaida').append(`
				<span id="${gerarHash()}" onclick="EditarSaidaClick(this);" class="btn btn-outline-secondary btn-sm"><i class="fa fa-pen"></i></span>
				<span id="${gerarHash()}" onclick="NovoSaidaClick(this);" class="btn btn-outline-secondary btn-sm"><i class="fa fa-plus-circle"></i></span>
			`);
		}
	});		
}

function LoadVagas(){
	RestRequest({
		method: 'GET',
		url: $baseApiUrl+'turma/'+dataAlunoLetivo.turmaId+'/vagas',
		beforeSend: function(xhr){
			$('#VagasCriadas').html('Vagas <i class="fa fa-spin fa-spinner"></i>');
			$('#VagasOcupadas').html('Ocupadas <i class="fa fa-spin fa-spinner"></i>');
			$('#VagasLivres').html('Livres <i class="fa fa-spin fa-spinner"></i>');
		},
		success: function (response, textStatus, jqXHR) {
			$('#VagasCriadas').html('Vagas '+response.vagas);
			$('#VagasOcupadas').html('Ocupadas '+response.ocupadas);
			$('#VagasLivres').html('Livres '+response.livres);			
		}
	}); 	
}