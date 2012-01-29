webchat.Service.Actions = {};

webchat.Service.Actions.message = function message( message ){
	var i, len;
	if( message.Data.Name === webchat.User.Name ){
		className = 'mine';
	}else{
		className = 'notmine'
	}

	$( '#' + message.Data.Channel + ' .output' ).append(
		'<div class="message ' + className + '">' +
		'<strong>' + message.Data.Name + '</strong>' +
		': ' + message.Data.Text +
		'</div>'
	);
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
	var i, len;
	var userListHTML = '';
	var getUserHTML = function getUserHTML( user ){
		return '<div class="user">' + user + '</div>';
	};

	for( i = 0, len = message.Data.Users.length; i < len; i++ ){
		userListHTML += getUserHTML( message.Data.Users[ i ] );
	}

	$('.chat-info').html( userListHTML );
};

webchat.Service.Actions.getUserList = function getUserList(){
	webchat.Service.send({
		Type: "getUserList",
		Data: {
			ID: webchat.User.ID
		}
	});
};