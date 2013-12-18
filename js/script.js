(function($){

	var win = $(window),
		body = $('body'),
		header = $('header'),
		footer = $('footer');

	var imagesContainer = $('#images');
	function resizeImageContainer() {
		// Find the visible image and give it a negative left margin
		var visible = imagesContainer.find('img:visible');

		if ( visible.length === 0 ) {
			visible = imagesContainer.find('img:first').css('display', 'block');
		}

		visible.css({
			marginLeft: -0.5 * visible.width()
		});

		// Set height of container
		imagesContainer.height( win.height() - header.outerHeight() - footer.outerHeight() );

		// If the visible image is less tall than the container, position it accordingly
		if ( visible.height() < imagesContainer.height() ) {
			visible.css({
				top: ( imagesContainer.height() - visible.height() ) / 2
			});
		}
	}
	win.resize( resizeImageContainer );

	function showNextImage() {
		var target = imagesContainer.find('img:visible').next().length > 0 ? imagesContainer.find('img:visible').next() : imagesContainer.find('img').first();
		$(this).fadeOut();
		target.fadeIn(function(){
			target.css('display', 'block');
			resizeImageContainer();
		});
	}

	imagesContainer.find('img').click(showNextImage);
	resizeImageContainer();

	win.load(function(){
		resizeImageContainer();
		$('.preload').removeClass('preload');
	});

})(jQuery);