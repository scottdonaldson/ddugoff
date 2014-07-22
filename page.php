<?php 
if ( ajax_request() ) {

	output_content();

} else {

	get_header(); the_post(); ?>

	<div id="images"></div>
	<div id="container" class="preload">
		<div id="content">
			<?php the_content(); ?>
		</div>
	</div>

	<?php get_footer(); 

}
?>