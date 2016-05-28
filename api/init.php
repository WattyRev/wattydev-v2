<?php
// Actions to perform at the beginning of any endpoint
cors();

include 'database_connect.php';
include 'is_authenticated.php';
$POST = getPostData();

function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json);
}

function cors() {

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN']) && ($_SERVER['HTTP_ORIGIN'] === 'http://localhost:4200' || $_SERVER['HTTP_ORIGIN'] === 'http://localhost:8888')) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

function create_slug($text) {
    // Replace stuff
    $text = str_replace(array(' ', '.', '/'), array('_', '', ''), $title);

    // lower case
    $text = strtolower($text);

    // encode
    return urlencode($text);
}
