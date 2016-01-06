var user_geo = "";
var closest = "";

$(function() {

	navigator.geolocation.getCurrentPosition(function(position) {
		user_geo = position.coords.latitude + "," + position.coords.longitude;
		load_photos();
	});

	$('#photos').delegate('img', 'click', function() {
		console.log(closest);
	});
});

var load_photos = function() {
$.ajax({
  url: "getphotos.json",
  data: { location: user_geo }
})
	.done(function(res) {
		var json = JSON.parse(res);
		closest = json["closest"];
		var photos = json["photos"];
		photos.forEach(function(photo) {
			$("#photos").append('<li><img data-id="' + photo.id + '" src="' + photo.url + '"/><br/><p class="hidden">' + photo.location_name + '</p></li>');
		});
	})
	.fail(function() {
		console.log( "error" );
	});
}