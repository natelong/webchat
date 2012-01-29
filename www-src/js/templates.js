// This file was automatically generated from chat.soy.
// Please don't edit this file by hand.

if (typeof webchat == 'undefined') { var webchat = {}; }
if (typeof webchat.templates == 'undefined') { webchat.templates = {}; }


webchat.templates.chatTab = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="tab-pane" id="', soy.$$escapeHtml(opt_data.channel), '"><div class="row"><div class="span9"><div class="output-wrapper"><div class="', soy.$$escapeHtml(opt_data.channel), ' output"><!></div></div></div><div class="span3"><h3>Channel Info</h3><h4>Users</h4><div class="chat-info">Waiting to initialize</div></div></div></div>');
  return opt_sb ? '' : output.toString();
};


webchat.templates.chatTabNav = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<li class="tab-button"><a href="#', soy.$$escapeHtml(opt_data.channel), '" data-toggle="tab">', soy.$$escapeHtml(opt_data.channel), '</a></li>');
  return opt_sb ? '' : output.toString();
};
