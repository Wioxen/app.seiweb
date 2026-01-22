var dataTurma = undefined;
var modalTurma = undefined;
var tbTurma = undefined;
var resourceTurma = "Turma";

/*function DetailTurma(d) {
    return `
        <div class="row-details">
            <h5>Detalhes do Registro #${d.id}</h5>
            <p><strong>Nome:</strong> ${d.id}</p>
            <p><strong>Email:</strong> ${d.id}</p>
        </div>
    `;
}*/

function exibeTurma(data) {
	$title = data.caption;
	
	const defaultColumns  = [
		{ 
			//title: 'Descrição',
			data: 'descricao',    
			orderable: false,
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
						<li><a class="dropdown-item" href="#" onclick="EditarTurmaClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
						</ul>
						</div>`                        
			}
		},
	];	
	
    var modalTbTurma = createDynamicModal();        
	
	modalTbTurma.find('.modal-title').text(data.label);
	modalTbTurma.find('.modal-dialog').addClass('modal-lg').addClass('dialog-centered');
	modalTbTurma.find('.modal-body').html(`<table id="TurmaTb" class="row-border stripe hover" style="width:100%"></table>`);
	modalTbTurma.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoTurmaClick(this);">
	<i class="icon-plus me-2"></i>Novo Cadastro
	</button>
	</div>`);
	
	tbTurma = CarregaDataTable({
		resource: 'Turma/DataTable',
		modal: modalTbTurma,
		columns: defaultColumns
	});
	
}

function TurmaClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourceTurma}/acesso`,
		success: exibeTurma
	});  
}

function exibeLoadTurma(response, status, xhr)
{
	preencherFormularioCompleto(dataTurma, '#frm'+resourceTurma);    	
	
	LoadSelect3({
		url: $baseApiUrl+'Curso',
		container: '#SelectCurso',
        modal: modalTurma,
		data: dataTurma,
		field: 'cursoId'
	});		
}


function ResetDefaultTurma(onModalCallback){
    hideLoadingModal();

	/*Create modal*/
    modalTurma = createDynamicModal(function(){
        dataTurma = null;
    }); 

    modalTurma.find('.modal-title').text($title);
    modalTurma.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-md');
    modalTurma.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarTurmaClick(this);"><i class="icon-close"></i> Cancelar</button>
	<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirTurmaClick(this);"><i class="icon-trash"></i> Excluir</button>
	<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarTurmaClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalTurma.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalTurma,       
        template: 'templates/'+resourceTurma+'.html #frm'+resourceTurma,
		onLoad: exibeLoadTurma,
		onModal: onModalCallback
	});                
}

function NovoTurmaClick(e)
{
    event.preventDefault();
	
	dataTurma = { id: 0 };
	
	ResetDefaultTurma(function(){
		$('#Ano').val(dataConfiguracao.ano);
		$('#DtInicio').val('01/01/'+dataConfiguracao.ano).trigger('input');
		$('#DtFim').val('31/12/'+dataConfiguracao.ano).trigger('input');
		$('#Descricao').focus();
	});	
}

function CancelarTurmaClick(){
    dataTurma = undefined;
    modalTurma.modal('hide');
}

function EditarTurmaClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceTurma+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataTurma = response;
			ResetDefaultTurma(function(){
				$('#Descricao').focus();
			});
		}
	});  	
}

function ExcluirTurmaClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourceTurma+"/"+dataTurma.id,
		success: function(data){
			setTimeout(() => {
				CancelarTurmaClick();
				tbTurma.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarTurmaClick(e){
    event.preventDefault();
	
	dataTurma.curso = null;
	dataTurma.turmaAnterior = null;
	
	dataTurma.ativo = checkboxValue($('#Ativo'));
	dataTurma.descricao = validarInput($('#Descricao'));
	dataTurma.sala = validarInput($('#Sala'));
	dataTurma.vagas = validarInput($('#Vagas'));
	dataTurma.turno = $('#Turno').val();
	dataTurma.ano = validarInput($('#Ano'));
	dataTurma.dtInicio = StrToDate(validarInput($('#DtInicio')));
	dataTurma.dtFim = StrToDate(validarInput($('#DtFim')));
	
	
	
	RestRequest({
		method: (dataTurma.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourceTurma+(dataTurma.id === 0 ? '' : `/${dataTurma.id}`),
		data: dataTurma,
		success: function (response, textStatus, jqXHR) {
			if (jqXHR.status === 201){
				dataTurma.id = response.id;
			}                
			hideLoadingModal();
			modalTurma.modal('hide');
			tbTurma.ajax.reload();
		}
	});
}