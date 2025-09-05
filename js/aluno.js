var dataAluno = undefined;
var $thisAluno = undefined;
var $modalAluno = undefined;
var $cadastroAluno = undefined;

function alunoClick(e) {
    $thisAluno = $(e);

    RestRequest('POST',
        $baseApiUrl+"usuariomodulo",
        {modulo : $thisAluno.attr('data-modulo')+"4"},
        null,
        function (data) {
            hideLoadingModal();

            const defaultColumns = [
                {
                    data: 'foto',
                    orderable: false,
                    "width": "10%",
                    "render": function(data, type, row) {
                        //return `<img id="img-aluno-${row}" data-foto=${data} class="foto avatar-img rounded-circle" src="#" style="width: 40px; height: 40px;" />`
                        return `<span id="img-aluno-${row}" data-foto="${data}" class="foto"><i class="fa fa-spin fa-spinner fa-2x"></i></span>`
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
                    "width": "10%",
                    "render": function(data, type, row) {
                        return `<div class="dropdown">
                                <button class="btn btn-sm btn-secondary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-list"></i>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
                                <li><a class="dropdown-item btn-editar-aluno" data-id="${data}" href="#">Editar</a></li>					
                                </ul>
                                </div>`
                    }
                }
            ];

            $cadastroAluno = 
                CarregaDataTable
                (
                    'Aluno',
                    'Cadastrar Aluno',
                    'modal-lg',
                    `<table id="AlunoTb" class="row-border stripe hover" style="width:100%"></table>`,
                    `<div class="footer-buttons">
                        <button id="btnNovoAluno" type="button" class="btn btn-success">
                            <i class="fa fa-plus-circle me-2"></i>Novo Cadastro
                        </button>
                    </div>`,
                    function (){
                        $('#btnNovoAluno').click(NovoAlunoClick);                        
                    },
                    defaultColumns,
                    function(settings)
                    {
                        $('.btn-editar-aluno').off('click').on('click', EditarAlunoClick);

                        $('.foto').each(function(){
                            var $this = $(this);
                            RestRequest(
                                'GET',
                                $baseApiUrl+'Imagem?codigo=' + $this.data('foto'),
                                null,
                                function (xhr) {
                                    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                                },
                                function (response, textStatus, jqXHR) {
                                    $this.html(`<img class="avatar-img rounded-circle" src="${response}" style="width: 39px; height: 39px;" />`);      
                                }); 
                        })
                    }
                );               
        });
}

function CriarModalAluno(onLoadCallback){
    hideLoadingModal();
    
    $modalAluno = createDynamicModal
    (
        `<div class="dropdown">
        <button class="btn btn-secondary" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa fa-list"></i> Mais opções
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">	
        <li><a class="dropdown-item" href="#" onclick="AlunoBairroClick(this);">BAIRRO</a></li>					
        </ul>
        </div>`
    );

    $('#Pesquisar'+$modalAluno.attr('id')).remove();

    $modalAluno.on('hidden.bs.modal', function () {
        $cadastroAluno.tabela.ajax.reload();
    });

    $('#btnCancelar'+$modalAluno.attr('id')).click(CancelarAlunoClick);
    $('#btnExcluir'+$modalAluno.attr('id')).click(ExcluirAlunoClick);    
    $('#btnSalvar'+$modalAluno.attr('id')).click(SalvarAlunoClick);            

    LoadAluno(function(response, status, xhr){
        if (typeof onLoadCallback === 'function') {
            onLoadCallback(response, status, xhr);
        }
    });            
}

function NovoAlunoClick(e){
    e.preventDefault();
    dataAluno = {id: 0, pessoa: {id: 0}};
    RestRequest('POST',
        $baseApiUrl+"usuariomodulo",
        {modulo : $thisAluno.attr('data-modulo')+"1"},
        null,
        function (data) {
            CriarModalAluno(
            function(response, status, xhr){
                toggleModalBody('#'+$modalAluno.attr('id'), false);
                setTimeout(() => {
                    $('#cnpj').focus();
                }, 500);            
            });
        });    
}

function CancelarAlunoClick(e){
    e.preventDefault();
    dataAluno = undefined;
    $modalAluno.modal('hide');
}

function EditarAlunoClick(e){
    e.preventDefault();
    var $thisButton = $(this);
    RestRequest('GET',
        $baseApiUrl+"Aluno/"+$thisButton.data('id'),
        null,
        null,
        function (data) {
            dataAluno = data;
            CriarModalAluno(function(response, status, xhr){
                toggleModalBody('#'+$modalAluno.attr('id'), false);
                setTimeout(() => {
                    CarregarFotoAluno();
                    preencherFormularioCompleto(dataAluno, '#frmAluno');
                    $('#descricao').focus();
                }, 500);            
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
        dataAluno.pessoa.descricao = $('#AlunoDescricao').val().trim() ? $('#AlunoDescricao').val().toUpperCase() : null;

        RestRequest((dataAluno.id === 0 ? 'POST' : 'PUT'),
            $baseApiUrl+"Aluno"+(dataAluno.id === 0 ? '' : `/${dataAluno.id}`),
            dataAluno,
            null,
            function (response, textStatus, jqXHR) {
                if (jqXHR.status === 201){
                    dataAluno.id = response.id;
                }                
                hideLoadingModal();
                $modalAluno.modal('hide');
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
                xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            },
            function (response, textStatus, jqXHR) {
                console.log(jqXHR);     
                $('#FotoAluno').attr('src', response);      
            });    
    }
}

function fileUploadAluno(e) {
    if ((dataAluno.pessoa.foto === undefined) || (dataAluno.pessoa.foto === null)){
        EnviarImagem($(this), 
        function (repo) {
            console.log(repo);
            dataAluno.pessoa.foto = repo;
            CarregarFotoAluno();
        });
    }
}

function LoadAluno(onLoadCallback)
{
    carregarTemplateModal('#'+$modalAluno.attr('id'),
        'templates/Aluno.html #frmAluno', {
        modalTitle: 'Cadastrar Aluno',       
        modalSize: 'modal-dialog-scrollable modal-xl',
        onLoad: function(response, status, xhr)
        {            
            $('#uploadFotoAluno').off('click').on('click', uploadFotoAluno);
            $('#apagarFotoAluno').off('click').on('click', apagarFotoAluno);
            $('#fileUploadAluno').off('change').on('change', fileUploadAluno);

            if (typeof onLoadCallback === 'function') {
                onLoadCallback(response, status, xhr);
            }
        }
    });            
}
