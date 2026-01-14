var modalMeuPerfil = null;
var dataMeuPerfil = null;

function MeuPerfilClick(e){
    event.preventDefault();

    var $this = $(e);

    dataMeuPerfil = {};

    RestRequest({
		method: 'GET',
        url: $baseApiUrl+"perfil",
        beforeSend: function(xhr){
            showLoadingModal();       
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
        },
        success: function(response, status, xhr){
            hideLoadingModal();

            modalMeuPerfil = createDynamicModal();
            modalMeuPerfil.find('.modal-title').html(`<i class="fa fa-user-circle"></i> ${$this.text()}`);
			modalMeuPerfil.find('.modal-footer')
				.html(`<button id="${gerarHash()}" class="btn btn-success"><i class="icon-note"></i> Salvar</button>`)
                .click(function(){
                    $('#frmMeuPerfil').submit();
                });

            modalMeuPerfil.find('.modal-body').load('templates/MeuPerfil.html #frmMeuPerfil', function(r, s, x) {
                $('.celular').mask('(00) 00000-0000');

                dataMeuPerfil.photo = response.photo;
                $('#FotoMeuPerfil').attr('src',$imageUrl+dataMeuPerfil.photo);                

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
        }
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
        //timeout: 30000,
        success: function() {
            hideLoadingModal();

            modalMeuPerfil.modal('hide');

            Swal.fire({
                title: `${dataMeuPerfil.firstname}`,
                text: "Seu perfil foi atualizado com sucesso!",
                icon: "success"
            });                    
			
			setTimeout(function(){
				profile_pic();
			},500);
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
        $('#FotoMeuPerfil').attr('src',$imageUrl+dataMeuPerfil.photo);
    });
}