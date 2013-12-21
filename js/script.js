(function($){

	var win = $(window),
		body = $('body'),
		header = $('header'),
		footer = $('footer');

	var imagesContainer = $('#images'),
		images;
	function resizeImageContainer() {

		// Set height of container
		imagesContainer.height( win.height() - header.outerHeight() - footer.outerHeight() );

		// Find the visible image and position it
		var visible = imagesContainer.find('img:visible');

		// If no images are visible, then the page has just loaded and we choose the first image
		if ( visible.length === 0 ) {
			visible = imagesContainer.find('img:first').fadeIn(100);
		}
		visible.css({
			left: ( imagesContainer.width() - visible.width() ) / 2,
			top: ( imagesContainer.height() - visible.height() ) / 2 > 0 ? ( imagesContainer.height() - visible.height() ) / 2 : 0
		});
	}
	win.on( 'load resize', resizeImageContainer );

	function showNextImage() {
		var target = imagesContainer.find('img:visible').next().length > 0 ? imagesContainer.find('img:visible').next() : imagesContainer.find('img').first();
		$(this).fadeOut(100);
		target.fadeIn(100).css({
			left: ( imagesContainer.width() - target.width() ) / 2,
			top: ( imagesContainer.height() - target.height() ) / 2 > 0 ? ( imagesContainer.height() - target.height() ) / 2 : 0
		});
	}

	imagesContainer.find('img').click(showNextImage);

	win.load(function() {
		$('.preload').removeClass('preload');
	});

})(jQuery);