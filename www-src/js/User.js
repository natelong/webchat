webchat.User = {};


webchat.User.name = '';

webchat.User.init = function init(){
	document.querySelector( '#changeNameLink' ).addEventListener( 'click', function( e ){
		e.preventDefault();
		console.log( 'Clicked add Name...' );
	}, false );
};

webchat.User.getName = function getName(){
	console.log( 'Getting name...' );
};