<?php 
/*
Template Name: Main
*/
get_header(); 
the_post();
?>

<div id="images">
	
	<?php 
	$images = get_field('images');
	foreach ( $images as $image ) { ?>
		<img src="<?= $image['image']; ?>">
	<?php } ?>

	<div class="prev"></div>
	<div class="next"></div>
</div>

<?php get_footer(); ?>