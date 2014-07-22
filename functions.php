<?php

// ----- Include Advanced Custom Fields
include_once('functions/advanced-custom-fields/acf.php');
include_once('functions/acf-options-page/acf-options-page.php');
include_once('functions/acf-repeater/acf-repeater.php');

register_nav_menu('collections', 'Collections Menu');
register_nav_menu('primary', 'Primary Menu');

// AJAX requests for content
function ajax_request() {
	return $_GET['request'] === 'content';
}

function output_content() {
	header('Content-type: application/json');
    echo json_encode(array(
    	'title' => get_the_title($post->ID),
    	'is_gallery' => is_page_template('pages/gallery.php'),
    	'images' => get_field('images'),
    	'content' => get_page($post->ID)->post_content,
    	'is_press' => is_page_template('pages/press.php'),
    	'clipping' => get_field('clipping')
    	)
    );
}