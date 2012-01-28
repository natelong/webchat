webchat.Service.Actions = {};

webchat.Service.Actions.message = function message( message ){
	if( message.Data.Name === webchat.User.Name ){
		className = 'mine';
	}else{
		className = 'notmine'
	}
	var output = document.querySelector( '.output' )
	output.innerHTML +=
		'<div class="message ' + className + '">' +
		'<strong>' + message.Data.Name + '</strong>' +
		': ' + message.Data.Text +
		'</div>';
};

webchat.Service.Actions.start = function start( message ){
	webchat.User.ID = message.Data.ID;
	webchat.Service.send({
		Type: "acknowledgeStart",
		Data: {
			ID: webchat.User.ID,
			Name: webchat.User.Name,
			Channels: webchat.User.Channels
		}
	});
};

webchat.Service.Actions.userList = function userList( message ){
	console.log( 'User List: %o', message );

	var i, len;
	var userListHTML = '';
	var getUserHTML = function getUserHTML( user ){
		return '<div class="user">' + user + '</div>';
	};

	for( i = 0, len = message.Data.Users.length; i < len; i++ ){
		userListHTML += getUserHTML( message.Data.Users[ i ] );
	}

	document.querySelector( '#chatInfo' ).innerHTML = userListHTML;
};