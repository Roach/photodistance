var user_geo = "";

$(function() {

	navigator.geolocation.getCurrentPosition(function(position) {
		user_geo = position.coords.latitude + "," + position.coords.longitude;
		load_photos();
	});

	$('#photos').delegate('img', 'click', function() {
		console.log(user_geo);
		console.log($(this).data("geo-lat"));
	});
});

var load_photos = function() {
$.ajax({
  url: "getphotos.json",
  data: { location: user_geo }
})
	.done(function(res) {
		photos = JSON.parse(res)
		photos.forEach(function(photo) {
			$("#photos").append('<img src="' + photo.url + '" data-geo-lat="' + photo.geo.latitude + '" data-geo-lng="' + photo.geo.longitude + '"/>');
		});
	})
	.fail(function() {
		console.log( "error" );
	});
}