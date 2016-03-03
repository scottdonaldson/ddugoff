var $ = require('jquery'),
	modalSelector = '#modal',
	modalShadow = $('<div class="modal-shadow">').hide(),
	cookies = require('browser-cookies');

var modalIsFading = false;

modalShadow.on('click', hide);

function hide() {
	if ( !modalIsFading ) {
		cookies.set('ddugoff_modal', 'hidden', { expires: 30 });
		$(modalSelector).fadeOut(function() {
			modalShadow.fadeOut(modalShadow.detach);
		});
	}
}

function show() {
	// if ( !cookies.get('ddugoff_modal') ) {
		modalIsFading = true;
		$(modalSelector).before( modalShadow.fadeIn(function(){ 
			$(modalSelector).fadeIn(() => modalIsFading = false);
		}) );
	// }
}

module.exports = {
	isActive: () => $(modalSelector).is(':visible'),
	show,
	hide
};