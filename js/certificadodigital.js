var modalCeritificadoDigital = null;
var dataCertificadDigital = null;

function CertificadoDigitalClick(e){
    event.preventDefault();
    var $this = $(e);

    modalCeritificadoDigital = createDynamicModal();
    modalCeritificadoDigital.find('.modal-title').html('<i class="fa-solid fa-certificate"></i> Certificado Digital');
    modalCeritificadoDigital.find('.modal-header-search').remove();
    modalCeritificadoDigital.find('.modal-dialog').addClass('modal-dialog-centered');
    modalCeritificadoDigital.find('.me-auto').removeClass();
    modalCeritificadoDigital.find('.btn-cancelar').remove();
    modalCeritificadoDigital.find('.btn-excluir').remove();
    modalCeritificadoDigital.find('.btn-salvar')
        .click(function(){
            $('#frmCertificadoDigital').submit();
        });

    modalCeritificadoDigital.find('.modal-body').load('templates/CertificadoDigital.html #frmCertificadoDigital', function(response, status, xhr) {
        const $togglePassword = $('#togglePassword');
        const $passwordInput = $('#SenhaCert');
        const $eyeIcon = $togglePassword.find('i');
        
        $togglePassword.on('click', function() {
            // Alterna entre tipo password e text
            const type = $passwordInput.attr('type') === 'password' ? 'text' : 'password';
            $passwordInput.attr('type', type);
            
            // Alterna o ícone do olho
            if (type === 'text') {
                $eyeIcon.removeClass('fa-eye').addClass('fa-eye-slash');
            } else {
                $eyeIcon.removeClass('fa-eye-slash').addClass('fa-eye');
            }
        });

        $('#SenhaCert').val('');
        $('#frmCertificadoDigital').on('submit',CertificadoDigitalSubmit);

        modalCeritificadoDigital.modal('show');
    });
}


function CertificadoDigitalSubmit(e)
{
    e.preventDefault();
    
    showLoadingModal();       

    var $this = $('#FileCert');
    var fdata = new FormData();
    var fileInput = $this[0];
    var file = fileInput.files[0];

    if (file === undefined){
        return false;
    }

    fdata.append("file", file);

    var reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = function () {
        $.ajax({
            type: 'POST',
            url: $baseApiUrl+'CertificadoDigital?Senha='+$('#SenhaCert').val(),
            data: fdata,
            cache: false,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": localStorage.getItem('token')
            },
            success: function(response, textStatus, jqXHR) {
                hideLoadingModal();
                
                dataEmpresa.certificadoDigitalId = response.id;

                carregaSelect2('CertificadoDigital',modalEmpresa,'#selectCertificado','id',function(response, textStatus, jqXHR){
                    $('#CertificadoDigital')
                        .val(dataEmpresa.certificadoDigitalId)
                        .trigger('change');  
                });    

                modalCeritificadoDigital.modal('hide');

                $.notify({
                    icon: 'icon-bell',
                    title: 'SEIWEB',
                    message: 'Certificado enviado com sucesso.',
                },{
                    type: 'success',
                    placement: {
                        from: "top",
                        align: "center"
                    },
                    time: 1000,
                });	
            },
            error: exibeerror
        });
    };

    reader.onerror = function () {
        console.log('there are some problems');
    };   
}