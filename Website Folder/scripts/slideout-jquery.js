$(document).ready(function() {
	var slideout = new Slideout({
		'panel': document.getElementById('panel'),
		'menu': document.getElementById('menu'),
		'padding': 256,
		'tolerance': 70
	});
	
	$('.toggle-button').on('click', function() {
		slideout.toggle();
	})
})