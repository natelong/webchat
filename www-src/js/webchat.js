var webchat = {};

#include "Service.js"

webchat.init = function init(){
	webchat.Service.init();


	document.querySelector( '#chat' ).addEventListener( 'submit', function( e ){
		e.preventDefault();
		var msgText = document.querySelector( 'input[name=chat]' ).value;
		if( msgText === '' ){
			return;
		}

		var message = {
			type: "message",
			text: msgText
		};

		webchat.Service.ws.send( JSON.stringify( message ) );
		webchat.Service.callbacks.onMessage( message );
		document.querySelector( 'input[name=chat]' ).value = '';
	});
};

webchat.init();