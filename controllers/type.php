<?php
include 'functions.php';

$data = (object) array();

$data = (object) array_merge((array) $data, (array) getData());

function getData() {
    global $DS;

    $slug = getUrlPart();

    $type = $DS->getType($slug);

    $data = (object) array(
        "type" => $type,
        "title" => $type->title
    );

    return $data;
}

function getUrlPart() {
    $uri = $_SERVER['REQUEST_URI'];

    $uri = str_replace("router.php/", "", $uri);
    $uri = str_replace("router.php", "", $uri);
    $uri = str_replace("/c", "", $uri);

    // Get the slug
    $directory = explode('/', $uri)[1];

    return $directory;
}
