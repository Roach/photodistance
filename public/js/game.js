var user_geo = "";
var closest = "";

$(function() {

	navigator.geolocation.getCurrentPosition(function(position) {
		user_geo = position.coords.latitude + "," + position.coords.longitude;
		load_photos();
	});

	$('#photos').delegate('li', 'click', function() {
		// if ($(this).attr('data-id') == closest) {
		// }
			$("#photos li[data-id=" + closest + "]").addClass("closest");
		  $("#photos li:not(.closest)").animate({
		    opacity: 0.25,
		    top: "+=50"
		  }, 500);
		  $(".label").show(500);
		  $('html, body').animate({
				scrollTop: $(".closest").offset().top
			}, 1000);
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
			$("#photos").append('<li data-id="' + photo.id + '"><p class="label">' + photo.location_name + '<br/>' + photo.distance_string + '</p><img src="' + photo.url + '"/></li>');
		});
	})
	.fail(function() {
		console.log( "error" );
	});
}