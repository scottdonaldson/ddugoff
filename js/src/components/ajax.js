var $ = require('jquery');

function init( DOM, gallery ) {

	var evts = {},
		pages = 1; // pages visited this session

	var body = DOM.body();

	// if on a long page, show "return to top"
	function maybeShowReturnToTop() {
		if ( body.attr('data-display') === 'gallery' || body.attr('data-display') === 'press' ) {
			DOM.returnToTop().fadeIn();
		}
	}

	function handleContent( data, url ) {

		// hide the "return to top" (will fade it in if on a long page)
		DOM.returnToTop().hide();

		var theContent = DOM.content(),
			content = '',
			display,
			contentDelay = 0;

		// Going to a gallery page
		if ( data.is_gallery ) {

			display = 'gallery';

			// fade out container
			DOM.container().addClass('preload');

			// Do we remember this one from before?
			if ( body.attr('data-remember') !== url ) {

				body.attr('data-remember', url);

				gallery.removeSlideshow( gallery.createImagesFromData.bind(null, data, 500) );

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

			gallery.positionContent(function(){
				theContent.animate({
					opacity: 1
				});
				DOM.container().removeClass('preload');
			});

			maybeShowReturnToTop();

		}, 500 + contentDelay);

		body.attr('data-display', display);

	}

	function ajaxLoad(e) {

		var $this = $(this),
			url = this.href,
			nav = DOM.nav();

		// don't do anything if we click on a link to the current page
		if ( window.location.origin + window.location.pathname === url.replace('?request=content', '') ) {
			return e.preventDefault();
		}

		if ( url.slice(-1) === '#' ) {
			$this.closest('li').addClass('current-menu-item');
		}

		// make sure it's an internal link and that we're AJAXing
		if ( url.indexOf( location.origin ) > -1 ) {

			e.preventDefault();

			url = url.replace('?request=content', '') + '?request=content';

			// show current menu item
			nav.find('.current-menu-item').removeClass('current-menu-item');
			nav.find('[href="' + url + '"]').parent().addClass('current-menu-item')
				.closest('.sub-menu').prev().parent().addClass('current-menu-item');

			$.ajax({
				url,
				success: function(data) {
					handleContent(data, url);

					var title = data.title + ' | ' + 'DDUGOFF';
					window.history.pushState({}, title, url.replace('?request=content', ''));
					document.title = title;

					pages++;

					if ( evts.navigate ) evts.navigate();
				}
			});
		}
	}

	body.on('click', 'a', ajaxLoad);
	maybeShowReturnToTop();

	function pagesVisited() {
		return pages;
	}

	function on(evt, cb) {
		evts[evt] = cb;
	}

	return {
		pagesVisited,
		on
	};
}

module.exports = init;