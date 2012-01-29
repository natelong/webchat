var webchat = {};

#include "http://code.jquery.com/jquery-1.7.1.min.js"
#include "http://markdotto.com/bs2/js/bootstrap-modal.js"
#include "http://markdotto.com/bs2/js/bootstrap-tab.js"
#include "soyutils.js"
#include "templates.js"
#include "Service.js"
#include "User.js"
#include "Interface.js"

webchat.init = function init(){
	$( '#chat' ).submit(function( e ){
		e.preventDefault();
		var msgText = $( 'input[name=chat]' ).val();
		if( msgText === '' ){
			return;
		}

		var currentChannel = $( '.tab-pane.active' ).attr( 'id' );
		var message = {
			Type: 'message',
			Data: {
				Text: msgText,
				Name: webchat.User.Name,
				Channel: currentChannel,
				ID: webchat.User.ID
			}
		};

		webchat.Service.send( message );
		$( 'input[name=chat]' ).val( '' );
	});

	$( '#chatStartInfoForm' ).submit(function( e ){
		e.preventDefault();
		var name = $( '#chatStartInfoForm input[name=name]' ).val();
		var channel = $( '#chatStartInfoForm input[name=channel]' ).val() || 'General';
		if( !name || !channel ){
			return;
		}
		webchat.User.Name = name;
		webchat.User.Channels = [ channel ];
		webchat.Service.init();
		$( '#startupModal' ).modal( 'hide' );

		webchat.Interface.addNewChannel( channel );
		webchat.Interface.activateFirstTab();
	});

	$( '#newChannelForm' ).submit(function( e ){
		e.preventDefault();
		var channel = $( '#newChannelForm input[name=channel]' ).val() || 'General';
		channel = channel.replace( /[\,\.\/\<\>\?\;\'\[\]\\\{\}\|]/g, '' );
		if( !channel ){
			return;
		}
		webchat.Interface.addNewChannel( channel );
		webchat.Service.Actions.getUserList();
		$( '#newChannelForm' ).modal( 'hide' );
	});

	$( '#addChannelTab' ).click(function( e ){
		e.preventDefault();
		$( '#newChannelForm' ).modal({
			keyboard: false
		});
	});

	$( '#startupModal' ).modal({
		keyboard: false
	});
	$( '.modal-backdrop' ).unbind();
};

webchat.init();