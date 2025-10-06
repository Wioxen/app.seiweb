var modalAlterarSenha = null;

function AlterarSenhaClick(e){
    event.preventDefault();

    var $this = $(e);

    modalAlterarSenha = createDynamicModal();
    modalAlterarSenha.find('.modal-title').html('<i class="fa fa-key"></i> Alterar Senha');
    modalAlterarSenha.find('.modal-header-search').remove();
    modalAlterarSenha.find('.me-auto').removeClass();
    modalAlterarSenha.find('.btn-cancelar').remove();
    modalAlterarSenha.find('.btn-excluir').remove();
    modalAlterarSenha.find('.btn-salvar')
        .attr('disabled',true)
        .click(function(){
            $('#frmAlterarSenha').submit();
        });

    modalAlterarSenha.find('.modal-body').load('templates/AlterarSenha.html #frmAlterarSenha', function(response, status, xhr) {
        // Validação da senha
        $('#password').on('input', function() {
            const password = $(this).val();

            let strength = 0;
            const requirements = {
                length: password.length >= 6,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            };
            
            // Atualiza os requisitos visuais
            Object.keys(requirements).forEach(key => {
                const element = $(`#${key}Req`);
                element.toggleClass('valid', requirements[key]);
                element.toggleClass('invalid', !requirements[key]);
                if (requirements[key]) strength += 20;
            });
            
            // Pontuação adicional
            if (password.length >= 10) strength += 10;
            if (password.length >= 12) strength += 10;
            if ((password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2) strength += 10;
            if ((password.match(/[0-9]/g) || []).length >= 2) strength += 10;
            
            strength = Math.min(strength, 100);
            
            // Atualiza a barra de progresso
            const strengthBar = $('#passwordStrength');
            strengthBar.css('width', strength + '%');
            
            // Atualiza a cor e texto
            let strengthClass, strengthText;
            if (password.length === 0) {
                strengthText = '';
            } else if (strength < 30) {
                strengthClass = 'bg-danger';
                strengthText = "<span class='very-weak'>Muito fraca</span> - Fácil de adivinhar";
            } else if (strength < 50) {
                strengthClass = 'bg-warning';
                strengthText = "<span class='weak'>Fraca</span> - Pode ser melhorada";
            } else if (strength < 75) {
                strengthClass = 'bg-info';
                strengthText = "<span class='medium'>Média</span> - Aceitável, mas pode ser mais forte";
            } else if (strength < 90) {
                strengthClass = 'bg-primary';
                strengthText = "<span class='strong'>Forte</span> - Boa segurança";
            } else {
                strengthClass = 'bg-success';
                strengthText = "<span class='very-strong'>Muito forte</span> - Excelente segurança";
            }
            
            strengthBar.removeClass().addClass('progress-bar ' + strengthClass);
            $('#strengthText').html(strengthText);
            
            // Valida a confirmação de senha
            validateConfirmPassword();
        });
        
        // Validação da confirmação de senha
        $('#confirmPassword').on('input', validateConfirmPassword);

        // Submissão do formulário
        $('#frmAlterarSenha').on('submit', function(e) {
            e.preventDefault();
            
            $('#errorContainer').addClass('d-none').html('');
            
            if (modalAlterarSenha.find('.btn-salvar').prop('disabled')) {
                showError('Por favor, preencha todos os requisitos de senha e confirme corretamente.');
                return;
            }
            
            // Dados para enviar
            const payload = {
                CurrentPassword: $('#SenhaAtual').val(),
                Password: $('#password').val(),
                ConfirmPassword: $('#confirmPassword').val()
            };            

            // Simula uma requisição AJAX (substitua pela sua chamada real)
            $.ajax({
                url: $baseApiUrl+'AlterarSenha',
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
                    if (!$('#loadingModal').hasClass('show') && !$('#loadingModal').is(':visible')) {
                        showLoadingModal();       
                    }
                },					
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                timeout: 30000,
                success: function(response) {
                    hideLoadingModal();
                    modalAlterarSenha.modal('hide');
                },
                error: exibeerror
            });
        });

        modalAlterarSenha.modal('show');

        setTimeout(() => {
            $('#SenhaAtual').focus();
        }, 500);
    });
}

function validateConfirmPassword() {
    const password = $('#password').val();
    const confirmPassword = $('#confirmPassword').val();
    const confirmError = $('#confirmError');
    
    if (confirmPassword === '') {
        confirmError.text('');
        modalAlterarSenha.find('.btn-salvar').prop('disabled', true);
    } else if (password !== confirmPassword) {
        confirmError.text('As senhas não coincidem!');
        modalAlterarSenha.find('.btn-salvar').prop('disabled', true);
    } else {
        confirmError.text('');
        // Verifica se todos os requisitos foram atendidos
        const allValid = $('.requirement.valid').length === 5;
        modalAlterarSenha.find('.btn-salvar').prop('disabled', !allValid);
    }
}