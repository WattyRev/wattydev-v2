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

    $uri = str_replace("router.php/", "", $uri);
    $uri = str_replace("router.php", "", $uri);

    // Get the slug
    $directory = explode('/', $uri)[1];

    return $directory;
}
