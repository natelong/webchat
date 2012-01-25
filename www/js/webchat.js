var webchat = {};

webchat.Service = {};

webchat.Service.url = 'ws://' + window.location.host + '/event';
webchat.Service.recentMessageCount = 25;

webchat.Service.init = function init(){
	var ws = new WebSocket( webchat.Service.url );

	ws.addEventListener( 'close', webchat.Service.callbacks.onClose );
	ws.addEventListener( 'error', webchat.Service.callbacks.onError )
	ws.addEventListener( 'open', webchat.Service.callbacks.onOpen );
	ws.addEventListener( 'message', webchat.Service.callbacks.onMessage );

	webchat.Service.ws = ws;
};

webchat.Service.callbacks = {};

webchat.Service.callbacks.onOpen = function onOpen( event ){
	//webchat.Service.ws.send( JSON.stringify( { action: "getRecent", count: webchat.Service.recentMessageCount } ) );
};

webchat.Service.callbacks.onClose = function onClose( event ){
	console.log( 'Websocket connection closed: %o', event );
};

webchat.Service.callbacks.onMessage = function onMessage( message ){
	if( message.data ){
		var response = JSON.parse( message.data );
		var className = 'notmine';
	}else{
		var className = 'mine';
		var response = message;
	}

	if( response.type === 'message' ){
		var output = document.querySelector( '.output' )
		output.innerHTML += '<div class="message ' + className + '">' + response.text + '</div>';
	}else{
		console.log( response );
	}
};

webchat.Service.callbacks.onError = function onError( event ){
	console.error( 'Websocket error: %o', event );
};

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
