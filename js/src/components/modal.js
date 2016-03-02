var $ = require('jquery'),
	modalSelector = '#modal',
	modalShadow = $('<div class="modal-shadow">').hide();

modalShadow.on('click', hide);

function hide() {
	$(modalSelector).fadeOut(function() {
		modalShadow.fadeOut(modalShadow.detach);
	});
}

function show() {
	$(modalSelector).before( modalShadow.fadeIn(function(){ 
			$(modalSelector).fadeIn();
		}) );
}

module.exports = {
	isActive: () => $(modalSelector).is(':visible'),
	show,
	hide
};