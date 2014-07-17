<?php 
/*
Template Name: Press
*/
if ( ajax_request() ) {

	output_content();

} else {

	get_header(); 
	the_post(); ?>

		<div id="content">
			<?php
			$clippings = get_field('clipping');

			foreach ( $clippings as $clipping ) { ?>
				<div class="uppercase"><?= $clipping['link']; ?></div>
				<img src="<?= $clipping['image']; ?>">
			<?php } ?>
		</div>

	<?php get_footer(); 

}
?>