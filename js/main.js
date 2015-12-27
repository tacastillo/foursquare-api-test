window.Foursquare = {
	/**
	 * Stores Application Credentials
	 */
	BASE_URL: "https://api.foursquare.com/v2/",
	VERSION: "&v=20151226",
	MEDIUM: "&m=foursquare",

	config: {
		client_id: 	"O2CTKQUPZF00CSVYWVJMEPEMKJ4KQPZ01TSXLHIHLLF2JVPT"
	},

	init: function(options) {
		options = options || {};
		this.config.access_token = options.access_token;
		this.config.coords =  options.coords || {latitude: 37.757815, longitude: -122.5076404};
	},

	explore: function(callback) {
		/* ENDPOINT: https://api.foursquare.com/v2/venues/explore?...=... */
		var coords = this.config.coords;
		var endpoint = this.BASE_URL + '/venues/explore?ll=' 
			+ coords.latitude +',' + coords.longitude 
			+ '&oauth_token=' + this.config.access_token
			+ this.VERSION + this.MEDIUM; 
		this.getJSON(endpoint, callback);
	},

	getJSON: function(url, callback){
		$.ajax({
			type: "GET",
			url: url,
			dataType: "jsonp",
			success: function(res) {
				if (typeof callback === "function")
					callback(res);
			}
		});
	}
};

var userCoords = {longitude: 0, latitude: 0};

function getCoords(callback) {
	if (navigator.geolocation) {
		function error(err) { console.warn('ERROR(' + err.code + '): ' + err.message); }
		function success(pos) {
			userCoords = pos.coords;
			ready();
		}
		// Get the user's current position
		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		alert('Geolocation is not supported in your browser');
	}
}

function printResults(results) {
	var response = results.response;
	var locations = response.groups[0].items;
	locations.forEach(function(place) {
		var venue = place.venue;
		console.log(venue.name);
	});
};

function ready() {
	$(document).ready(function() {
		if (document.URL.indexOf("#access_token=") < 0) {
			$('#container').text("User not authenticated");
		} else {
			var access_token = document.URL.substring(document.URL.indexOf("=")+1);
			$('#container').text("Access Token: " + access_token);

			Foursquare.init({
				access_token: access_token,
				coords: userCoords
			});

			Foursquare.explore(function (results) {
				$('#results').prepend("<h2 id='results-header'>Results</h2>");
				var response = results.response;
				var root_url = "http://www.foursquare.com/v/";
				if (! response) {
					$('#results-header').text("No Results Found");
					return
				}
				var locations = response.groups[0].items;
				locations.forEach(function(place) {
					var venue = place.venue;
					$('#results').append(
						"<a class='collection-item' href='" + root_url + venue.id + "'>" + 
						venue.name + 
						" - " +
						venue.stats.usersCount + 
						"</a>");
				});
			});
		}
	});
}

getCoords(ready);