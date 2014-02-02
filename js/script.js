(function($){

	var win = $(window),
		body = $('body'),
		header = $('header'),
		footer = $('footer');

	var imagesContainer = $('#images'),
		images,
		prev = $('.prev'),
		next = $('.next');
	function resizeImageContainer() {

		// Set height of container
		imagesContainer.height( win.height() - header.outerHeight() - footer.outerHeight() );

		// Find the visible image and position it
		var visible = imagesContainer.find('img:visible');

		// If no images are visible, then the page has just loaded and we choose the first image
		if ( visible.length === 0 ) {
			visible = imagesContainer.find('img:first').fadeIn(500);
		}
		visible.css({
			left: ( imagesContainer.width() - visible.width() ) / 2,
			top: ( imagesContainer.height() - visible.height() ) / 2 > 0 ? ( imagesContainer.height() - visible.height() ) / 2 : 0
		});

		prev.css({
			left: ( imagesContainer.width() - visible.width() ) / 2 - ( prev.width() + 10 )
		});
		next.css({
			left: ( imagesContainer.width() + visible.width() ) / 2 + ( next.width() + 10 )
		});
	}
	imagesContainer.find('img').first().load(resizeImageContainer);
	win.on( 'load resize', resizeImageContainer );

	var isFading = false;

	function fadeImages( current, target ) {
		if ( !isFading ) {

			isFading = true;

			current.fadeOut(500);
			target.fadeIn(500).css({
				left: ( imagesContainer.width() - target.width() ) / 2,
				top: ( imagesContainer.height() - target.height() ) / 2 > 0 ? ( imagesContainer.height() - target.height() ) / 2 : 0
			});

			setTimeout(function(){
				isFading = false;
			}, 500);
		}
	}

	function showNextImage() {
		var current = imagesContainer.find('img:visible'),
			target = current.next('img').length > 0 ? current.next('img') : imagesContainer.find('img').first();
		fadeImages( current, target );
	}

	function showPrevImage() {
		var current = imagesContainer.find('img:visible'),
			target = current.prev('img').length > 0 ? current.prev('img') : imagesContainer.find('img').last();
		fadeImages( current, target );
	}

	imagesContainer.find('img').click( showNextImage );
	next.click( showNextImage );
	prev.click( showPrevImage );
	win.keydown(function(e){
		if (e.keyCode === 37) { showPrevImage(); }
		if (e.keyCode === 39) { showNextImage(); }
	});

})(jQuery);