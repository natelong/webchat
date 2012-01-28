var webchat = {};

#include "http://code.jquery.com/jquery-1.7.1.min.js"
#include "http://markdotto.com/bs2/js/bootstrap-modal.js"
#include "http://markdotto.com/bs2/js/bootstrap-tab.js"
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
			Type: 'message',
			Data: {
				Text: msgText,
				Name: webchat.User.Name,
				Channels: webchat.User.Channels,
				ID: webchat.User.ID
			}
		};

		webchat.Service.send( message );
		document.querySelector( 'input[name=chat]' ).value = '';
	});

	$( '#chatStartInfoForm' ).submit(function( e ){
		e.preventDefault();
		var name = $( '#chatStartInfoForm input[name=name]' ).val();
		var channel = $( '#chatStartInfoForm input[name=channel]' ).val();
		if( !name || !channel ){
			return;
		}
		webchat.User.Name = name;
		webchat.User.Channels = [ channel ];
		webchat.Service.init();
		$( '#startupModal' ).modal( 'hide' );
	});

	$( '#startupModal' ).modal({
		keyboard: false
	});
	$( '.modal-backdrop' ).unbind();
};

webchat.init();