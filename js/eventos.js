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
		<span class="notification bg-danger">4</span>`);
		
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
	zPergunta(`${$('#first-name').text()}, deseja realmente sair do sistema?`,function(){
		RestRequest({
			method: 'POST',
			url: $baseApiUrl+"Logout",
			success: function (response, textStatus, jqXHR) {
				hideLoadingModal();
				redirectToLogin();
			}
		});                          
	});
	/*Swal.fire({
		title: 'Responda',
		text: `${$('#first-name').text()}, deseja realmente sair do sistema?`,
		icon: "question",
		showCancelButton: true,
		customClass: {
		confirmButton: "btn btn-success",
		cancelButton: "btn btn-danger"
		},
		confirmButtonText: "Sim, eu confirmo",
		cancelButtonText: "Não",	  
		}).then((result) => {
		if (result.isConfirmed) {
		RestRequest('POST',
		$baseApiUrl+"Logout",
		null,
		null,
		function (response, textStatus, jqXHR) {
		hideLoadingModal();
		swal.close();
		redirectToLogin();
		});                          
		}
	});*/	
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
				<img src="#" alt="" class="avatar-img rounded-circle">
				</div>
				<span class="profile-username">
				<span class="op-7">Olá,</span> <span class="fw-bold">${data.firstname}</span>
			</span>`);
			
			// Criar a estrutura base do dropdown
			let dropdownContent = `
			<ul class="dropdown-menu dropdown-user animated fadeIn">
			<div class="dropdown-user-scroll scrollbar-outer">
			<li>
			<div class="user-box">
			<div class="avatar-lg"><img src="#" alt="image profile" class="avatar-img rounded"></div>
			<div class="u-text">
			<div class="d-flex justify-content-between">
			<h4 id="first-name">${data.firstname}</h4>
			<span class="badge badge-success">${data.roleType}</span>
			</div>
			<p class="text-muted">${data.email}</p>
			<a href="#" class="btn btn-secondary btn-sm" onclick="MeuPerfilClick(this);"><i class="icon-user"></i> Meu Perfil</a>
			</div>
			</div>
			</li>
			<li>
			<div class="dropdown-divider"></div>
			<a class="dropdown-item" href="#" onclick="AlterarSenhaClick(this);">Alterar Senha</a>`;
			
			// Verificar se NÃO é usuário para adicionar Configuração e Log
			if (data.roleType.toLowerCase() !== "usuario") {
				dropdownContent += `
				<div class="dropdown-divider"></div>
				<a class="dropdown-item" href="#" onclick="ConfiguracaoClick(this);">Configuração</a>
				<div class="dropdown-divider"></div>
				<a class="dropdown-item" href="#" onclick="LogDeAtividadeClick(this);">Log de atividades</a>`;
			}
			
			// Adicionar a parte final (Logout)
			dropdownContent += `
			<div class="dropdown-divider"></div>
			<a id="Logout" class="dropdown-item" href="#">Logout</a>
			</li>
			</div>
			</ul>`;
			
			// Adicionar ao DOM
			$('#profile-pic').parent().append(dropdownContent);						
			
			
			$('.avatar-img').attr('src',$imageUrl+data.photo);
			
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
			$('#sidebar').html(`<div class="text-center mt-5"><i class="fas fa-spinner fa-spin fa-2x"></i></div>`);
		},
		success: function(data) {
			$('#sidebar').html(`<div class="sidebar-content"><ul class="nav nav-secondary" id="dynamic-menu"><li class="nav-section">
				<span class="sidebar-mini-icon">
				<i class="fa fa-ellipsis-h"></i>
				</span>
				<h4 class="text-section">Menu Principal	</h4>
				</li></ul>
			</div>`);
			
			$('#dynamic-menu').append(renderMenu(data));				
			
		},
		error: function(xhr, status, error) {
			console.error('Erro ao carregar o menu:', error);
			$('#dynamic-menu').html('<li class="nav-item"><a href="#"><i class="fas fa-exclamation-triangle"></i><p>Erro ao carregar menu</p></a></li>');
		}
	});
}

// Restante das funções do menu
function renderMenu(items) {
    let html = '';
	
    items.forEach(item => {
        if (item.children.length > 0) {
            html += `
            <li class="nav-item">
			<a data-bs-toggle="collapse" href="#${item.collapseId}">
			<i class="${item.icon}"></i>
			<p>${item.title}</p>
			<span class="caret"></span>
			</a>
			<div class="collapse" id="${item.collapseId}">
			<ul class="nav nav-collapse p-0">
			${renderMenu(item.children)}
			</ul>
			</div>
            </li>`;
			} else {
            html += `
            <li>
			<a href="${item.url}" onclick="${item.clickEvent}">
			<span class="sub-item">${item.title}</span>
			</a>
            </li>`;
		}
	});
	
    return html;
}

// Função para atualizar o display em tempo real
function atualizarDataHora() {
    const dataHoraFormatada = formatarDataHora();
    $('.data-hora').text(dataHoraFormatada);
}

function startDataHora() {
	// Atualizar imediatamente e a cada segundo
	atualizarDataHora();
	setInterval(atualizarDataHora, 1000);		
}

function isMobile() {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
        navigator.userAgent.toLowerCase()
	) || window.innerWidth <= 768;
}

function carregarGeo() {
	$.ajax({
		url: `${$baseApiUrl}geolocation/table`,
		method: 'GET',
		dataType: 'json',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
			$('#Geolocation').html(`<i class="fa fa-spin fa-spinner fa-2x"></i>`);
		},
		success: function(data) {
			$('#Geolocation').html(`<div class="card card-round">
				<div class="card-header">
				<div class="card-head-row card-tools-still-right">
				<h4>Nacionalidades</h4>
				</div>
				<p class="card-category">
				Mapa de pessoas por nacionalidade</p>
				</div>
				<div class="card-body">
				<div class="row">
				<div class="col-md-6">
				<div class="table-responsive table-hover table-sales">
				<table id="TbGeo" class="table">
				</tbody>
				</table>
				</div>
				</div>
				<div class="col-md-6">
				<div class="mapcontainer">
				<div id="world-map" class="w-100 jvm-container" style="height: 300px; background-color: transparent;"></div>
				</div>
				</div>
				</div>
				</div>
			</div>`);
			
			var _markers = [];
			
			$.each(data,function(i,v){
				_markers.push({name: v.descricao, coords: [v.latitude, v.longitude]});
			
				$('#TbGeo').append(`<tr>
					<td>
					<div class="flag">
					<img src="assets/img/flags/${v.flag}.png" alt="${v.descricao}">
					</div>
					</td>
					<td>${v.descricao}</td>
					<td class="text-end">
					${v.qtde}
					</td>
					<td class="text-end">
					${v.perc}%
					</td>
				</tr>`);
			});
			
			var world_map = new jsVectorMap({
				selector: "#world-map",
				map: "world",
				zoomOnScroll: false,
				regionStyle: {
					hover: {
						fill: '#435ebe'
					}
				},
				markers: _markers,
				onRegionTooltipShow(event, tooltip) {
					tooltip.css({ backgroundColor: '#435ebe' })
				}
			});
			
			/*var map_settings = {
              map: 'brazil',
              zoomButtons: false,
              zoomMax: 1,
              regionStyle: {
                  initial: {
                      'fill-opacity': 0.9,
                      stroke: '#000',
                      'stroke-width': 100,
                      'stroke-opacity': 1
                  },
                  hover: {
                      fill: '#00709a'
                  }
              },
              backgroundColor: '#fff',
              series: {
                  regions: [{
                      values: {
                          // Região Norte
                          ac: '#fff9c2',
                          am: '#fff9c2',
                          ap: '#fff9c2',
                          pa: '#fff9c2',
                          ro: '#fff9c2',
                          rr: '#fff9c2',
                          to: '#fff9c2',
                          // Região Nordeste
                          al: '#fcdeeb',
                          ba: '#fcdeeb',
                          ce: '#fcdeeb',
                          ma: '#fcdeeb',
                          pb: '#fcdeeb',
                          pe: '#fcdeeb',
                          pi: '#fcdeeb',
                          rn: '#fcdeeb',
                          se: '#fcdeeb',
                          // Região Centro-Oeste
                          df: '#feb83d',
                          go: '#feb83d',
                          ms: '#feb83d',
                          mt: '#feb83d',
                          // Região Sudeste
                          es: '#e8ec9b',
                          mg: '#e8ec9b',
                          rj: '#e8ec9b',
                          sp: '#e8ec9b',
                          // Região Sul
                          pr: '#fef56c',
                          rs: '#fef56c',
                          sc: '#fef56c'
                      },
                      attribute: 'fill'
                  }]
              },
              container: $('#world-map'),
              onRegionClick: function (event, code) {
                  $('#clicked-region span').text(code);
              },
              onRegionOver: function (event, code) {
                  $('#hovered-region span').text(code);
              }
          };

          map = new jvm.WorldMap($.extend(true, {}, map_settings));*/
	
			
			
		},
		error: function(xhr, status, error) {
			console.error('Erro ao carregar o Geo:', error);
		}
	});
}

function inicializacao(){
	RestRequest({
		url: `${$baseApiUrl}inicializacao`,
		method: 'GET',
		beforeSend: function(xhr){
			showLoadingModal();
			$('#DvEmpresa').html('<i class="fa fa-spin fa-spinner fa-2x"><i>');
		},
		success: function(data) {
			hideLoadingModal();
			dataConfiguracao = data.configuracoes
			$('#AnoTexto').text(dataConfiguracao.ano);
			$('#DvEmpresa').html(`<h3 class="fw-bold me-3">${data.empresa} <span class="badge badge-secondary">${data.cnpj}</span></h3>
				<h3 id="AnoTexto" class="text-danger fw-bold">${dataConfiguracao.ano}</h3>`);
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
		}
	});
}