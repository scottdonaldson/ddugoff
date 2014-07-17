(function($){

	var win = $(window),
		body = $('body');

	var nav = $('nav'),
		imagesContainer = $('#images'),
		images = $('.image'),
		numImages = images.length,
		cutoff = Math.floor(numImages / 2);

	function createSlideshow() {
		images.each(function(){
			
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
		});
	}

	createSlideshow();

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

	var imgLoad = imagesLoaded('#images');
	imgLoad.on('progress', function( instance, image ){
		
		image.img.classList.remove('preload');
		createSlideshow();
		showNav();
	});

	win.on('resize', function(){
		waitForFinalEvent(showNav, 600, 'showNav');
	});

	function showPrevOrNext() {
		var $this = $(this),
			showing = +$this.attr('data-showing');

		if ( showing >= 1 && showing <= cutoff ) {
			$this.addClass('nexting');
		} else if ( showing <= numImages - 1 && showing > cutoff ) {
			$this.addClass('preving');
		} else {
			hidePrevAndNext();
		}
	}
	function hidePrevAndNext() {
		$('.nexting, .preving').removeClass('nexting preving');
	}
	images.on( 'mouseover', showPrevOrNext );

	function adjustSlideshow() {
		images.each(function(){

			var $this = $(this),
				is = +$this.attr('data-showing'),
				left;

			// adjust height to height of window screen
			$this.height( body.hasClass('admin-bar') ? win.height() - 32 : win.height() );

			// from the 1st image up to about halfway through
			if ( is <= cutoff ) { 
				left = win.width() / 2 + is * $this.width();
			} else {
				left = win.width() / 2 - ( numImages - is ) * $this.width();
			}
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

	images.click(function(){
		var $this = $(this),
			is = +$this.attr('data-showing');
		if ( is !== 0 && is <= cutoff ) {
			showImage( -is );
		} else if ( is > cutoff ) {
			showImage( numImages - is );
		}
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
			if ( this.href.indexOf( location.origin ) > -1 && this.getAttribute('rel') !== 'home' ) {
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
				'min-height': win.height(),
				width: showing.width()
			});
		}
	}

	win.on('resize', function(){
		waitForFinalEvent(sizeContainer, 600, 'sizeContainer');
	});

	function sizeAndInsertContent() {
		sizeContainer();
		container.appendTo(body).fadeIn();
	}

	function handleContent( data ) {

		var content = '';

		if ( !data.is_press ) {
			content = data.content;
		} else {
			var clippings = data.clipping;
			clippings.forEach(function(clipping){
				content += '<div class="uppercase">' + clipping.link + '</div>';
				content += '<img src="' + clipping.image + '">';
			});
		}

		if ( container.length > 0 ) {

			var theContent = $('#content');
			theContent.fadeOut(function(){
				theContent.remove();
			});

			setTimeout(function(){
				container.html( '<div id="content" style="display: none;">' + content + '</div>' );
				$('#content').fadeIn();
			}, 250);
			

		} else {
			container = $('<div id="container">');
			container.html( '<div id="content">' + content + '</div>' ).hide();
			sizeAndInsertContent();
		}

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