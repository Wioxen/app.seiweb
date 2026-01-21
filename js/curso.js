var dataCurso = undefined;
var modalCurso = undefined;
var tbCurso = undefined;
var resourceCurso = "Curso";

/*function DetailCurso(d) {
    return `
        <div class="row-details">
            <h5>Detalhes do Registro #${d.id}</h5>
            <p><strong>Nome:</strong> ${d.id}</p>
            <p><strong>Email:</strong> ${d.id}</p>
        </div>
    `;
}*/

function exibeCurso(data) {
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
						<li><a class="dropdown-item" href="#" onclick="EditarCursoClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
						<li><a class="dropdown-item" href="#" onclick="TurmasClick(this);"><i class="fas fa-user-group"></i> Turmas</a></li>					
						</ul>
						</div>`                        
			}
		},
	];	
	
    var modalTbCurso = createDynamicModal();        
	
	modalTbCurso.find('.modal-title').text(data.label);
	modalTbCurso.find('.modal-dialog').addClass('modal-lg');
	modalTbCurso.find('.modal-body').html(`<table id="CursoTb" class="row-border stripe hover" style="width:100%"></table>`);
	modalTbCurso.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoCursoClick(this);">
	<i class="icon-plus me-2"></i>Novo Cadastro
	</button>
	</div>`);
	
	tbCurso = CarregaDataTable({
		resource: 'Curso/DataTable',
		modal: modalTbCurso,
		columns: defaultColumns
	});
	
}

function CursoClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourceCurso}/acesso`,
		success: exibeCurso
	});  
}

function exibeLoadCurso(response, status, xhr)
{
	preencherFormularioCompleto(dataCurso, '#frm'+resourceCurso);    	
	
	LoadSelect3({
		url: $baseApiUrl+'EtapaDeEnsino',
		container: '#SelectEtapaDeEnsino',
        modal: modalCurso,
		data: dataCurso,
		field: 'etapaDeEnsino'
	});		

	LoadSelect3({
		url: $baseApiUrl+'Curso',
		container: '#SelectProximoCurso',
        modal: modalCurso,
		data: dataCurso,
		field: 'proximoCurso'
	});		
}


function ResetDefaultCurso(onModalCallback){
    hideLoadingModal();

	/*Create modal*/
    modalCurso = createDynamicModal(function(){
        dataCurso = null;
    }); 

    modalCurso.find('.modal-title').text($title);
    modalCurso.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-lg');
    modalCurso.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarCursoClick(this);"><i class="icon-close"></i> Cancelar</button>
	<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirCursoClick(this);"><i class="icon-trash"></i> Excluir</button>
	<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarCursoClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalCurso.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalCurso,       
        template: 'templates/'+resourceCurso+'.html #frm'+resourceCurso,
		onLoad: exibeLoadCurso,
		onModal: onModalCallback
	});                
}

function NovoCursoClick(e)
{
    event.preventDefault();
	
	dataCurso = { id: 0 };
	
	ResetDefaultCurso(function(){
		$('#Descricao').focus();
	});	
}

function CancelarCursoClick(){
    dataCurso = undefined;
    modalCurso.modal('hide');
}

function EditarCursoClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourceCurso+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataCurso = response;
			ResetDefaultCurso(function(){
				$('#Descricao').focus();
			});
		}
	});  	
}

function ExcluirCursoClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourceCurso+"/"+dataCurso.id,
		success: function(data){
			setTimeout(() => {
				CancelarCursoClick();
				tbCurso.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarCursoClick(e){
    event.preventDefault();
	
	dataCurso.descricao = validarInput($('#Descricao'));
	dataCurso.serie = validarInput($('#Serie'));
	dataCurso.faixaEtaria1 = validarInput($('#FaixaEtaria1'));
	dataCurso.faixaEtaria2 = validarInput($('#FaixaEtaria2'));
	
	RestRequest({
		method: (dataCurso.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourceCurso+(dataCurso.id === 0 ? '' : `/${dataCurso.id}`),
		data: dataCurso,
		success: function (response, textStatus, jqXHR) {
			if (jqXHR.status === 201){
				dataCurso.id = response.id;
			}                
			hideLoadingModal();
			modalCurso.modal('hide');
			tbCurso.ajax.reload();
		}
	});
}