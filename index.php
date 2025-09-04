<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Kaiadmin - Bootstrap 5 Admin Dashboard</title>
	<meta content='width=device-width, initial-scale=1.0, shrink-to-fit=no' name='viewport' />
	<link rel="icon" href="assets/img/kaiadmin/favicon.ico" type="image/x-icon"/>

	<!-- Fonts and icons -->
	<script src="assets/js/plugin/webfont/webfont.min.js"></script>
	<script>
		WebFont.load({
			google: {"families":["Public Sans:300,400,500,600,700"]},
			custom: {"families":["Font Awesome 5 Solid", "Font Awesome 5 Regular", "Font Awesome 5 Brands", "simple-line-icons"], urls: ['assets/css/fonts.min.css']},
			active: function() {
				sessionStorage.fonts = true;
			}
		});
		
	</script>
   <style>
        .spinner-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        
        .avatar-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        .username-spinner {
            width: 100px;
            height: 16px;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 4px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

		.loading-modal .modal-content {
			background: transparent;
			border: none;
		}
		.alert-danger {
			margin-top: 20px;
		}	  
    </style>	

	<!-- CSS Files -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
	<!--<link rel="stylesheet" href="assets/css/plugins.min.css">-->
	<link rel="stylesheet" href="assets/css/kaiadmin.min.css">

	<!-- CSS Just for demo purpose, don't include it in your project -->
	<!--<link rel="stylesheet" href="assets/css/demo.css"> -->
	<link rel="stylesheet" href="assets/css/estilo.css">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.min.css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"  />	
	<link rel="stylesheet" href="https://cdn.datatables.net/2.3.3/css/dataTables.dataTables.css"  />	
</head>
<body>
	<input type="hidden" id="accesstoken" value="<?php echo isset($_GET['access_token']) ? $_GET['access_token'] : ''; ?>" />
	<input type="hidden" id="authkey" value="<?php echo isset($_GET['auth_key']) ? $_GET['auth_key'] : ''; ?>" />
	<input type="hidden" id="accesskey" value="" />
	<div class="wrapper">
		<!-- Sidebar -->
		<div class="sidebar" data-background-color="white">
			<div class="sidebar-logo">
				<!-- Logo Header -->
				<div class="logo-header" data-background-color="white">

					<a href="index.html" class="logo">
						<img src="assets/img/logo.png" alt="navbar brand" class="navbar-brand" height="50">
					</a>
					<div class="nav-toggle">
						<button class="btn btn-toggle toggle-sidebar">
							<i class="gg-menu-right"></i>
						</button>
						<button class="btn btn-toggle sidenav-toggler">
							<i class="gg-menu-left"></i>
						</button>
					</div>
					<button class="topbar-toggler more">
						<i class="gg-more-vertical-alt"></i>
					</button>

				</div>
				<!-- End Logo Header -->	
			</div>	
			<div class="sidebar-wrapper scrollbar scrollbar-inner">
				<div class="sidebar-content">
					<ul class="nav nav-secondary" id="dynamic-menu">
					</ul>
				</div>
			</div>
		</div>
		<!-- End Sidebar -->

		<div class="main-panel">
			<div class="main-header">
				<div class="main-header-logo">
					<!-- Logo Header -->
					<div class="logo-header" data-background-color="white">

						<a href="index.html" class="logo">
							<img src="assets/img/kaiadmin/logo_light.svg" alt="navbar brand" class="navbar-brand" height="20">
						</a>
						<div class="nav-toggle">
							<button class="btn btn-toggle toggle-sidebar">
								<i class="gg-menu-right"></i>
							</button>
							<button class="btn btn-toggle sidenav-toggler">
								<i class="gg-menu-left"></i>
							</button>
						</div>
						<button class="topbar-toggler more">
							<i class="gg-more-vertical-alt"></i>
						</button>

					</div>
					<!-- End Logo Header -->
				</div>
				<!-- Navbar Header -->
				<nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">

					<div class="container-fluid">
						<nav class="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
							<div class="input-group">
								<div class="input-group-prepend">
									<button type="submit" class="btn btn-search pe-1">
										<i class="fa fa-search search-icon"></i>
									</button>
								</div>
								<input type="text" placeholder="Search ..." class="form-control">
							</div>
						</nav>

						<ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
							<li class="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
								<a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false" aria-haspopup="true">
									<i class="fa fa-search"></i>
								</a>
								<ul class="dropdown-menu dropdown-search animated fadeIn">
									<form class="navbar-left navbar-form nav-search">
										<div class="input-group">
											<input type="text" placeholder="Search ..." class="form-control">
										</div>
									</form>
								</ul>
							</li>
							<li class="nav-item topbar-icon dropdown hidden-caret">
								<a class="nav-link dropdown-toggle" href="#" id="messageDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<i class="fa fa-envelope"></i>
								</a>
								<ul class="dropdown-menu messages-notif-box animated fadeIn" aria-labelledby="messageDropdown">
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
								</ul>
							</li>
							<li class="nav-item topbar-icon dropdown hidden-caret">
								<a class="nav-link dropdown-toggle" href="#" id="notifDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<i class="fa fa-bell"></i>
									<span class="notification">4</span>
								</a>
								<ul class="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown">
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
								</ul>
							</li>
							<li class="nav-item topbar-icon dropdown hidden-caret">
								<a class="nav-link" data-bs-toggle="dropdown" href="#" aria-expanded="false">
									<i class="fas fa-layer-group"></i>
								</a>
								<div class="dropdown-menu quick-actions animated fadeIn">
									<div class="quick-actions-header">
										<span class="title mb-1">Quick Actions</span>
										<span class="subtitle op-7">Shortcuts</span>
									</div>
									<div class="quick-actions-scroll scrollbar-outer">
										<div class="quick-actions-items">
											<div class="row m-0">
												<a class="col-6 col-md-4 p-0" href="#">
													<div class="quick-actions-item">
														<div class="avatar-item bg-danger rounded-circle">
															<i class="far fa-calendar-alt"></i>
														</div>
														<span class="text">Calendar</span>
													</div>
												</a>
												<a class="col-6 col-md-4 p-0" href="#">
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
												</a>
											</div>
										</div>
									</div>
								</div>
							</li>
							
							<li class="nav-item topbar-user dropdown hidden-caret">
								<a class="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false">
									<div class="avatar-sm" id="avatar-container">
										<!-- Spinner será inserido via JavaScript -->
									</div>
									<span class="profile-username" id="username-container">
										<!-- Spinner será inserido via JavaScript -->
									</span>
								</a>
								<ul id="dropdown_user" class="dropdown-menu dropdown-user animated fadeIn">
									<!-- Conteúdo do dropdown -->
								</ul>
							</li>
						</ul>
					</div>
				</nav>
				<!-- End Navbar -->
			</div>
			
			<div class="container">
				<div class="page-inner">
					<div class="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
						<div>
							<h3 class="fw-bold mb-3">Dashboard</h3>
							<h6 class="op-7 mb-2">Free Bootstrap 5 Admin Dashboard</h6>
						</div>
						<div class="ms-md-auto py-2 py-md-0">
							<a id="Manage" href="#" class="btn btn-label-info btn-round me-2">Manage</a>
							<a href="#" class="btn btn-primary btn-round">Add Customer</a>
						</div>
					</div>
				</div>
			</div>
			
			<footer class="footer">
				<div class="container-fluid">
					<nav class="pull-left">
						<ul class="nav">
							<li class="nav-item">
								<a class="nav-link" href="http://www.themekita.com">
									ThemeKita
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="#">
									Help
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="#">
									Licenses
								</a>
							</li>
						</ul>
					</nav>
					<div class="copyright ms-auto">
						2024, made with <i class="fa fa-heart heart text-danger"></i> by <a href="http://www.themekita.com">ThemeKita</a>
					</div>				
				</div>
			</footer>
		</div>	
	</div>	   

	<div class="cf-turnstile" data-sitekey="0x4AAAAAABuVdzwbnHVBP83i"></div>

	<!--   Core JS Files   -->
	<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

	<!-- jQuery Scrollbar -->
	<script src="assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>

	<!-- Chart JS -->
	<script src="assets/js/plugin/chart.js/chart.min.js"></script>

	<!-- jQuery Sparkline -->
	<script src="assets/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>

	<!-- Chart Circle -->
	<script src="assets/js/plugin/chart-circle/circles.min.js"></script>

	<!-- Datatables -->
	<!--<script src="assets/js/plugin/datatables/datatables.min.js"></script>-->
	<script src="https://cdn.datatables.net/2.3.3/js/dataTables.js"></script>

	<!-- Bootstrap Notify -->
	<script src="assets/js/plugin/bootstrap-notify/bootstrap-notify.min.js"></script>

	<!-- jQuery Vector Maps -->
	<script src="assets/js/plugin/jsvectormap/jsvectormap.min.js"></script>
	<script src="assets/js/plugin/jsvectormap/world.js"></script>

	<!-- Sweet Alert -->
	<script src="assets/js/plugin/sweetalert/sweetalert.min.js"></script>

	<!-- Kaiadmin JS -->
	<script src="assets/js/kaiadmin.min.js"></script>

	<!-- Kaiadmin DEMO methods, don't include it in your project! -->
	<!--<script src="assets/js/setting-demo.js"></script>
	<script src="assets/js/demo.js"></script>-->
	<script>
		$('#lineChart').sparkline([102,109,120,99,110,105,115], {
			type: 'line',
			height: '70',
			width: '100%',
			lineWidth: '2',
			lineColor: '#177dff',
			fillColor: 'rgba(23, 125, 255, 0.14)'
		});

		$('#lineChart2').sparkline([99,125,122,105,110,124,115], {
			type: 'line',
			height: '70',
			width: '100%',
			lineWidth: '2',
			lineColor: '#f3545d',
			fillColor: 'rgba(243, 84, 93, .14)'
		});

		$('#lineChart3').sparkline([105,103,123,100,95,105,115], {
			type: 'line',
			height: '70',
			width: '100%',
			lineWidth: '2',
			lineColor: '#ffa534',
			fillColor: 'rgba(255, 165, 52, .14)'
		});
	</script>

<script src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
<!--<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-maskmoney/3.0.2/jquery.maskMoney.min.js"></script>
<script src="assets/js/jquery.tabbable.js"></script>
<script src="assets/js/jquery.mask.js"></script>
<script src="assets/js/carregar-template.js"></script>
<script src="js/funcoes.js"></script>
<script src="js/municipio.js"></script>
<script src="js/bairro.js"></script>
<script src="js/empresa.js"></script>
<script src="js/aluno.js"></script>
<script>
$(document).ready(function() {
	//setInterval(checkTurnstileStatus, 1000);
	
	localStorage.setItem('login_url','https://login.seiweb.com.br/index.php?access_token='+$('#accesstoken').val());
	localStorage.setItem('token','Bearer '+$('#authkey').val());	
	
 // Função para mostrar spinners e depois o conteúdo real após 3 segundos
        function initializeProfileSpinners() {
            // Container para a imagem do avatar
            const avatarContainer = document.getElementById('avatar-container');
            // Container para o nome de usuário
            const usernameContainer = document.getElementById('username-container');
            const dropdownuser = document.getElementById('dropdown_user');
			
            
            // Salvar o conteúdo original
            const originalAvatar = `
                <img src="assets/img/profile.jpg" alt="..." class="avatar-img rounded-circle">
            `;
            const originalUsername = `
                <span class="op-7">Hi,</span> <span class="fw-bold">Hizrian</span>
            `;
            const originalDropdownuser = `
				<div class="dropdown-user-scroll scrollbar-outer">
					<li>
						<div class="user-box">
							<div class="avatar-lg"><img src="assets/img/profile.jpg" alt="image profile" class="avatar-img rounded"></div>
							<div class="u-text">
								<h4>Hizrian</h4>
								<p class="text-muted">hello@example.com</p><a href="profile.html" class="btn btn-xs btn-secondary btn-sm">View Profile</a>
							</div>
						</div>
					</li>
					<li>
						<div class="dropdown-divider"></div>
						<a id="Logout" class="dropdown-item" href="#">Logout</a>
					</li>
				</div>
            `;
            
            // Adicionar spinners
            avatarContainer.innerHTML = `
                <div class="spinner-container">
                    <div class="avatar-spinner"></div>
                </div>
            `;
            usernameContainer.innerHTML = `
                <div class="username-spinner"></div>
            `;
            
            // Restaurar conteúdo original após 3 segundos
            setTimeout(() => {
                avatarContainer.innerHTML = originalAvatar;
                usernameContainer.innerHTML = originalUsername;
                dropdownuser.innerHTML = originalDropdownuser;
				
				$('#Logout').off('click').on('click', (e) => {
					e.preventDefault();
					redirectToLogin();
				});
            }, 3000);
        }
        
        // Inicializar os spinners
        initializeProfileSpinners();
        
        // Restante do código para carregar o menu
        function carregarMenu() {
            $.ajax({
                url: 'https://api.seiweb.com.br/Menu',
                method: 'GET',
                dataType: 'json',
                beforeSend: function (xhr) {
                    $('#dynamic-menu').html(`
                        <div class="loading-spinner">
                            <div class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Carregando...</span>
                                </div>
                                <p class="mt-2 text-black">Carregando menu...</p>
                            </div>
                        </div>
                    `);
                },
                success: function(data) {
                    construirMenu(data);
                },
                error: function(xhr, status, error) {
                    console.error('Erro ao carregar o menu:', error);
                    $('#dynamic-menu').html('<li class="nav-item"><a href="#"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar menu</p></a></li>');
                }
            });
        }

        // Restante das funções do menu
        function construirMenu(menus) {
            var menuHTML = '';
            
            menus.forEach(function(menu) {
                var menuId = 'menu-' + menu.id;
                
                menuHTML += `
                <li class="nav-item submenu">
                    <a data-bs-toggle="collapse" href="#${menuId}" class="collapsed" aria-expanded="false">
                        <i class="${menu.icone}"></i>
                        <p class="text-uppercase">${menu.titulo}</p>
                        <span class="caret"></span>
                    </a>
                    <div class="collapse" id="${menuId}">
                        <ul class="nav nav-collapse">`;
                
                if (menu.submenus && menu.submenus.length > 0) {
                    menu.submenus.forEach(function(submenu) {
                        menuHTML += `
                            <li>
                                <a href="#" data-modulo="${submenu.modulo}" id="${submenu.elemento_id}" onclick="${submenu.elemento_id}Click(this);">
                                    <span class="sub-item text-uppercase">${submenu.titulo}</span>
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
            inicializarMenu();
        }
        
        function inicializarMenu() {
            console.log('Menu dinâmico carregado e inicializado');
        }
        
        carregarMenu();
		
		//$('#loadingModal').modal('show');
});
</script>	
</body>
</html>