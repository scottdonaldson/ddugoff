var $ = require('jquery'),
	navSelector = 'nav a';

function init(DOM) {

	function showNav() {
		var showing = $('[data-showing="0"]');
		if ( showing.length > 0 ) {
			DOM.nav().css('left', parseInt(showing.css('left'), 10) - showing.width() / 2 - 200).animate({
				opacity: 1
			});
		} else {
			setTimeout(showNav, 10);
		}
	}

	showNav();

	// expanding nav
	DOM.body().on('click', navSelector, function() {
		$(this).next('.sub-menu').slideToggle();
	});

	return {
		showNav
	}
}

module.exports = init;