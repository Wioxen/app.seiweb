function initializeReady() 
{
	localStorage.setItem('login_url',$loginUrl);
	localStorage.setItem('token','Bearer '+$('#key').val());		
	localStorage.setItem('port',$.trim($('#port').val()));	

	var userAgentString = navigator.userAgent;
	localStorage.setItem('user_agent',userAgentString);		
	
	//setInterval(checkTurnstileStatus, 1000);
	$.getJSON("https://api.ipify.org/?format=json", function(e) {
		console.log(e.ip);
		localStorage.setItem('remoteip',e.ip);
	}); 		

	// Atualizar imediatamente e a cada segundo
	atualizarDataHora();
	setInterval(atualizarDataHora, 1000);	
	
	messageDropdown();
	notifDropdown();
	shortCut();
	profile_pic();
	
	carregarMenu();
}