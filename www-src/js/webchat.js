var webchat = {};

#include "http://code.jquery.com/jquery-1.7.1.min.js"
#include "http://markdotto.com/bs2/js/bootstrap-modal.js"
#include "Service.js"
#include "User.js"

webchat.init = function init(){
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

	webchat.Service.init();
	webchat.User.init();
};

webchat.init();