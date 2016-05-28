<?php
include 'functions.php';

$data = (object) array();

$data = (object) array_merge((array) $data, (array) getData());

function getData() {
    global $DS;

    $slug = getUrlPart();

    $post = $DS->getPost($slug);

    $data = (object) array(
        "post" => $post,
        "title" => $post->title
    );

    return $data;
}

function getUrlPart() {
    $uri = $_SERVER['REQUEST_URI'];

    // A map of directories and what php file to use
    $uriMap = array(
        "/" => "index.php",
        "t" => "tag.php",
        "c" => "type.php",
        "*" => "post.php"
    );

    $uri = str_replace("router.php/", "", $uri, $i);
    $uri = str_replace("router.php", "", $uri, $i);

    // Include the correct file
    $directory = explode('/', $uri)[1];

    // Replace router.php so that it can run locally
    str_replace("router.php", "", $directory);

    return $directory;
}
