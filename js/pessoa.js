var dataPessoa = undefined;
var modalPessoa = undefined;
var tbPessoa = undefined;

const resourcePessoa = "Pessoa";

function exibePessoa(data) {
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
			"width": "8%",
			"render": function(data, type, row) {
				return `<div class="dropdown">
						<button class="btn btn-sm" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
						<i class="fa fa-ellipsis-h"></i>
						</button>
						<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
						<li><a class="dropdown-item" href="#" onclick="EditarPessoaClick(this);"><i class="fas fa-edit"></i> Editar</a></li>					
						</ul>
						</div>`                        
			}
		},
	];	
	
    var modalTbPessoa = createDynamicModal();        
	
	modalTbPessoa.find('.modal-title').text('Pessoa');
	modalTbPessoa.find('.modal-dialog').addClass('modal-lg');
	modalTbPessoa.find('.modal-body')
		.html(`<table id="PessoaTb" class="row-border stripe hover" style="width:100%"></table>`)
	modalTbPessoa.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" type="button" class="btn btn-success" onclick="NovoPessoaClick(this);">
	<i class="icon-plus me-2"></i>Novo Cadastro
	</button>
	</div>`);
	
	tbPessoa = CarregaDataTable({
		resource: 'Pessoa/DataTable',
		modal: modalTbPessoa,
		columns: defaultColumns
	});
	
}

function PessoaClick(e) {	
    RestRequest({
		method: 'GET',
		url: `${$baseApiUrl}${resourcePessoa}/acesso`,
		success: exibePessoa
	});  
}

function ResetDefaultPessoa(onModalCallback){
    hideLoadingModal();

	/*Create modal*/
    modalPessoa = createDynamicModal(function(){
        dataPessoa = null;
    }); 

    modalPessoa.find('.modal-title').text('Cadastrar Pessoa');
    modalPessoa.find('.modal-dialog').addClass('modal-dialog-scrollable').addClass('modal-xl');
    modalPessoa.find('.modal-footer').html(`<div class="me-auto">
	<button id="${gerarHash()}" class="btn btn-warning" onclick="CancelarPessoaClick(this);"><i class="icon-close"></i> Cancelar</button>
	<button id="${gerarHash()}" class="btn btn-danger" onclick="ExcluirPessoaClick(this);"><i class="icon-trash"></i> Excluir</button>
	<button id="${gerarHash()}" class="btn btn-success" onclick="SalvarPessoaClick(this);"><i class="icon-note"></i> Salvar</button>
	</div>`);
	
    modalPessoa.find('.modal-header-search').hide();	
	
    carregarTemplateModal({
        modal: modalPessoa,       
        template: 'templates/'+resourcePessoa+'.html #frm'+resourcePessoa,
		onLoad: exibeLoadPessoa,
		onModal: onModalCallback
	});                
}

function exibeLoadPessoa(response, status, xhr)
{
	$('#btnCep').off('click').on('click', ConsultaCepPessoa);

	$('#cep').on('blur', function() {
		if ((dataPessoa.cep !== '') && (dataPessoa.cep !== null))
			$('#btnCep').click();
	});

	$('#uploadLogoPessoa').off('click').on('click', uploadLogoPessoa);	
	$('#UploadDocumento').off('click').on('click', uploadDocumentoPessoa);	
	$('#UploadComprovante').off('click').on('click', uploadComprovantePessoa);	

	$('#apagarLogoPessoa').off('click').on('click', apagarLogoPessoa);
	$('#ApagarDocumento').off('click').on('click', ApagarPessoaDocumento);
	$('#ApagarComprovante').off('click').on('click', ApagarPessoaComprovante);

	/*$('#cnpj').trigger('input').trigger('change');
	$('#cep').trigger('input').trigger('change');
	$('#telefone').trigger('input').trigger('change');
	$('#celular').trigger('input').trigger('change');*/
	
	preencherFormularioCompleto(dataPessoa, '#frm'+resourcePessoa);  
	
	if ((dataPessoa.dtNasc !== '') && (dataPessoa.dtNasc !== null))
		$('#dtNasc').val(DateToStr(dataPessoa.dtNasc)).trigger('input').trigger('change');
	
	if ((dataPessoa.imgDocumento !== '') && (dataPessoa.imgDocumento !== null))
		$('#BadgeDocumento').text('1');

	if ((dataPessoa.imgComprovante !== '') && (dataPessoa.imgComprovante !== null))
		$('#BadgeComprovante').text('1');

	
	if (dataPessoa.foto != null){
			$('#LogoPessoa').attr('src', $imageUrl+dataPessoa.foto);
			
			$('#LogoPessoa').click(function(){
				Swal.fire({
				  imageUrl: $imageUrl+dataPessoa.foto,
				  imageHeight: 300,				  
				  imageAlt: "A tall image"
				});				
			});
			
		}	
		
	CarregaPessoaSelect('#selectPessoaBairro','Bairro','bairroId');
	CarregaPessoaSelect('#selectPessoaMunicipio','Municipio','municipioId');	
	CarregaPessoaSelect('#selectPessoaNat','Municipio','natId');	
	CarregaPessoaSelect('#selectPessoaPais','pais','paisId','nacionalidade');
	CarregaPessoaSelect('#selectPessoaEstadoCivil','estadoCivil','estadoCivilId');

    carregaSelect2({
		url: $baseApiUrl+'lista/sexo',
		container: '#selectPessoaSexo',
        modal: modalPessoa,
        success: function(response, textStatus, jqXHR){
			$('#selectPessoaSexo')
				.find('select')
				.val(safeGet(dataPessoa, 'sexo'))
				.trigger('change');  
        },
        change: function(data, value, element){
            if ((data !== null) && (data !== undefined)){
				dataPessoa.sexo = data.id;				
            }
        },
        unselect: function(e){
			dataPessoa.sexo = null;
		}		
	}); 	
}

function NovoPessoaClick(e)
{
    event.preventDefault();
	
	dataPessoa = { id: 0 };
	
	ResetDefaultPessoa(function(){
		$('#descricao').focus();
	});	
}

function CancelarPessoaClick(){
    dataPessoa = undefined;
    modalPessoa.modal('hide');
}

function EditarPessoaClick(e){
    event.preventDefault();
	
    RestRequest({
		method: 'GET',
        url: $baseApiUrl+resourcePessoa+"/"+e.closest('tr').id,
		success: function(response, textStatus, jqXHR){
			hideLoadingModal();
			dataPessoa = response;
			ResetDefaultPessoa(function(){
				$('#descricao').focus();
			});
		}
	});  	
}

function ExcluirPessoaClick(e){
    event.preventDefault();
	
	zPergunta_Exclui({
		url: $baseApiUrl+resourcePessoa+"/"+dataPessoa.id,
		success: function(data){
			setTimeout(() => {
				CancelarPessoaClick();
				tbPessoa.ajax.reload();
			}, 10); 
		}
	});
}

function SalvarPessoaClick(e){
    event.preventDefault();
	
	dataPessoa.descricao = validarInput($('#descricao'));
	dataPessoa.numero = validarInput($('#numero'));
	dataPessoa.complemento = validarInput($('#complemento'));
	dataPessoa.dtNasc = StrToDate(validarInput($('#dtNasc')));
	dataPessoa.cpfCnpj = validarInput($('#cpfCnpj'));
	dataPessoa.rg = validarInput($('#rg'));
	dataPessoa.tel = validarInput($('#tel'));
	dataPessoa.cel = validarInput($('#cel'));
	dataPessoa.celWhats = checkboxValue($('#celWhats'));
	dataPessoa.email = validarInput($('#email'));
	dataPessoa.senhaNet = validarInput($('#senhaNet'));
	
	RestRequest({
		method: (dataPessoa.id === 0 ? 'POST' : 'PUT'),
		url: $baseApiUrl+resourcePessoa+(dataPessoa.id === 0 ? '' : `/${dataPessoa.id}`),
		data: dataPessoa,
		success: function (response, textStatus, jqXHR) {
			if (jqXHR.status === 201){
				dataPessoa.id = response.id;
			}                
			hideLoadingModal();
			modalPessoa.modal('hide');
			tbPessoa.ajax.reload();
		}
	}); 
}

function CarregaPessoaSelect(container, resource, field, defaultText = 'descricao'){
    carregaSelect2({
		url: $baseApiUrl+resource,
		container: container,
		defaultText: defaultText,
        modal: modalPessoa,
        success: function(response, textStatus, jqXHR){
            $(container)
				.find('select')
                .val(safeGet(dataPessoa, field))
                .trigger('change');
        },
        change: function(data, value, element){
            if ((data !== null) && (data !== undefined)){
                dataPessoa[field] = data.id;
            }
        },
        unselect: function(e){
			dataPessoa[field] = null;
		}	
	});    
}

function ConsultaCepPessoa(){
	ConsultaCep({
		resource: 'Pessoa',
		cep: $('#cep').val(),
		success: function(response, textStatus, jqXHR){
			preencherFormularioCompleto(response, '#frmPessoa');
			dataPessoa.endereco = validarInput($('#endereco'));
			dataPessoa.cep = response.cep;
			$('#cep').trigger('input').trigger('change');
			dataPessoa.bairroId = response.bairroId;
            dataPessoa.municipioId = response.municipioId;
			CarregaPessoaSelect('#selectPessoaBairro','Bairro','bairroId');
			CarregaPessoaSelect('#selectPessoaMunicipio','Municipio','municipioId');	
           $('#numero').focus();			
		}
	});
}

function PessoaBasico(title,container,resource,fieldName){
	event.preventDefault();
	
	BasicoClick({
		title: title,
		url: $baseApiUrl+resource,
		success: function(response, textStatus, jqXHR){
			dataPessoa[fieldName] = dataBasico.id;
			CarregaPessoaSelect(container,resource,fieldName);
		}
	});
}

function PessoaBairroClick(e){
	event.preventDefault();	
	PessoaBasico('Adicionar Bairro','#selectPessoaBairro','Bairro','bairroId');
}

function PessoaMunicipioClick(e){
	event.preventDefault();
	
	MunicipioClick({
		success: function(response, textStatus, jqXHR){
			dataPessoa.municipioId = response.id;
			CarregaPessoaSelect('#selectPessoaMunicipio','Municipio','municipioId');
		}
	});
}


function PessoaEstadoCivilClick(e){
	event.preventDefault();	
	PessoaBasico('Adicionar Estado Civil','#selectPessoaEstadoCivil','EstadoCivil','estadoCivilId');
}

function PessoaPaisClick(e){
	event.preventDefault();
	
	PaisClick({
		url: $baseApiUrl+'pais',
		success: function(response, textStatus, jqXHR){
			dataPessoa.paisId = response.id;
			CarregaPessoaSelect('#selectPessoaPais','pais','paisId','nacionalidade');
		}
	});
}

function PessoaNatClick(e){
	event.preventDefault();
	
	MunicipioClick({
		success: function(response, textStatus, jqXHR){
			dataPessoa.natId = response.id;
			CarregaPessoaSelect('#selectPessoaNat','Municipio','natId');
		}
	});
}


async function uploadLogoPessoa(event) {
	const { value: file } = await Swal.fire({
	  title: "Selecione uma imagem",
	  input: "file",
	  inputAttributes: {
		"accept": "image/*",
		"aria-label": "Carregue sua imagem"
	  },
	  showCancelButton: true,
	  confirmButtonText: "Enviar",
	  cancelButtonText: "Sair",
	  showLoaderOnConfirm: true,
	  allowOutsideClick: () => !Swal.isLoading()
	});
	
	UploadSingleImage({
		file: file,
		success: function(response, textStatus, jqXHR){
			dataPessoa.foto = response;
			$('#LogoPessoa').attr('src', $imageUrl+dataPessoa.foto);	
			$('#LogoPessoa').click(function(){
				Swal.fire({
				  imageUrl: $imageUrl+dataPessoa.foto,
				  imageHeight: 300,				  
				  imageAlt: "A tall image"
				});				
			});			
		}
	});
}

async function uploadDocumentoPessoa(event) {
	const { value: file } = await Swal.fire({
	  title: "Selecione uma imagem",
	  input: "file",
	  inputAttributes: {
		"accept": "image/*,.pdf",
		"aria-label": "Carregue sua imagem"
	  },
	  showCancelButton: true,
	  confirmButtonText: "Enviar",
	  cancelButtonText: "Sair",
	  showLoaderOnConfirm: true,
	  allowOutsideClick: () => !Swal.isLoading()
	});
	
	UploadSingleImage({
		file: file,
		alertSuccess: false,
		success: function(response, textStatus, jqXHR){
			$.notify({
					icon: 'icon-bell',
					title: 'Mensagem',
					message: "Documento enviado com sucesso.",
					},{
					type: 'success',
					placement: {
						from: "top",
						align: "center"
					},
					time: 300,
				});				
				
			$('#BadgeDocumento').text('1');
			dataPessoa.imgDocumento = response;
			$('#UploadDocumento').attr('src', $imageUrl+dataPessoa.imgDocumento);				
		}
	});
}

async function uploadComprovantePessoa(event) {
	const { value: file } = await Swal.fire({
	  title: "Selecione uma imagem",
	  input: "file",
	  inputAttributes: {
		"accept": "image/*,.pdf",
		"aria-label": "Carregue sua imagem"
	  },
	  showCancelButton: true,
	  confirmButtonText: "Enviar",
	  cancelButtonText: "Sair",
	  showLoaderOnConfirm: true,
	  allowOutsideClick: () => !Swal.isLoading()
	});
	
	UploadSingleImage({
		file: file,
		alertSuccess: false,
		success: function(response, textStatus, jqXHR){
			$.notify({
					icon: 'icon-bell',
					title: 'Mensagem',
					message: "Comprovante enviado com sucesso.",
					},{
					type: 'success',
					placement: {
						from: "top",
						align: "center"
					},
					time: 300,
				});		
				
			$('#BadgeComprovante').text('1');
			dataPessoa.imgComprovante = response;
			$('#UploadComprovante').attr('src', $imageUrl+dataPessoa.imgComprovante);		
		}
	});
}

function apagarLogoPessoa() {
    dataPessoa.foto = null;
    $('#LogoPessoa').attr('src', '#');
}

function ApagarPessoaDocumento() {
    dataPessoa.imgDocumento = null;
    $('#ApagarDocumento').attr('src', '#');
	$('#BadgeDocumento').text('0');
}

function ApagarPessoaComprovante() {
    dataPessoa.imgComprovante = null;
    $('#ApagarComprovante').attr('src', '#');
	$('#BadgeComprovante').text('0');
}

function DownloadPessoaDocumento()
{
	DownloadFile({
		url: $imageUrl+dataPessoa.imgDocumento,
		fileName: dataPessoa.imgDocumento
	});
}

function DownloadPessoaComprovante()
{
	DownloadFile({
		url: $imageUrl+dataPessoa.imgComprovante,
		fileName: dataPessoa.imgComprovante
	});
}