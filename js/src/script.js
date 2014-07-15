(function($){

	var win = $(window),
		body = $('body');

	var nav = $('nav'),
		images = $('.image'),
		numImages = images.length,
		cutoff = Math.floor(numImages / 2),
		imagesContainer = $('#images');

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
	win.on('resize', showNav);

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

	win.on('resize', adjustSlideshow);

	function showImage(n) { // n an integer
		console.log(n);
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

})(jQuery);