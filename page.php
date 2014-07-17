<?php 
if ( ajax_request() ) {

	output_content();

} else {

	get_header(); the_post(); ?>

	<div id="container">
		<?php the_content(); ?>
	</div>

	<?php get_footer(); 

}
?>