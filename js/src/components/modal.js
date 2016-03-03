var $ = require('jquery'),
	modalSelector = '#modal',
	modalShadow = $('<div class="modal-shadow">').hide(),
	cookies = require('browser-cookies');

modalShadow.on('click', hide);

function hide() {
	cookies.set('ddugoff_modal', 'hidden', { expires: 30 });
	$(modalSelector).fadeOut(function() {
		modalShadow.fadeOut(modalShadow.detach);
	});
}

function show() {
	// if ( !cookies.get('ddugoff_modal') ) {
		$(modalSelector).before( modalShadow.fadeIn(function(){ 
			$(modalSelector).fadeIn();
		}) );
	// }
}

module.exports = {
	isActive: () => $(modalSelector).is(':visible'),
	show,
	hide
};