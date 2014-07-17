<?php 
/*
Template Name: Press
*/
if ( ajax_request() ) {

	output_content();

} else {

	get_header(); 
	the_post(); ?>

	<div id="container" class="preload">
		<div id="content">
			<?php
			$clippings = get_field('clipping');

			foreach ( $clippings as $clipping ) { ?>
				<p class="uppercase"><?= $clipping['link']; ?></p>
				<img src="<?= $clipping['image']; ?>">
			<?php } ?>
		</div>
	</div>

	<?php get_footer(); 

}
?>