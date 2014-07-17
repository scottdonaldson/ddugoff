<?php 
/*
Template Name: Gallery
*/

// build in some AJAX to get the image URLs
if ( $_GET['images'] === 'true' ) {
	header('Content-type: application/json');
	$images = get_field('images');
	echo json_encode($images);
	return;
}

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

<?php get_footer(); ?>