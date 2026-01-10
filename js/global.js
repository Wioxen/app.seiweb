var $baseApiUrl = "https://api.seiweb.com.br/";
var $loginUrl = "https://login.seiweb.com.br/index.php?token="+$('#token').val();

const $imageUrl = "https://uploads.seiweb.com.br/images/";

var _port = $.trim($('#port').val());

if ((_port !== '') && (_port !== null) && (_port !== undefined))
{
	$baseApiUrl = "https://localhost:"+_port+"/";	
	$loginUrl = "https://localhost/login.seiweb/index.php?token="+$('#token').val()+"&port="+_port;	
	//$imageUrl = "https://localhost:"+_port+"/images/";
}