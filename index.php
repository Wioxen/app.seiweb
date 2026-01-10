<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>SEIWEB - Sistema Escolar Integrado</title>
	<meta content='width=device-width, initial-scale=1.0, shrink-to-fit=no' name='viewport' />
	<link rel="icon" href="assets/img/logo-icon.png" type="image/x-icon"/>

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

	<!-- CSS Files -->
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="assets/css/plugins.min.css">
	<link rel="stylesheet" href="assets/css/kaiadmin.min.css">

	<!-- CSS Just for demo purpose, don't include it in your project -->
	<link rel="stylesheet" href="assets/css/demo.css">

    <link rel="stylesheet" href="//code.jquery.com/ui/1.13.2/themes/base/jquery-ui.min.css" />
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"  />	
		
	<!--DataTable-->
	<link rel="stylesheet" href="https://cdn.datatables.net/2.3.4/css/dataTables.dataTables.css"  />	
	<link rel="stylesheet" href="https://cdn.datatables.net/select/3.1.0/css/select.dataTables.css"  />	
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

	<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2-bootstrap-5-theme@1.3.0/dist/select2-bootstrap-5-theme.min.css" />

	<link rel="stylesheet" href="assets/css/estilo.css">
	<link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet">                
</head>
<body>
	<input type="hidden" id="token" value="<?php echo isset($_GET['token']) ? $_GET['token'] : ''; ?>" />
	<input type="hidden" id="key" value="<?php echo isset($_POST['authKey']) ? $_POST['authKey'] : ''; ?>" />
	<input type="hidden" id="port" value="<?php echo isset($_GET['port']) ? $_GET['port'] : ''; ?>" />	
	<div class="wrapper">
		<!-- Sidebar -->
		<div class="sidebar" data-background-color="dark">
			<div class="sidebar-logo">
				<!-- Logo Header -->
				<div class="logo-header" data-background-color="white">

					<a href="#" class="logo">
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
			<div id="sidebar" class="sidebar-wrapper scrollbar scrollbar-inner">
				<div class="text-center mt-5"><i class="fas fa-spinner fa-spin fa-2x"></i></div>
			</div>			
		</div>
		<!-- End Sidebar -->

		<div class="main-panel">
			<div class="main-header">
				<div class="main-header-logo">
					<!-- Logo Header -->
					<div class="logo-header" data-background-color="dark">

						<a href="#" class="logo">
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
									<i class="fa fa-spin fa-spinner"></i>
								</a>								
							</li>
							<li class="nav-item topbar-icon dropdown hidden-caret">
								<a class="nav-link dropdown-toggle" href="#" id="notifDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<i class="fa fa-spin fa-spinner"></i>
								</a>								
							</li>
							<li class="nav-item topbar-icon dropdown hidden-caret">
								<a class="nav-link" data-bs-toggle="dropdown" href="#" aria-expanded="false" id="shortCut">
									<i class="fa fa-spin fa-spinner"></i>
								</a>								
							</li>
							
							<li class="nav-item topbar-user dropdown hidden-caret">
								<a class="dropdown-toggle profile-pic" data-bs-toggle="dropdown" href="#" aria-expanded="false" id="profile-pic">
									<i class="fa fa-spin fa-spinner"></i>									
								</a>								
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
							<h3 class="fw-bold mb-3">Colégio DEMO</h3>
							<small id="data-hora" class="op-7 mb-2"></small>
						</div>
						<div class="ms-md-auto py-2 py-md-0">
							<a href="#" class="btn btn-label-info btn-round me-2" onclick="UsuarioAcessoClick(this);"><i class="fa fa-user"></i> Visitante</a>
							<a href="#" class="btn btn-primary btn-round" onclick="alunoClick(this);"><i class="fa-solid fa-user-graduate"></i> Cadastrar aluno</a>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-6 col-md-3">
							<div class="card card-stats card-round">
								<div class="card-body ">
									<a href="#">
										<div class="row align-items-center">
											<div class="col-icon">
												<div class="icon-big text-center icon-primary bubble-shadow-small">
													<i class="fas fa-hand-holding-usd"></i>
												</div>
											</div>
											<div class="col col-stats ms-3 ms-sm-0">
												<div class="numbers">
													<p class="card-category">Contas a pagar, Cobrança</p>
													<h4 class="card-title">Tesouraria</h4>
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
						<div class="col-sm-6 col-md-3">
							<div class="card card-stats card-round">
								<div class="card-body">
									<a href="#">
										<div class="row align-items-center">
											<div class="col-icon">
												<div class="icon-big text-center icon-info bubble-shadow-small">
													<i class="fas fa-user-check"></i>
												</div>
											</div>
											<div class="col col-stats ms-3 ms-sm-0">
												<div class="numbers">
													<p class="card-category">E-mail, SMS, Notificações</p>
													<h4 class="card-title">Mensagens</h4>
												</div>
											</div>
										</div>										
									</a>
								</div>
							</div>
						</div>
						<div class="col-sm-6 col-md-3">
							<div class="card card-stats card-round">
								<div class="card-body">
									<a href="#">
										<div class="row align-items-center">
											<div class="col-icon">
												<div class="icon-big text-center icon-success bubble-shadow-small">
													<i class="fas fa-luggage-cart"></i>
												</div>
											</div>
											<div class="col col-stats ms-3 ms-sm-0">
												<div class="numbers">
													<p class="card-category">Gabarito, Relatórios, Estatísticas</p>
													<h4 class="card-title">Correção</h4>
												</div>
											</div>
										</div>
									</a>
								</div>
							</div>
						</div>
						<div class="col-sm-6 col-md-3">
							<div class="card card-stats card-round">
								<div class="card-body">
									<a href="#" class="">
									<div class="row align-items-center">
										<div class="col-icon">
											<div class="icon-big text-center icon-secondary bubble-shadow-small">
												<i class="fa fa-book"></i>
											</div>
										</div>
										<div class="col col-stats ms-3 ms-sm-0">
											<div class="numbers">
												<p class="card-category">Cadastro de acervo, Empréstimo ...</p>
												<h4 class="card-title">Biblioteca</h4>
											</div>
										</div>
									</div>										
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-8">
							<div class="card card-round">
								<div class="card-header">
									<div class="card-head-row">
										<div class="card-title">User Statistics</div>
										<div class="card-tools">
											<a href="#" class="btn btn-label-success btn-round btn-sm me-2">
												<span class="btn-label">
													<i class="fa fa-pencil"></i>
												</span>
												Export
											</a>
											<a href="#" class="btn btn-label-info btn-round btn-sm">
												<span class="btn-label">
													<i class="fa fa-print"></i>
												</span>
												Print
											</a>
										</div>
									</div>
								</div>
								<div class="card-body">
									<div class="chart-container" style="min-height: 375px">
										<canvas id="statisticsChart"></canvas>
									</div>
									<div id="myChartLegend"></div>
								</div>
							</div>
						</div>
						<div class="col-md-4">
							<div class="card card-primary card-round">
								<div class="card-header">
									<div class="card-head-row">
										<div class="card-title">Daily Sales</div>
										<div class="card-tools">
											<div class="dropdown">
												<button class="btn btn-sm btn-label-light dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													Export
												</button>
												<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
													<a class="dropdown-item" href="#">Action</a>
													<a class="dropdown-item" href="#">Another action</a>
													<a class="dropdown-item" href="#">Something else here</a>
												</div>
											</div>
										</div>
									</div>
									<div class="card-category">March 25 - April 02</div>
								</div>
								<div class="card-body pb-0">
									<div class="mb-4 mt-2">
										<h1>$4,578.58</h1>
									</div>
									<div class="pull-in">
										<canvas id="dailySalesChart"></canvas>
									</div>
								</div>
							</div>
							<div class="card card-round">
								<div class="card-body pb-0">
									<div class="h1 fw-bold float-end text-primary">+5%</div>
									<h2 class="mb-2">17</h2>
									<p class="text-muted">Users online</p>
									<div class="pull-in sparkline-fix">
										<div id="lineChart"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="card card-round">
								<div class="card-header">
									<div class="card-head-row card-tools-still-right">
										<h4 class="card-title">Users Geolocation</h4>
										<div class="card-tools">
											<button class="btn btn-icon btn-link btn-primary btn-xs"><span class="fa fa-angle-down"></span></button>
											<button class="btn btn-icon btn-link btn-primary btn-xs btn-refresh-card"><span class="fa fa-sync-alt"></span></button>
											<button class="btn btn-icon btn-link btn-primary btn-xs"><span class="fa fa-times"></span></button>
										</div>
									</div>
									<p class="card-category">
									Map of the distribution of users around the world</p>
								</div>
								<div class="card-body">
									<div class="row">
										<div class="col-md-6">
											<div class="table-responsive table-hover table-sales">
												<table class="table">
													<tbody>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/id.png" alt="indonesia">
																</div>
															</td>
															<td>Indonesia</td>
															<td class="text-end">
																2.320
															</td>
															<td class="text-end">
																42.18%
															</td>
														</tr>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/us.png" alt="united states">
																</div>
															</td>
															<td>USA</td>
															<td class="text-end">
																240
															</td>
															<td class="text-end">
																4.36%
															</td>
														</tr>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/au.png" alt="australia">
																</div>
															</td>
															<td>Australia</td>
															<td class="text-end">
																119
															</td>
															<td class="text-end">
																2.16%
															</td>
														</tr>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/ru.png" alt="russia">
																</div>
															</td>
															<td>Russia</td>
															<td class="text-end">
																1.081
															</td>
															<td class="text-end">
																19.65%
															</td>
														</tr>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/cn.png" alt="china">
																</div>
															</td>
															<td>China</td>
															<td class="text-end">
																1.100
															</td>
															<td class="text-end">
																20%
															</td>
														</tr>
														<tr>
															<td>
																<div class="flag">
																	<img src="assets/img/flags/br.png" alt="brazil">
																</div>
															</td>
															<td>Brasil</td>
															<td class="text-end">
																640
															</td>
															<td class="text-end">
																11.63%
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
										<div class="col-md-6">
											<div class="mapcontainer">
												<div id="world-map" class="w-100" style="height: 300px;"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-4">
							<div class="card card-round">
								<div class="card-body">
									<div class="card-head-row card-tools-still-right">
										<div class="card-title">New Customers</div>
										<div class="card-tools">
											<div class="dropdown">
												<button class="btn btn-icon btn-clean me-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													<i class="fas fa-ellipsis-h"></i>
												</button>
												<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
													<a class="dropdown-item" href="#">Action</a>
													<a class="dropdown-item" href="#">Another action</a>
													<a class="dropdown-item" href="#">Something else here</a>
												</div>
											</div>
										</div>
									</div>
									<div class="card-list py-4">
										<div class="item-list">
											<div class="avatar">
												<img src="assets/img/jm_denis.jpg" alt="..." class="avatar-img rounded-circle">
											</div>
											<div class="info-user ms-3">
												<div class="username">Jimmy Denis</div>
												<div class="status">Graphic Designer</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
										<div class="item-list">
											<div class="avatar">
												<span class="avatar-title rounded-circle border border-white">CF</span>
											</div>
											<div class="info-user ms-3">
												<div class="username">Chandra Felix</div>
												<div class="status">Sales Promotion</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
										<div class="item-list">
											<div class="avatar">
												<img src="assets/img/talha.jpg" alt="..." class="avatar-img rounded-circle">
											</div>
											<div class="info-user ms-3">
												<div class="username">Talha</div>
												<div class="status">Front End Designer</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
										<div class="item-list">
											<div class="avatar">
												<img src="assets/img/chadengle.jpg" alt="..." class="avatar-img rounded-circle">
											</div>
											<div class="info-user ms-3">
												<div class="username">Chad</div>
												<div class="status">CEO Zeleaf</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
										<div class="item-list">
											<div class="avatar">
												<span class="avatar-title rounded-circle border border-white bg-primary">H</span>
											</div>
											<div class="info-user ms-3">
												<div class="username">Hizrian</div>
												<div class="status">Web Designer</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
										<div class="item-list">
											<div class="avatar">
												<span class="avatar-title rounded-circle border border-white bg-secondary">F</span>
											</div>
											<div class="info-user ms-3">
												<div class="username">Farrah</div>
												<div class="status">Marketing</div>
											</div>
											<button class="btn btn-icon btn-link op-8 me-1">
												<i class="far fa-envelope"></i>
											</button>
											<button class="btn btn-icon btn-link btn-danger op-8">
												<i class="fas fa-ban"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="col-md-8">
							<div class="card card-round">
								<div class="card-header">
									<div class="card-head-row card-tools-still-right">
										<div class="card-title">Transaction History</div>
										<div class="card-tools">
											<div class="dropdown">
												<button class="btn btn-icon btn-clean me-0" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													<i class="fas fa-ellipsis-h"></i>
												</button>
												<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
													<a class="dropdown-item" href="#">Action</a>
													<a class="dropdown-item" href="#">Another action</a>
													<a class="dropdown-item" href="#">Something else here</a>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card-body p-0">
									<div class="table-responsive">
										<!-- Projects table -->
										<table class="table align-items-center mb-0">
											<thead class="thead-light">
												<tr>
													<th scope="col">Payment Number</th>
													<th scope="col" class="text-end">Date & Time</th>
													<th scope="col" class="text-end">Amount</th>
													<th scope="col" class="text-end">Status</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
												<tr>
													<th scope="row">
														<button class="btn btn-icon btn-round btn-success btn-sm me-2">
															<i class="fa fa-check"></i>
														</button>
														Payment from #10231
													</th>
													<td class="text-end">
														Mar 19, 2020, 2.45pm
													</td>
													<td class="text-end">
														$250.00
													</td>
													<td class="text-end">
														<span class="badge badge-success">Completed</span>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<footer class="footer">
				<div class="container-fluid">
					<nav class="pull-left">
						<ul class="nav">
							<li class="nav-item">
								<a class="nav-link nav-link-x" href="#">
									Suporte <i class="fa fa-whatsapp"></i>
								</a>
							</li>
							<li class="nav-item ">
								<a class="nav-link nav-link-x" href="#">
									Licenses <i class="fas fa-key"></i>
								</a>
							</li>
						</ul>
					</nav>
					<div class="copyright ms-auto">
						2025, v1.0.0 <i class="fas fa-bolt text-warning"></i> by <a href=#">SEIWEB</a>
					</div>				
				</div>
			</footer>
		</div>
		
		<!-- Custom template | don't include it in your project! -->
		<div class="custom-template">
			<div class="title">Ajustes</div>
			<div class="custom-content">
				<div class="switcher">
					<div class="switch-block">
						<h4>Logo</h4>
						<div class="btnSwitch">
							<button type="button" class=" selected changeLogoHeaderColor" data-color="dark"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="blue"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="purple"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="light-blue"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="green"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="orange"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="red"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="white"></button>
							<br/>
							<button type="button" class="changeLogoHeaderColor" data-color="dark2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="blue2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="purple2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="light-blue2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="green2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="orange2"></button>
							<button type="button" class="changeLogoHeaderColor" data-color="red2"></button>
						</div>
					</div>
					<div class="switch-block">
						<h4>Barra de Navegação</h4>
						<div class="btnSwitch">
							<button type="button" class="changeTopBarColor" data-color="dark"></button>
							<button type="button" class="changeTopBarColor" data-color="blue"></button>
							<button type="button" class="changeTopBarColor" data-color="purple"></button>
							<button type="button" class="changeTopBarColor" data-color="light-blue"></button>
							<button type="button" class="changeTopBarColor" data-color="green"></button>
							<button type="button" class="changeTopBarColor" data-color="orange"></button>
							<button type="button" class="changeTopBarColor" data-color="red"></button>
							<button type="button" class="selected changeTopBarColor" data-color="white"></button>
							<br/>
							<button type="button" class="changeTopBarColor" data-color="dark2"></button>
							<button type="button" class="changeTopBarColor" data-color="blue2"></button>
							<button type="button" class="changeTopBarColor" data-color="purple2"></button>
							<button type="button" class="changeTopBarColor" data-color="light-blue2"></button>
							<button type="button" class="changeTopBarColor" data-color="green2"></button>
							<button type="button" class="changeTopBarColor" data-color="orange2"></button>
							<button type="button" class="changeTopBarColor" data-color="red2"></button>
						</div>
					</div>
					<div class="switch-block">
						<h4>Barra Lateral</h4>
						<div class="btnSwitch">
							<button type="button" class="changeSideBarColor" data-color="white"></button>
							<button type="button" class="selected changeSideBarColor" data-color="dark"></button>
							<button type="button" class="changeSideBarColor" data-color="dark2"></button>
						</div>
					</div>
				</div>
			</div>
			<div class="custom-toggle">
				<i class="icon-settings"></i>
			</div>
		</div>
		<!-- End Custom template -->

	</div>
	<!--<div class="cf-turnstile" data-sitekey="0x4AAAAAAB3tLfTOmtvmAtT9"></div>-->
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
	<script src="https://cdn.datatables.net/2.3.4/js/dataTables.js"></script>
	<script src="https://cdn.datatables.net/select/3.1.0/js/dataTables.select.js"></script>
	<script src="https://cdn.datatables.net/select/3.1.0/js/select.dataTables.js"></script>

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
	<script src="assets/js/setting-demo.js"></script>
	<script src="assets/js/demo.js"></script>
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
	<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>	
	<script src="assets/js/jquery.tabbable.js"></script>
	<script src="assets/js/jquery.mask.js"></script>
	<script src="assets/js/carregar-template.js"></script>
	<script src="js/eventos.js"></script>
	<script src="js/init.js"></script>
	<script src="js/global.js"></script>
	<script src="js/funcoes.js"></script>
	<script src="js/municipio.js"></script>
	<script src="js/bairro.js"></script>
	<script src="js/certificadodigital.js"></script>
	<script src="js/empresa.js"></script>
	<script src="js/saidadoaluno.js"></script>
	<script src="js/aluno.js"></script>
	<script src="js/usuario.js"></script>
	<script src="js/direitos.js"></script>
	<script src="js/alterarsenha.js"></script>
	<script src="js/meuperfil.js"></script>
	<script src="js/configuracao.js"></script>
	<script src="js/logdeatividade.js"></script>
	<script>
	// Opcional: Adicionar também um listener para mudanças dinâmicas
	$(document).on('show.bs.collapse', function(e) {
		var target = $(e.target);
		if (target.hasClass('collapse')) {
			target.prev('a').attr('aria-expanded', 'true');
			target.closest('.nav-item.modulo').addClass('active');
		}
	});

	// Remover a classe active quando o collapse for fechado
	$(document).on('hide.bs.collapse', function(e) {
		var target = $(e.target);
		if (target.hasClass('collapse')) {
			target.prev('a').attr('aria-expanded', 'false');
			target.closest('.nav-item.modulo').removeClass('active');
		}
	});				

	$(document).ready(initializeReady);
	</script>		
</body>
</html>