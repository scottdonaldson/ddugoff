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

win.on('resize', function() {
	waitForFinalEvent(gallery.adjustSlideshow, 500, 'adjustSlideShow');
});

body.on('click', '.image', function(){

	var $this = $(this),
		images = DOM.images(),
		is = +$this.attr('data-showing');

	// If not on the current one and <= the cutoff,
	// go in the opposite dir of the data-showing attr...
	// otherwise go the difference between number of images
	// and the data-showing attr
	gallery.showImage( is !== 0 && is <= cutoff(images) ? -is : images.length - is );
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

// ----- AJAX

var ajax = require('./components/ajax')(DOM, gallery);