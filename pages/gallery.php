<?php 
/*
Template Name: Gallery
*/

if ( ajax_request() ) {

	output_content();

} else {

	get_header(); 
	the_post();
	?>

	<div id="images">
		
		<?php 
		$images = get_field('images');
		foreach ( $images as $image ) { ?>
			<img class="image preload" src="<?= $image['image']; ?>">
		<?php } ?>

	</div>
	<div id="container" class="preload">
		<div id="content"></div>
	</div>

	<?php get_footer(); 

}
?>