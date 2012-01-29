webchat.Interface = {};

webchat.Interface.addNewChannel = function addNewChannel( channel ){
	$( '#chatTabContainer' ).append( webchat.templates.chatTab({ channel: channel }) );
	$( webchat.templates.chatTabNav({ channel: channel }) ).insertBefore( '#addChannelTab' );
	$( '.tab-button:last a' ).tab( 'show' );
};

webchat.Interface.activateFirstTab = function activateFirstTab(){
	$( '.tab-button:first' ).addClass( 'active' );
};