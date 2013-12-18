<?php 
// Set BASE url
$BASE = file_exists('local.txt') ? 'http://localhost/dugoff-2.0' : 'http://www.ddugoff.com';
?>

<!DOCTYPE html>
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <link rel="shortcut icon" href="<?= $BASE; ?>/images/favicon.ico">
    
    <title>DDUGOFF</title>

    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    
    <link rel="author" href="<?= $BASE; ?>/humans.txt">

    <link rel="stylesheet" href="<?= $BASE; ?>/css/normalize.css">
    <link rel="stylesheet" href="<?= $BASE; ?>/css/style.css">
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<?= $BASE; ?>/js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
    <script src="<?= $BASE; ?>/js/vendor/modernizr.js"></script>

</head>

<body>
<div id="page" class="hfeed site">

	<!--[if lt IE 8]>
        <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
    <![endif]-->

<header>
    <h1 class="visuallyhidden">DDUGOFF</h1>
    <a href="<?= $BASE; ?>">
        <img src="<?= $BASE; ?>/images/logo.png" alt="DDUGOFF">
    </a>
</header>

<main>    