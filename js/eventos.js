function messageDropdown(){
	$('#messageDropdown').html('<i class="fa fa-spin fa-spinner"></i>');
	setTimeout(function(){
		$('#messageDropdown').html('<i class="fa fa-envelope"></i>');
		$('#messageDropdown').parent().append(`<ul class="dropdown-menu messages-notif-box animated fadeIn" aria-labelledby="messageDropdown">
									<li>
										<div class="dropdown-title d-flex justify-content-between align-items-center">
											Messages 									
											<a href="#" class="small">Mark all as read</a>
										</div>
									</li>
									<li>
										<div class="message-notif-scroll scrollbar-outer">
											<div class="notif-center">
												<a href="#">
													<div class="notif-img"> 
														<img src="assets/img/jm_denis.jpg" alt="Img Profile">
													</div>
													<div class="notif-content">
														<span class="subject">Jimmy Denis</span>
														<span class="block">
															How are you ?
														</span>
														<span class="time">5 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-img"> 
														<img src="assets/img/chadengle.jpg" alt="Img Profile">
													</div>
													<div class="notif-content">
														<span class="subject">Chad</span>
														<span class="block">
															Ok, Thanks !
														</span>
														<span class="time">12 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-img"> 
														<img src="assets/img/mlane.jpg" alt="Img Profile">
													</div>
													<div class="notif-content">
														<span class="subject">Jhon Doe</span>
														<span class="block">
															Ready for the meeting today...
														</span>
														<span class="time">12 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-img"> 
														<img src="assets/img/talha.jpg" alt="Img Profile">
													</div>
													<div class="notif-content">
														<span class="subject">Talha</span>
														<span class="block">
															Hi, Apa Kabar ?
														</span>
														<span class="time">17 minutes ago</span> 
													</div>
												</a>
											</div>
										</div>
									</li>
									<li>
										<a class="see-all" href="javascript:void(0);">See all messages<i class="fa fa-angle-right"></i> </a>
									</li>
								</ul>`);
	},3000);
}

function notifDropdown(){
		$('#notifDropdown').html('<i class="fa fa-spin fa-spinner"></i>');
	setTimeout(function(){
		$('#notifDropdown').html(`<i class="fa fa-bell"></i>
									<span class="notification">4</span>`);
									
		$('#notifDropdown').parent().append(`<ul class="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown">
									<li>
										<div class="dropdown-title">You have 4 new notification</div>
									</li>
									<li>
										<div class="notif-scroll scrollbar-outer">
											<div class="notif-center">
												<a href="#">
													<div class="notif-icon notif-primary"> <i class="fa fa-user-plus"></i> </div>
													<div class="notif-content">
														<span class="block">
															New user registered
														</span>
														<span class="time">5 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-icon notif-success"> <i class="fa fa-comment"></i> </div>
													<div class="notif-content">
														<span class="block">
															Rahmad commented on Admin
														</span>
														<span class="time">12 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-img"> 
														<img src="assets/img/profile2.jpg" alt="Img Profile">
													</div>
													<div class="notif-content">
														<span class="block">
															Reza send messages to you
														</span>
														<span class="time">12 minutes ago</span> 
													</div>
												</a>
												<a href="#">
													<div class="notif-icon notif-danger"> <i class="fa fa-heart"></i> </div>
													<div class="notif-content">
														<span class="block">
															Farrah liked Admin
														</span>
														<span class="time">17 minutes ago</span> 
													</div>
												</a>
											</div>
										</div>
									</li>
									<li>
										<a class="see-all" href="javascript:void(0);">See all notifications<i class="fa fa-angle-right"></i> </a>
									</li>
								</ul>`);
	},3000);
}

function shortCut(){
		$('#shortCut').html('<i class="fa fa-spin fa-spinner"></i>');
	setTimeout(function(){
		$('#shortCut').html(`<i class="fas fa-layer-group"></i>`);
									
		$('#shortCut').parent().append(`<div class="dropdown-menu quick-actions animated fadeIn">
									<div class="quick-actions-header">
										<span class="title mb-1">Ações rápidas</span>
										<span class="subtitle op-7">Atalhos</span>
									</div>
									<div class="quick-actions-scroll scrollbar-outer">
										<div class="quick-actions-items">
											<div class="row m-0">
												<a class="col-6 col-md-4 p-0" href="#" onclick="alunoClick(this);">
													<div class="quick-actions-item">
														<div class="avatar-item bg-success rounded-circle">
															<i class="fa-solid fa-user-graduate"></i>
														</div>
														<span class="text">Aluno</span>
													</div>
												</a>
												<!--<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-warning rounded-circle">
															<i class="fas fa-map"></i>
														</div>
														<span class="text">Maps</span>
													</div>
												</a>
												<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-info rounded-circle">
															<i class="fas fa-file-excel"></i>
														</div>
														<span class="text">Reports</span>
													</div>
												</a>
												<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-success rounded-circle">
															<i class="fas fa-envelope"></i>
														</div>
														<span class="text">Emails</span>
													</div>
												</a>
												<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-primary rounded-circle">
															<i class="fas fa-file-invoice-dollar"></i>
														</div>
														<span class="text">Invoice</span>
													</div>
												</a>
												<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-secondary rounded-circle">
															<i class="fas fa-credit-card"></i>
														</div>
														<span class="text">Payments</span>
													</div>
												</a>-->
											</div>
										</div>
									</div>
								</div>`);
	},3000);
}

function LogOutClick(e){
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
}

function profile_pic()
{
   $.ajax({
        url: `${$baseApiUrl}Perfil`,
        method: 'GET',
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			$('#profile-pic').html('<i class="fa fa-spin fa-spinner"></i>');
        },
        success: function(data) {
			$('#profile-pic').html(`<div class="avatar-sm" id="avatar-container">
										<img src="${$imageUrl+data.photo}" alt="" class="avatar-img rounded-circle">
									</div>
									<span class="profile-username">
										<span class="op-7">Olá,</span> <span class="fw-bold">${data.firstname}</span>
									</span>`);
									
		$('#profile-pic').parent().append(`<ul class="dropdown-menu dropdown-user animated fadeIn">
									<div class="dropdown-user-scroll scrollbar-outer">
										<li>
											<div class="user-box">
												<div class="avatar-lg"><img src="${$imageUrl+data.photo}" alt="image profile" class="avatar-img rounded"></div>
												<div class="u-text">
													<h4>${data.firstname}</h4>
													<p class="text-muted">${data.email}</p><a href="#" class="btn btn-xs btn-secondary btn-sm" onclick="MeuPerfilClick(this);">Ver Perfil</a>
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
								</ul>`);									
									
            $('#Logout').off('click').on('click', LogOutClick);					
        },
        error: function(jqXHR, textStatus, errorThrown){
            if (jqXHR.status === 401) {
                redirectToLogin();
            }
        }
    });	
}

// Restante do código para carregar o menu
function carregarMenu() {
	$.ajax({
		url: `${$baseApiUrl}Menu`,
		method: 'GET',
		dataType: 'json',
		beforeSend: function (xhr) {
			$('#sidebar').html(`<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i></div>`);
		},
		success: function(data) {
			$('#sidebar').html(`<ul class="nav nav-secondary" id="dynamic-menu"></ul>
								<div class="sidebar-content"></div>`);
			
			construirMenu(data);

			$.notify({
				icon: 'icon-bell',
				title: 'SEIWEB',
				message: 'Sistema inicializado com sucesso.',
			},{
				type: 'secondary',
				placement: {
					from: "bottom",
					align: "right"
				},
				time: 1000,
			});						
		},
		error: function(xhr, status, error) {
			console.error('Erro ao carregar o menu:', error);
			$('#dynamic-menu').html('<li class="nav-item"><a href="#"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar menu</p></a></li>');
		}
	});
}

// Restante das funções do menu
function construirMenu(menus) {
	var menuHTML = `<li class="nav-section">
					<span class="sidebar-mini-icon">
						<i class="fa fa-ellipsis-h"></i>
					</span>
					<h4 class="text-section">MENU</h4>
				</li>`;
	
	menus.forEach(function(menu) {
		var menuId = 'menu-' + menu.id;
		
		menuHTML += `
		<li class="nav-item modulo">
			<a data-bs-toggle="collapse" href="#${menuId}" class="collapsed" aria-expanded="false">
				<i class="${menu.icone}"></i>
				<p class="">${menu.titulo}</p>
				<span class="caret"></span>
			</a>
			<div class="collapse" id="${menuId}">
				<ul class="nav nav-collapse pb-0 pt-0">`;
		
		if (menu.modulos && menu.modulos.length > 0) {
			menu.modulos.forEach(function(modulo) {
				menuHTML += `
					<li class="">
						<a href="#" id="${gerarHash(16)}" onclick="${modulo.elemento_id}Click(this);">
							<span class="sub-item"> ${modulo.titulo} </span>
						</a>
					</li>`;
			});
		}
		
		menuHTML += `
				</ul>
			</div>
		</li>`;
	});
	
	$('#dynamic-menu').html(menuHTML);
}