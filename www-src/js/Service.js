webchat.Service = {};

#include "ServiceActions.js"

webchat.Service.url = 'ws://' + window.location.host + '/chat';
webchat.Service.recentMessageCount = 25;

webchat.Service.init = function init(){
	var ws = new WebSocket( webchat.Service.url );

	ws.addEventListener( 'close', webchat.Service.callbacks.onClose );
	ws.addEventListener( 'error', webchat.Service.callbacks.onError )
	ws.addEventListener( 'open', webchat.Service.callbacks.onOpen );
	ws.addEventListener( 'message', webchat.Service.callbacks.onMessage );

	webchat.Service.ws = ws;
};

webchat.Service.send = function send( message ){
	if( typeof message !== 'string' ){
		message = JSON.stringify( message );
	}

	webchat.Service.ws.send( message );
};

webchat.Service.callbacks = {};

webchat.Service.callbacks.onOpen = function onOpen( event ){
	//webchat.Service.ws.send( JSON.stringify( { action: "getRecent", count: webchat.Service.recentMessageCount } ) );
};

webchat.Service.callbacks.onClose = function onClose( event ){
	console.log( 'Websocket connection closed: %o', event );
};

webchat.Service.callbacks.onMessage = function onMessage( rawMessage ){
	message = JSON.parse( rawMessage.data );
	
	if( message.Type in webchat.Service.Actions ){
		webchat.Service.Actions[ message.Type ]( message );
	}
};

webchat.Service.callbacks.onError = function onError( event ){
	console.error( 'Websocket error: %o', event );
};






