var $ = require('jquery'),
	win = $(window),
	isAdmin = $('body').hasClass('admin-bar'),
	winHeight = isAdmin ? win.height() - 32 : win.height();

var imagesContainer = $('#images'),
	container = $('#container');

function createSlideshow() {

	var images = $('.image');

	imagesContainer.height( winHeight );

	images.each(function (i) {

		var $this = $(this),
			left;

		// adjust height to height of window screen
		$this.height( winHeight );

		// from the 1st image up to about halfway through
		if ( i <= Math.floor(images.length / 2) ) {
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

function removeSlideshow( callback ) {

	$('.image').each(function(){
		var $this = $(this);
		$this.addClass('preload');
		setTimeout($this.remove, 210);
	});

	if ( callback ) callback();
}

function sizeContainer() {
	var showing = $('[data-showing="0"]');
	if ( showing.length > 0 ) {
		container.css({
			left: parseInt(showing.css('left'), 10),
			'min-height': winHeight,
			width: showing.width() + 2
		});
	} else {
		setTimeout(sizeContainer, 10);
	}
}

module.exports = {
	createSlideshow,
	removeSlideshow,
	sizeContainer
};