var $ = require('jquery'),
	imagesLoaded = require('imagesloaded'),
	cutoff = require('./cutoff');

function init(DOM, nav) {

	var win = DOM.win(),
		body = DOM.body(),	
		isAdmin = body.hasClass('admin-bar'),
		winHeight = function() {
			return isAdmin ? win.height() - 32 : win.height();
		};

	function waitForImagesLoaded() {
		var imgLoad = imagesLoaded('#images');
		imgLoad.on('progress', function( instance, image ){

			image.img.classList.remove('preload');
			createSlideshow();
			nav.showNav();
		});
	}

	// if not on a gallery page...
	function grabImages() {
		var url = $('#site-url').html() + '?request=content';
		$.ajax({
			url,
			success: function(data) {
				body.attr('data-remember', url);
				createImagesFromData(data);
			}
		});
	}

	function createImagesFromData(data, delay) {

		var images;

		setTimeout(function() {

			data.images.forEach(function(el, index) {

				if ( index === 0 ) images = $();

				var image = $('<img src="' + el.image + '" class="image preload">');
				images = images.add(image);

				if ( index === data.images.length - 1 ) {

					DOM.imagesContainer().append(images);

					setTimeout(function(){
						if ( body.attr('data-display') === 'gallery' )
							createSlideshow();

						if ( imagesLoaded([image]) )
							image.removeClass('preload');

						positionContent(function() {
							if ( body.attr('data-display') !== 'gallery' )
								DOM.container().removeClass('preload');
						});

						waitForImagesLoaded();
					}, 200);
				}
			});
		}, delay ? delay : 0 );
	}

	function showImage(n) { // n an integer

		hidePrevAndNext();

		var images = DOM.images(),
			cut = cutoff(images);

		if ( body.attr('data-display') === 'gallery' ) {

			images.each(function() {

				var $this = $(this),
					was = +$this.attr('data-showing'),
					is = (was + n + images.length) % images.length,
					left;

				// from the 1st image up to about halfway through
				if ( is <= cut ) {
					left = win.width() / 2 + is * $this.width();
				} else {
					left = win.width() / 2 - ( images.length - is ) * $this.width();
				}

				// hide the one that's going to be zooming all the way across
				if ( ( was <= cut && is > cut && n > 0 ) ||
					 ( was > cut && is <= cut && n < 0 ) ) {
					$this.hide();
				}

				$this.animate({
					'left': left
				}, 600, function(){
					// after animation has completed, show it again
					if ( ( was <= cut && is > cut && n > 0 ) ||
						 ( was > cut && is <= cut && n < 0 ) ) {
						$this.show();
					}
				});

				$this.attr('data-showing', is);
			});
		}
	}

	function positionContent(callback) {

		var content = DOM.content();

		if ( content.length > 0 ) {
			content.css('top', content.height() < winHeight() ? ( winHeight() - content.height() ) / 3 : 0 );
		}

		if ( callback ) { callback(); }
	}

	function createSlideshow() {

		DOM.imagesContainer().height( winHeight() );

		var images = DOM.images();

		images.each(function (i) {

			var $this = $(this),
				left;

			// adjust height to height of window screen
			$this.height( winHeight() );

			// from the 1st image up to about halfway through
			if ( i <= cutoff(images) ) {
				left = win.width() / 2 + i * $this.width();
			} else {
				left = win.width() / 2 - ( images.length - i ) * $this.width();
			}

			$this.css({
				'left': left
			});

			$this.attr('data-showing', i);

			if ( i === 0 ) sizeContainer();
		});
	}

	function adjustSlideshow() {

		DOM.imagesContainer().height(winHeight());

		var images = DOM.images();

		images.each(function() {

			var $this = $(this),
				is = +$this.attr('data-showing'),
				left;

			// adjust height to height of window screen
			$this.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

			// from the 1st image up to about halfway through
			left = is <= cutoff(images) ?
				win.width() / 2 + is * $this.width() :
				win.width() / 2 - ( images.length - is ) * $this.width();

			$this.css({
				'left': left
			});

		});
	}

	function removeSlideshow( callback ) {

		DOM.images().each(function(){
			var $this = $(this);
			$this.addClass('preload');
			setTimeout(function() {
				$this.remove() 
			}, 210);
		});

		if ( callback ) callback();
	}

	function sizeContainer() {
		var showing = $('[data-showing="0"]');
		if ( showing.length > 0 ) {
			DOM.container().css({
				left: parseInt(showing.css('left'), 10),
				'min-height': winHeight(),
				width: showing.width() + 2
			});
		} else {
			setTimeout(sizeContainer, 10);
		}
	}

	function showPrevOrNext() {
		if ( body.attr('data-display') === 'gallery' ) {

			var $this = $(this),
				images = DOM.images(),
				cut = cutoff(images),
				showing = +$this.attr('data-showing');

			if ( showing >= 1 && showing <= cut ) {
				body.addClass('nexting').removeClass('preving');
			} else if ( showing <= images.length - 1 && showing > cut ) {
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

	waitForImagesLoaded();

	return {
		grabImages,
		createImagesFromData,
		showImage,
		positionContent,
		createSlideshow,
		adjustSlideshow,
		removeSlideshow,
		sizeContainer,
		showPrevOrNext,
		hidePrevAndNext
	};
}

module.exports = init;