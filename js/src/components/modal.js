var $ = require('jquery'),
	modalSelector = '#modal',
	modalShadow = $('<div class="modal-shadow">').hide(),
	form = $(modalSelector).find('form'),
	cookies = require('browser-cookies');

var modalIsFading = false,
	displayType = null;

function hide() {

	var expireTimes = {
		initial: 365,
		navigate: 1,
		gallery: 1
	};

	if ( !modalIsFading ) {

		// set cookie for this display type
		cookies.set('ddugoff_modal_' + displayType, 'hidden', { expires: expireTimes[displayType] });

		// for initial show, also set a session cookie so that navigate/gallery
		// does not show it in this session
		if ( displayType === 'initial' ) {
			cookies.set('ddugoff_modal_session', 'hidden', { expires: 0.001 });
		}

		$(modalSelector).fadeOut(function() {

			modalShadow.fadeOut(modalShadow.detach);
		});
	}
}

function show(type) {

	displayType = type;

	// default to display the modal
	var conditions = true;

	// if user has submitted their email, never show
	if ( cookies.get('ddugoff_email') ) return;

	if ( type === 'initial' ) {

		// on the initial show attempt, exclude those who have
		// recently hidden off of an initial show
		if ( cookies.get('ddugoff_modal_initial') ) return;

	} else if ( type === 'navigate' || type === 'gallery' ) {

		if ( cookies.get('ddugoff_modal_session') || cookies.get('ddugoff_modal_navigate') || cookies.get('ddugoff_modal_gallery') ) return;

	}

	modalIsFading = true;

	$(modalSelector).before( modalShadow.fadeIn(function() { 

		$(modalSelector).fadeIn(() => modalIsFading = false);

	}) );
}

function submit(e) {

	if ( !cookies.get('ddugoff_email') ) {

		e.preventDefault();

		// user has submitted email, that's great -- set a cookie so they
		// don't see it for 10 LONG YEARS
		cookies.set('ddugoff_email', 'submitted', { expires: 365 * 10 });

		// now actually submit the form
		form.submit();

	}
}

// click shadow to hide modal
modalShadow.on('click', hide);

// also press ESC to hide modal
$(window).on('keydown', e => e.keyCode === 27 ? hide() : null);

// overwrite form submit handler
form.on('submit', submit);

module.exports = {
	isActive: () => $(modalSelector).is(':visible'),
	show,
	hide
};