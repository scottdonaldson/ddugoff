<!doctype html>
<!--

    Site by Parsley & Sprouts
    http://www.parsleyandsprouts.com

-->
<html class="no-js" lang="en-US">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <link rel="shortcut icon" href="<?= bloginfo('template_url'); ?>/images/favicon.ico">
    
    <title><?php if ( !is_front_page() ) echo get_the_title() . ' | '; ?>DDUGOFF</title>

    <meta name="viewport" content="initial-scale=1.0, width=device-width" />

    <link rel="stylesheet" href="<?= bloginfo('template_url'); ?>/css/style.min.css">
    
    <script src="<?= bloginfo('template_url'); ?>/js/vendor/modernizr.js"></script>

    <?php wp_head(); ?>
</head>

<?php
if ( is_page_template('pages/gallery.php') ) {
    $display = 'gallery';
} elseif ( is_page_template('pages/press.php') ) {
    $display = 'press';
} else {
    $display = 'content';
}
?>
<body <?php body_class(); ?> data-display="<?= $display; ?>">
<div id="page" class="hfeed site">

    <div id="site-url" class="hidden"><?= home_url(); ?>/</div>

	<!--[if lt IE 9]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

<header>
    <h1 class="visuallyhidden">DDUGOFF</h1>
</header>

<nav>
    <a href="<?= home_url(); ?>/" rel="home">
        <img src="<?= bloginfo('template_url'); ?>/images/logo.png" alt="DDUGOFF">
    </a>
    <p class="uppercase">Collections</p>
    <?php 
    wp_nav_menu(array(
        'theme_location' => 'collections'
    ));
    wp_nav_menu(array(
        'theme_location' => 'primary'
    )); 
    ?>
</nav>

<main>    