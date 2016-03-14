var $ = require('jquery'),
	imagesLoaded = require('imagesloaded'),
	waitForFinalEvent = require('../utils/wait'),
	cutoff = require('./components/cutoff');

////////////////////////////////
// DOM Nodes
function jQ(selector) {
	return function() {
		return $(selector);
	};
}

var DOM = {
	win: window,
	body: 'body',
	main: 'main',
	nav: 'nav',
	imagesContainer: '#images',
	images: '.image',
	container: '#container',
	content: '#content',
	returnToTop: '.return-to-top'
};

(function buildDOM() {
	for ( var key in DOM ) {
		DOM[key] = jQ(DOM[key]);
	}
})();

var win = DOM.win(),
	body = DOM.body();

////////////////////////////////
// Components

// Nav
var nav = require('./components/nav')(DOM);

// Gallery
var gallery = require('./components/gallery')(DOM, nav);
gallery.createSlideshow();

if ( body.attr('data-display') !== 'gallery' ) {
	gallery.grabImages();
}

if ( DOM.body().attr('data-display') === 'gallery' ) {
	DOM.body().attr('data-remember', window.location.origin + window.location.pathname);
}

DOM.returnToTop().click(function(){
	$('html, body').animate({
		scrollTop: 0
	}, 1000);
});

body.on( 'mouseover', '.image', gallery.showPrevOrNext );
body.on( 'mouseleave', '.image', gallery.hidePrevOrNext );

win.on('resize', function() {
	waitForFinalEvent(gallery.adjustSlideshow, 500, 'adjustSlideShow');
});

win.keydown(function(e) {
	if (e.keyCode === 37) { gallery.showImage(1); }
	if (e.keyCode === 39) { gallery.showImage(-1); }
});

win.on('resize', function() {
	waitForFinalEvent(nav.showNav, 600, 'showNav');
	waitForFinalEvent(gallery.sizeContainer, 600, 'sizeContainer');
	waitForFinalEvent(gallery.positionContent, 600, 'positionContent');
});

// ----- AJAX & Modal

var ajax = require('./components/ajax')(DOM, gallery);
var modal = require('./components/modal');

ajax.on('navigate', function() {
	if ( ajax.pagesVisited() === 3 ) {
		setTimeout(modal.show, 1500);
	}
});

gallery.on('image', function() {
	if ( gallery.imagesClicked() === 3 ) {
		setTimeout(modal.show, 1500);
	}
});

$(document).ready(function() {
	require('./components/pop')();
});