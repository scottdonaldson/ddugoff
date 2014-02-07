<?php 
/*
Template Name: Press
*/
get_header(); 
the_post(); ?>

	<div id="content">
		<?php
		$clippings = get_field('clipping');

		foreach ( $clippings as $clipping ) { ?>
			<p class="uppercase"><a href="<?= $clipping['link']; ?>"><?= $clipping['link_text']; ?></a></p>
			<img src="<?= $clipping['image']; ?>">
		<?php } ?>
	</div>

<?php get_footer(); ?>