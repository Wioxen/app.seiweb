var dataAluno = undefined;
var $thisAluno = undefined;
var $modalAluno = undefined;
var $cadastroAluno = undefined;

function DetailAluno (d) {
    return `
<ul class="list-group list-group-flush">
  <li class="list-group-item">An item</li>
  <li class="list-group-item">A second item</li>
  <li class="list-group-item">A third item</li>
  <li class="list-group-item">A fourth item</li>
  <li class="list-group-item">And a fifth one</li>
</ul>
    `;
}

function alunoClick(e) {
    $thisAluno = $(e);

    RestRequest('POST',
        $baseApiUrl+"usuariomodulo",
        {modulo : $thisAluno.attr('data-modulo')+"4"},
        null,
        function (data) {
            hideLoadingModal();

            const defaultColumns = [
                {class: 'warning-aluno', orderable: false, searchable: false, data: null, defaultContent: '', "width": "2%",
                    "render": function(data, type, row) {
                        return `<span><i class="fa fa-exclamation-triangle text-warning"></i></span>`
                    } },
                {
                    data: 'foto',
                    orderable: false,
                    "width": "6%",
                    "render": function(data, type, row) {
                        //return `<img id="img-aluno-${row}" data-foto=${data} class="foto avatar-img rounded-circle" src="#" style="width: 40px; height: 40px;" />`
                        return `<span id="img-aluno-${row.id}" data-foto="${data}" class="foto"><i class="fa fa-spin fa-spinner fa-2x"></i></span>`
                    }
                },
                { 
                    data: 'descricao',              
                    orderable: false,
                    "width": "80%"
                },
                {
                    data: 'id',
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
                }
            ];

            $cadastroAluno = 
                CarregaDataTable
                (
                    'datatable/aluno',
                    'Alunos',
                    'modal-xl',
                    `<table id="AlunoTb" class="row-border stripe hover" style="width:100%"></table>`,
                    `<div class="footer-buttons">
                        <button id="btnNovoAluno" type="button" class="btn btn-success" onclick="NovoAlunoClick(this);">
                            <i class="fa fa-plus-circle me-2"></i>Novo Cadastro
                        </button>
                    </div>`,
                    null,
                    defaultColumns,
                    function(settings)
                    {
                        CarregarFoto('.foto');
                    },
                    false,
                    DetailAluno
                );               
        });
}

function ResetDefaultAluno(onLoadCallback){
    hideLoadingModal();
    
    $modalAluno = createDynamicModal("",null,false);

    carregarTemplateModal('#'+$modalAluno.attr('id'),
        'templates/Aluno.html #frmAluno', {
        modalTitle: 'Cadastrar Aluno',       
        modalSize: 'modal-dialog-scrollable modal-xl',
        onLoad: function(response, status, xhr)
        {            
            $('#btnCancelar'+$modalAluno.attr('id')).click(CancelarAlunoClick);
            $('#btnExcluir'+$modalAluno.attr('id')).click(ExcluirAlunoClick);    
            $('#btnSalvar'+$modalAluno.attr('id')).click(SalvarAlunoClick);            

            preencherFormularioCompleto(dataAluno, '#frmAluno');

            CarregarFotoAluno();
            
            carregaSelect('lista/saidadoaluno','#selectSaida','id',false,(dataAluno.saidaDoAlunoId === undefined) ? null:dataAluno.saidaDoAlunoId);
            carregaSelect('lista/sexo','#selectSexo','codigo',false,(dataAluno.pessoa.sexo === undefined) ? null:dataAluno.pessoa.sexo);

            $('#AlunoDtNasc').val(DateToStr(dataAluno.pessoa.dtNasc)).trigger('input').trigger('change');
            $('#AlunoCpf').val(VarToStr(dataAluno.pessoa.cpfCnpj)).trigger('input').trigger('change');

            $('#uploadFotoAluno').off('click').on('click', uploadFotoAluno);
            $('#apagarFotoAluno').off('click').on('click', apagarFotoAluno);
            $('#fileUploadAluno').off('change').on('change', fileUploadAluno);

            $('#btnAlunoCep').off('click').on('click', ConsultaCepAluno);

            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }          
        }
    });      
}

function NovoAlunoClick(e){
    event.preventDefault();
    dataAluno = {id: 0, pessoa: {id: 0}};
    RestRequest('POST',
        $baseApiUrl+"usuariomodulo",
        {modulo : $thisAluno.attr('data-modulo')+"1"},
        null,
        function (data) {
            ResetDefaultAluno(
            function(response, status, xhr){
                if (!$modalAluno.hasClass('show') && !$modalAluno.is(':visible')) 
                {
                    $modalAluno.modal('show');                
                    toggleModalBody('#'+$modalAluno.attr('id'), false);
                    setTimeout(() => {
                        $('#AlunoNome').focus();
                    }, 500);            
                }          
            });
        });    
}

function CancelarAlunoClick(e){
    e.preventDefault();
    dataAluno = undefined;
    $modalAluno.modal('hide');
}

function EditarAlunoClick(e){
    event.preventDefault();
    
    GetAluno(e.closest('tr').id,
    function (data) {
            dataAluno = data;
            ResetDefaultAluno(function(response, status, xhr){
                if (!$modalAluno.hasClass('show') && !$modalAluno.is(':visible')) 
                {
                    $modalAluno.modal('show');                
                    toggleModalBody('#'+$modalAluno.attr('id'), false);
                    setTimeout(() => {
                        $('#AlunoNome').focus();
                    }, 500);            
                }
            });
    });
}

function ExcluirAlunoClick(e){
    e.preventDefault();
    if ((dataAluno !== undefined) && (dataAluno !== null)){
        if (dataAluno.id !== 0){
            zPergunta_Exclui(function(e){
                e.preventDefault();
                RestRequest('DELETE',
                    $baseApiUrl+"Aluno/"+dataAluno.id,
                    null,
                    null,
                    function (data) {
                        hideLoadingModal();
                        setTimeout(() => {
                            CancelarAlunoClick(e);
                            $cadastroAluno.tabela.ajax.reload();
                        }, 500);                     
                    });  
            });        
        }
    }
}

function SalvarAlunoClick(e){
    e.preventDefault();

    if ((dataAluno !== undefined) && (dataAluno !== null))
    {
        dataAluno.saidaDoAlunoId = StrToInt($('#AlunoSaida').val());
        dataAluno.pessoa.descricao = StrToValue($('#AlunoNome').val());
        dataAluno.pessoa.dtNasc = StrToDate($('#AlunoDtNasc').val());
        dataAluno.pessoa.sexo = StrToValue($('#AlunoSexo').val());
        dataAluno.pessoa.rg = StrToValue($('#AlunoRg').val());
        dataAluno.pessoa.cpfCnpj = StrToValue(extrairNumeros($('#AlunoCpf').val()));

        RestRequest((dataAluno.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Aluno"+(dataAluno.id === 0 ? '' : `/${dataAluno.id}`),
            dataAluno,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataAluno.id = response.id;
                }               

                GetAluno(dataAluno.id,
                        function (response, textStatus, jqXHR) {
                            hideLoadingModal();
                            $('#rm').val(response.rm);
                            $('#AlunoSenhaNet').val(response.pessoa.senhaNet);
                            $cadastroAluno.tabela.ajax.reload();             
                        });                 
            });  
    }    
}

function uploadFotoAluno(e) {
    e.preventDefault();
    $('#fileUploadAluno').trigger('click');
}

function apagarFotoAluno() {
    dataAluno.pessoa.foto = null;
    $('#FotoAluno').attr('src', '#');
}

function CarregarFotoAluno()
{
    if ((dataAluno.pessoa.foto !== null) && (dataAluno.pessoa.foto !== undefined)){
        RestRequest(
            'GET',
            $baseApiUrl+'Imagem?codigo=' + dataAluno.pessoa.foto,
            null,
            function (xhr) {
                $('#FotoAluno').html('<i class="fa fa-spin fa-spinner fa-3x"></i>');
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            function (response, textStatus, jqXHR) {
                $('#FotoAluno').html(`<img class="card-img-top rounded-circle" src="${response}" alt="[FOTO]" style="max-height: 140px; width: 140px;" />`);      
            });    
    }
}

function fileUploadAluno(e) {
    if ((dataAluno.pessoa.foto === undefined) || (dataAluno.pessoa.foto === null)){
        EnviarImagem($(this), 
        function (repo) {
            console.log(repo);
            dataAluno.pessoa.foto = repo;
            //CarregarFotoAluno();
        });
    }
}

function AlunoNovoSaidaClick(e){
    event.preventDefault();
    dataSaidaDoAluno = {id: 0, descricao: null};
    SaidaDoAlunoClick(function(response, textStatus, jqXHR){
        carregaSelect('lista/saidadoaluno','#selectSaida','id',false,response.id);
    },
    function(response, textStatus, jqXHR){
        carregaSelect('lista/saidadoaluno','#selectSaida','id',false,dataAluno.saidaDoAlunoId);
    });
}

function GetAluno(id,onSuccessCallback){
    RestRequest('GET',
        $baseApiUrl+"Aluno/"+id,
        null,
        null,
        function(response, status, xhr){
            if (typeof onSuccessCallback === 'function') {
                onSuccessCallback(response, status, xhr);
            }            
        });    
}

function ConsultaCepAluno(){
    buscaCep($('#cep'),
        function(data){
            hideLoadingModal();
            dataAluno.pessoa.bairroId = data.bairro.id;
            dataAluno.pessoa.bairro = data.bairro;
            $('#AlunoEndereco').val(data.endereco);
            $('#AlunoBairro').val(data.bairro.descricao);
            $('#AlunoComplemento').val(data.complemento);
            $('#AlunoMunicipio').val(data.bairro.municipio.descricao);
            $('#AlunoUf').val(data.bairro.municipio.uf);
            $('#AlunoNumero').focus();
        });
}