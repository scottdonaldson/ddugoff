var $ = require('jquery'),
	pop = $('#pop');

function init() {

	pop.find('.open').click(function() {

		if ( !pop.hasClass('active') ) {
			pop.find('.open').html('&ndash;');
		} else {
			pop.find('.open').text('+');
		}

		pop.toggleClass('active');

	});

}

module.exports = init;