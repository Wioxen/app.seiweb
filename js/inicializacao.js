var $baseApiUrl = undefined;
var $loginUrl = undefined;
var $title = undefined;
var dataConfiguracao = undefined;

const $imageUrl = "https://uploads.seiweb.com.br/images/";

function initializeReady() 
{	
	$baseApiUrl = "https://api.seiweb.com.br/";
	$loginUrl = "https://login.seiweb.com.br/index.php?token="+$('#token').val();

	var _port = $.trim($('#port').val());

	if ((_port !== '') && (_port !== null) && (_port !== undefined))
	{
		$baseApiUrl = "https://localhost:"+_port+"/";	
		$loginUrl = "https://localhost/login.seiweb/index.php?token="+$('#token').val()+"&port="+_port;	
	}	
	
	if ($.trim($('#token').val()) !== '')
		localStorage.setItem('login_url',$loginUrl);
	
	if ($.trim($('#key').val()) !== '')
		localStorage.setItem('token','Bearer '+$('#key').val());		

	if ($.trim($('#port').val()) !== '')
		localStorage.setItem('port',$.trim($('#port').val()));	

	var userAgentString = navigator.userAgent;
	localStorage.setItem('user_agent',userAgentString);		
	
	//setInterval(checkTurnstileStatus, 1000);
	$.getJSON("https://api.ipify.org/?format=json", function(e) {
		console.log(e.ip);
		localStorage.setItem('remoteip',e.ip);
	}); 		

	startDataHora();
	messageDropdown();
	notifDropdown();
	shortCut();
	profile_pic();
	carregarGeo();
	
	carregarMenu();
	
    inicializacao();
}

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