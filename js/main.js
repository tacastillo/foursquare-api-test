window.Instagram = {
	/**
	 * Stores Application Credentials
	 */
	config: {
		client_id: 	"d056411e9a32439193811e9b33e9e20e"
	},

	init: function(options) {
		options = options || {};
		this.config.access_token = options.access_token;
	},


}

$(document).ready(function() {
	$('#container').text("This is bull");
});