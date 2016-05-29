<?php
include 'functions.php';

$data = (object) array();

$data = (object) array_merge((array) $data, (array) getData());

function getData() {
    global $DS;

    $slug = getUrlPart();

    $tag = $DS->getTag($slug);

    if ($tag === false) {
        not_found();
    }

    $data = (object) array(
        "tag" => $tag,
        "title" => $tag->title
    );

    return $data;
}

function getUrlPart() {
    $uri = $_SERVER['REQUEST_URI'];

    $uri = str_replace("router.php/", "", $uri);
    $uri = str_replace("router.php", "", $uri);
    $uri = str_replace("/t", "", $uri);

    // Get the slug
    $directory = explode('/', $uri)[1];

    return $directory;
}
