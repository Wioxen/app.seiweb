var modalMeuPerfil = null;
var dataMeuPerfil = null;

function MeuPerfilClick(e){
    event.preventDefault();

    var $this = $(e);

    dataMeuPerfil = {};

    RestRequest('GET',
        $baseApiUrl+"perfil",
        null,
        function(xhr){
            showLoadingModal();       
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        function(response, status, xhr){
            hideLoadingModal();

            modalMeuPerfil = createDynamicModal();
            modalMeuPerfil.find('.modal-title').html(`<i class="fa fa-user-circle"></i> ${$this.text()}`);
            modalMeuPerfil.find('.modal-header-search').remove();
            modalMeuPerfil.find('.me-auto').removeClass();
            modalMeuPerfil.find('.btn-cancelar').remove();
            modalMeuPerfil.find('.btn-excluir').remove();
            modalMeuPerfil.find('.btn-salvar')
                .click(function(){
                    $('#frmMeuPerfil').submit();
                });

            modalMeuPerfil.find('.modal-body').load('templates/MeuPerfil.html #frmMeuPerfil', function(r, s, x) {
                $('.celular').mask('(00) 00000-0000');

                dataMeuPerfil.photo = response.photo;
                CarregarFoto($('#FotoMeuPerfil'), dataMeuPerfil.photo);                

                $('#MeuPerfilFirstName').val(response.firstname);
                $('#MeuPerfilLastName').val(response.lastname);
                $('#MeuPerfilEmail').val(response.email);
                $('#MeuPerfilPhone').val(response.phone).trigger('input').trigger('change');
                $('#MeuPerfilPhoneWhats').prop('checked',(response.phoneWhats === 1));
                
                $('#uploadFotoMeuPerfil').off('click').on('click', uploadFotoMeuPerfil);
                $('#apagarFotoMeuPerfil').off('click').on('click', apagarFotoMeuPerfil);
                $('#fileUploadMeuPerfil').off('change').on('change', fileUploadMeuPerfil);
                $('#frmMeuPerfil').on('submit', submitPerfil);

                modalMeuPerfil.modal('show');

                setTimeout(() => {
                    $('#MeuPerfilFirstName').focus();
                }, 500);
            });            
        });   
}

function submitPerfil(e) {
    e.preventDefault();

    dataMeuPerfil.firstname = StrToValue($('#MeuPerfilFirstName').val());
    dataMeuPerfil.lastname = StrToValue($('#MeuPerfilLastName').val());
    dataMeuPerfil.phone = StrToValue($('#MeuPerfilPhone').val());
    dataMeuPerfil.phonewhats = checkboxValue($('#MeuPerfilPhoneWhats'),1,0);

    // Simula uma requisição AJAX (substitua pela sua chamada real)
    $.ajax({
        url: $baseApiUrl+'Perfil',
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
            if (!$('#loadingModal').hasClass('show') && !$('#loadingModal').is(':visible')) {
                showLoadingModal();       
            }
        },					
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dataMeuPerfil),
        timeout: 30000,
        success: function() {
            hideLoadingModal();

            modalMeuPerfil.modal('hide');

            swal({
                title: `Olá, ${dataMeuPerfil.firstname}`,
                text: "Seu perfil foi atualizado com sucesso!",
                icon: "success"
            });                    

            initializeProfileSpinners();
        },
        error: exibeerror
    });
}


function uploadFotoMeuPerfil(e) {
    e.preventDefault();
    $('#fileUploadMeuPerfil').trigger('click');
}

function apagarFotoMeuPerfil() {
    dataMeuPerfil.photo = null;
    $('#fileUploadMeuPerfil').val('');
    $('#FotoMeuPerfil').find('img').attr('src', '#');
}

function fileUploadMeuPerfil(e) {
    EnviarImagem($(this), 
    function (repo) {
        dataMeuPerfil.photo = repo;
        CarregarFoto($('#FotoMeuPerfil'), repo);
    });
}

// Função para mostrar spinners e depois o conteúdo real após 3 segundos
function initializeProfileSpinners() {
    // Container para a imagem do avatar
    const avatarContainer = document.getElementById('avatar-container');
    // Container para o nome de usuário
    const usernameContainer = document.getElementById('username-container');
    const dropdownuser = document.getElementById('dropdown_user');
    
    
    // Salvar o conteúdo original
    const originalAvatar = `
        <img src="#" alt="..." class="avatar-img rounded-circle">
    `;
    const originalUsername = `
        <span class="op-7">Olá,</span> <span id="first-name" class="fw-bold first-name">Igor</span>
    `;
    
    const originalDropdownuser = `
        <div class="dropdown-user-scroll scrollbar-outer">
            <li>
                <div class="user-box">
                    <div class="avatar-lg"><img src="#" alt="image profile" class="avatar-img rounded"></div>
                    <div class="u-text">
                        <h4 class="first-name">Igor</h4>
                        <p class="text-muted"></p><a href="#" class="btn btn-xs btn-secondary btn-sm" onclick="MeuPerfilClick(this);">Meu Perfil</a>
                    </div>
                </div>
            </li>
            <li>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="AlterarSenhaClick(this);">Alterar Senha</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="ConfiguracaoClick(this);">Configuração</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onclick="LogDeAtividadeClick(this);">Log de atividades</a>
                <div class="dropdown-divider"></div>
                <a id="Logout" class="dropdown-item" href="#">Logout</a>
            </li>
        </div>
    `;				
    
    // Restaurar conteúdo original após 3 segundos
    $.ajax({
        url: `${$baseApiUrl}Perfil`,
        method: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));

            // Adicionar spinners
            avatarContainer.innerHTML = `
                <div class="spinner-container">
                    <div class="avatar-spinner"></div>
                </div>
            `;
            usernameContainer.innerHTML = `
                <div class="username-spinner"></div>
            `;						
        },
        success: function(data) {
            avatarContainer.innerHTML = originalAvatar;
            usernameContainer.innerHTML = originalUsername;
            dropdownuser.innerHTML = originalDropdownuser;

            $('.first-name').text(data.firstname);
            $('.u-text').find('p').text(data.email);
            $('.avatar-img').attr('src',data.photoBase64);
            
            $('#Logout').off('click').on('click', (e) => {
                e.preventDefault();
                swal({
                    title: 'Atenção?',
                    text: `${$('#first-name').text()}, deseja realmente sair do sistema?`,
                    type: 'warning',
                    buttons:{
                        confirm: {
                            text : 'Sim, desejo sair',
                            className : 'btn btn-success'
                        },
                        cancel: {
                            text:  'Não, desejo permanecer',
                            visible: true,
                            className: 'btn btn-danger'
                        }
                    }
                }).then((Yes) => {
                    if (Yes) {
                        RestRequest('POST',
                            $baseApiUrl+"Logout",
                            null,
                            null,
                            function (response, textStatus, jqXHR) {
                                hideLoadingModal();
                                swal.close();
                                redirectToLogin();
                            });                          
                    } else {
                        swal.close();
                    }								
                });							
            });					
        },
        error: function(jqXHR, textStatus, errorThrown){
            if (jqXHR.status === 401) {
                redirectToLogin();
            }
        }
    });
}