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
		console.log(res)
		json = JSON.parse(res)
		console.log(json)
		photos = json["photos"]
		console.log(photos)
		photos.forEach(function(photo) {
			$("#photos").append('<li><img data-id="' + photo.id + '" src="' + photo.url + '"/><br/><p class="hidden">' + photo.location_name + '</p></li>');
		});
	})
	.fail(function() {
		console.log( "error" );
	});
}