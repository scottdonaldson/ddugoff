var $ = require('jquery'),
	body = $('body'),
	navSelector = 'nav a';

function init() {

	// expanding nav
	body.on('click', navSelector, function() {
		$(this).next('.sub-menu').slideToggle();
	});
}

module.exports = init;