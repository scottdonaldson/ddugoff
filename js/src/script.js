(function($){

	var win = $(window),
		body = $('body'),
		main = $('main');

	var nav = $('nav'),
		imagesContainer = $('#images'),
		images = $('.image'),
		numImages = images.length,
		cutoff = Math.floor(numImages / 2);

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

			if ( $this.index() === 0 && !body.hasClass('page-template-pagesgallery-php') ) {
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

	function createImagesFromData(data) {

		data.images.forEach(function(el, index){

			if ( index === 0 ) images = $();

			var image = $('<img src="' + el.image + '" class="image preload">');
			images = images.add(image);

			if ( index === data.images.length - 1 ) {

				numImages = data.images.length;

				// create an images container if there is not one
				if ( imagesContainer.length === 0 ) {
					imagesContainer = $('<div id="images">');
					imagesContainer.prependTo(main);
				}

				imagesContainer.append(images);
				
				setTimeout(function(){
					if ( body.attr('data-display') === 'gallery' ) createSlideshow();

					if ( imagesLoaded([image]) ) {
						image.removeClass('preload');
					}

					positionContent(function(){
						if ( body.attr('data-display') !== 'gallery' ) {
							container.removeClass('preload');
						} else {
							// container.addClass('preload');
						}
					});

					waitForImagesLoaded();
				}, 200);
			}
		});
	}

	// if not on a gallery page...
	function grabImages() {
		var req = new XMLHttpRequest();
		req.open('GET', document.getElementById('site-url').innerHTML + '?request=content', true);

		req.onload = function() {
			if (req.status >= 200 && req.status < 400) {
				
				data = JSON.parse( req.responseText );
				
				createImagesFromData(data);
			}
		};
		req.send();
	}
	if ( !body.hasClass('page-template-pagesgallery-php') ) {
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
		if ( container.length === 0 ) {

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
	images.on( 'mouseover', showPrevOrNext );

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

		if ( container.length === 0 ) {

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

	images.click(function(){

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

	var links = $('a'),
		container = $('#container');

	function identifyLinks() {
		links = $('a');
		links.each(function(){
			if ( this.href.indexOf( location.origin ) > -1 && 
				this.getAttribute('rel') !== 'home' ) {

				this.href = this.href.replace('?request=content', '') + '?request=content';
			}
		})
	}
	identifyLinks();

	function sizeContainer() {
		var showing = $('[data-showing="0"]');
		if ( showing.length > 0 ) {
			container.css({
				left: parseInt(showing.css('left'), 10),
				'min-height': !body.hasClass('admin-bar') ? win.height() : win.height() - 32,
				width: showing.width() + 2
			});
		}
	}

	function centerContent(content, winHeight) {
		content.css('top', ( winHeight - content.height() ) / 3 );
	}

	function positionContent(callback) {
		var content = $('#content'),
			winHeight = !body.hasClass('admin-bar') ? win.height() : win.height() - 32;
		if ( content.length > 0 && content.height() < winHeight ) {
			centerContent(content, winHeight);
		} else if ( content.height() >= winHeight ) {
			content.css('top', 0);
		}
		setTimeout(positionContent, 10);

		if (callback) { callback(); }
	}

	win.on('resize', function(){
		waitForFinalEvent(sizeContainer, 600, 'sizeContainer');
		waitForFinalEvent(positionContent, 600, 'positionContent');
	});

	function sizeAndInsertContainer() {
		sizeContainer();
		container.prependTo(main).fadeIn();
		positionContent();
	}

	function removeContent() {
		var theContent = $('#content');
		theContent.fadeOut(function(){
			theContent.remove();
		});
	}

	function handleContent( data ) {

		var content = '',
			display;

		// Gallery page
		if ( data.is_gallery ) {

			display = 'gallery';

			removeSlideshow(function(){
				
				if ( container.length > 0 ) removeContent();

				createImagesFromData(data);

			});

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

		if ( container.length > 0 ) {

			removeContent();
			setTimeout(function(){
				container.html( '<div id="content" style="display: none;">' + content + '</div>' );
				positionContent();
				body.removeClass('page-template-pagesgallery-php');
				$('#content').fadeIn();
			}, 250);
			

		} else {
			container = $('<div id="container">');
			container.html( '<div id="content">' + content + '</div>' ).hide();
			sizeAndInsertContainer();
		}

		body.attr('data-display', display);

	}

	function ajaxLoad(e) {

		var _this = this;

		if ( this.href.indexOf( location.origin ) > -1 && this.href.indexOf('?request=content') > -1 ) {

			e.preventDefault();

			var req = new XMLHttpRequest();
			req.open('GET', this.href, true);

			req.onload = function() {
				if (req.status >= 200 && req.status < 400) {
					
					data = JSON.parse( req.responseText );
					handleContent(data);

					var title = data.title + ' | ' + 'DDUGOFF',
						url = _this.href.replace('?request=content', '');
					window.history.pushState({}, title, url);
					document.title = title;
				}
			};

			req.send();

		}
	}

	links.click(ajaxLoad);

})(jQuery);