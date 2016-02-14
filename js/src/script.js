var $ = require('jquery'),
	imagesLoaded = require('imagesloaded');

var win = $(window),
	body = $('body'),
	main = $('main');

var nav = $('nav'),
	imagesContainer = $('#images'),
	images = $('.image'),
	container = $('#container'),
	theContent = $('#content'),
	numImages,
	cutoff,
	returnToTop = $('.return-to-top');

if ( body.attr('data-display') === 'gallery' ) {
	body.attr('data-remember', window.location.origin + window.location.pathname);
}

// expanding nav
nav.on('click', 'a', function() {
	$(this).next('.sub-menu').slideToggle();
});

returnToTop.click(function(){
	$('html, body').animate({
		scrollTop: 0
	}, 1000);
});

// if on a long page, show "return to top"
function maybeShowReturnToTop() {
	if ( body.attr('data-display') === 'gallery' || body.attr('data-display') === 'press' ) {
		returnToTop.fadeIn();
	}
}
maybeShowReturnToTop();

function imageStats() {
	numImages = images.length;
	cutoff = Math.floor(numImages / 2);
}
imageStats();

function createSlideshow() {

	imagesContainer.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

	images.each(function(index){

		var $this = $(this),
			left;

		// adjust height to height of window screen
		$this.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

		// from the 1st image up to about halfway through
		if ( $this.index() <= Math.floor(numImages / 2) ) {
			left = win.width() / 2 + $this.index() * $this.width();
		} else {
			left = win.width() / 2 - ( numImages - $this.index() ) * $this.width();
		}
		$this.css({
			'left': left
		});

		$this.attr('data-showing', $this.index());

		if ( $this.index() === 0 ) {
			sizeContainer();
		}
	});
}

createSlideshow();

function removeSlideshow( callback ) {

	images.each(function(){
		var $this = $(this);
		$this.addClass('preload');
		setTimeout(function(){
			$this.remove();
		}, 210);
	})

	if ( callback ) callback();
}

function createImagesFromData(data, delay) {

	setTimeout(function(){
		data.images.forEach(function(el, index){

			if ( index === 0 ) images = $();

			var image = $('<img src="' + el.image + '" class="image preload">');
			images = images.add(image);

			imageStats();

			if ( index === data.images.length - 1 ) {

				numImages = data.images.length;

				imagesContainer.append(images);

				setTimeout(function(){
					if ( body.attr('data-display') === 'gallery' )
						createSlideshow();

					if ( imagesLoaded([image]) )
						image.removeClass('preload');

					positionContent(function() {
						if ( body.attr('data-display') !== 'gallery' )
							container.removeClass('preload');
					});

					waitForImagesLoaded();
				}, 200);
			}
		});
	}, delay ? delay : 0 );
}

// if not on a gallery page...
function grabImages() {
	var req = new XMLHttpRequest(),
		url = document.getElementById('site-url').innerHTML;

	req.open('GET', url + '?request=content', true);

	req.onload = function() {
		if (req.status >= 200 && req.status < 400) {

			data = JSON.parse( req.responseText );
			body.attr('data-remember', url);
			createImagesFromData(data);
		}
	};
	req.send();
}
if ( body.attr('data-display') !== 'gallery' ) {
	grabImages();
}

function showNav() {
	var showing = $('[data-showing="0"]');
	if ( showing.length > 0 ) {
		nav.css('left', parseInt(showing.css('left'), 10) - showing.width() / 2 - 200).animate({
			opacity: 1
		});
	} else {
		setTimeout(showNav, 10);
	}
}
showNav();

function waitForImagesLoaded() {
	var imgLoad = imagesLoaded('#images');
	imgLoad.on('progress', function( instance, image ){

		image.img.classList.remove('preload');
		createSlideshow();
		showNav();
	});
}
waitForImagesLoaded();

win.on('resize', function(){
	waitForFinalEvent(showNav, 600, 'showNav');
});

function showPrevOrNext() {
	if ( body.attr('data-display') === 'gallery' ) {

		var $this = $(this),
			showing = +$this.attr('data-showing');

		if ( showing >= 1 && showing <= cutoff ) {
			body.addClass('nexting').removeClass('preving');
		} else if ( showing <= numImages - 1 && showing > cutoff ) {
			body.addClass('preving').removeClass('nexting');
		} else {
			hidePrevAndNext();
		}

	} else {
		hidePrevAndNext();
	}
}
function hidePrevAndNext() {
	body.removeClass('nexting preving');
}
body.on( 'mouseover', '.image', showPrevOrNext );

function adjustSlideshow() {

	imagesContainer.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

	images.each(function(){

		var $this = $(this),
			is = +$this.attr('data-showing'),
			left;

		// adjust height to height of window screen
		$this.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

		// from the 1st image up to about halfway through
		left = is <= cutoff ?
			win.width() / 2 + is * $this.width() :
			win.width() / 2 - ( numImages - is ) * $this.width();

		$this.css({
			'left': left
		});

	});
}

win.on('resize', function(){
	waitForFinalEvent(adjustSlideshow, 500, 'adjustSlideShow');
});

function showImage(n) { // n an integer

	hidePrevAndNext();

	if ( body.attr('data-display') === 'gallery' ) {

		images.each(function() {

			var $this = $(this),
				was = +$this.attr('data-showing'),
				is = (was + n + numImages) % numImages,
				left;

			// from the 1st image up to about halfway through
			if ( is <= cutoff ) {
				left = win.width() / 2 + is * $this.width();
			} else {
				left = win.width() / 2 - ( numImages - is ) * $this.width();
			}

			// hide the one that's going to be zooming all the way across
			if ( ( was <= cutoff && is > cutoff && n > 0 ) ||
				 ( was > cutoff && is <= cutoff && n < 0 ) ) {
				$this.hide();
			}

			$this.animate({
				'left': left
			}, 600, function(){
				// after animation has completed, show it again
				if ( ( was <= cutoff && is > cutoff && n > 0 ) ||
					 ( was > cutoff && is <= cutoff && n < 0 ) ) {
					$this.show();
				}
			});

			$this.attr('data-showing', is);
		});
	}
}

body.on('click', '.image', function(){

	var $this = $(this),
		is = +$this.attr('data-showing');

	// If not on the current one and <= the cutoff,
	// go in the opposite dir of the data-showing attr...
	// otherwise go the difference between number of images
	// and the data-showing attr
	showImage( is !== 0 && is <= cutoff ? -is : numImages - is );
});

win.keydown(function(e){
	if (e.keyCode === 37) { showImage(1); }
	if (e.keyCode === 39) { showImage(-1); }
});

// ----- AJAX

var links = $('a');

(function identifyLinks() {
	links = $('a');
	links.each(function(){
		if ( this.href.indexOf( location.origin ) > -1 && this.href.slice(-1) !== '#' ) {
			this.href = this.href.replace('?request=content', '') + '?request=content';
		}
	})
})();

function sizeContainer() {
	var showing = $('[data-showing="0"]');
	if ( showing.length > 0 ) {
		container.css({
			left: parseInt(showing.css('left'), 10),
			'min-height': !body.hasClass('admin-bar') ? win.height() : win.height() - 32,
			width: showing.width() + 2
		});
	} else {
		setTimeout(sizeContainer, 10);
	}
}
sizeContainer();

function positionContent(callback) {
	var content = $('#content'),
		winHeight = !body.hasClass('admin-bar') ? win.height() : win.height() - 32;
	if ( content.length > 0 ) {
		content.css('top', content.height() < winHeight ? ( winHeight - content.height() ) / 3 : 0 );
	}
	setTimeout(positionContent, 10);

	if ( callback ) { callback(); }
}

win.on('resize', function(){
	waitForFinalEvent(sizeContainer, 600, 'sizeContainer');
	waitForFinalEvent(positionContent, 600, 'positionContent');
});

function handleContent( data, url ) {

	// hide the "return to top" (will fade it in if on a long page)
	returnToTop.hide();

	var content = '',
		display,
		contentDelay = 0;

	// Going to a gallery page
	if ( data.is_gallery ) {

		display = 'gallery';

		// fade out container
		container.addClass('preload');

		// Do we remember this one from before?
		if ( body.attr('data-remember') !== url ) {

			body.attr('data-remember', url);

			removeSlideshow(function(){

				createImagesFromData(data, 500);

			});

			contentDelay = 500;
		}

	// Regular ol' page
	} else if ( !data.is_press ) {

		display = 'content';

		content = data.content;

	// Press page
	} else if ( data.is_press ) {

		display = 'press';

		var clippings = data.clipping;
		clippings.forEach(function(clipping){
			content += '<p class="uppercase">' + clipping.link + '</p>';
			content += '<img src="' + clipping.image + '">';
		});
	}

	if ( !data.is_gallery ) {

		setTimeout(function(){
			theContent.animate({
				opacity: 0
			});

		}, contentDelay);
	}

	setTimeout(function(){
		theContent.html( content );

		positionContent(function(){
			theContent.animate({
				opacity: 1
			});
			container.removeClass('preload');
		});

		maybeShowReturnToTop();

	}, 500 + contentDelay);

	body.attr('data-display', display);

}

function ajaxLoad(e) {

	var $this = $(this),
		url = this.href;

	// don't do anything if we click on a link to the current page
	if ( window.location.origin + window.location.pathname === url.replace('?request=content', '') ) {
		return e.preventDefault();
	}

	if ( this.href.slice(-1) === '#' ) {
		$this.closest('li').addClass('current-menu-item');
	}

	// make sure it's an internal link and that we're AJAXing
	if ( url.indexOf( location.origin ) > -1 && url.indexOf('?request=content') > -1 ) {

		e.preventDefault();

		// show current menu item
		nav.find('.current-menu-item').removeClass('current-menu-item');
		nav.find('[href="' + url + '"]').parent().addClass('current-menu-item')
			.closest('.sub-menu').prev().parent().addClass('current-menu-item');

		// remove ?request=content from the URL
		url = url.replace('?request=content', '');

		var req = new XMLHttpRequest();
		req.open('GET', this.href, true);

		req.onload = function() {
			if (req.status >= 200 && req.status < 400) {

				data = JSON.parse( req.responseText );
				handleContent(data, url);

				var title = data.title + ' | ' + 'DDUGOFF';
				window.history.pushState({}, title, url);
				document.title = title;
			}
		};

		req.send();

	}
}

links.click(ajaxLoad);
