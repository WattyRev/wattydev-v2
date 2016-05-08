<?php
// Actions to perform at the beginning of any endpoint
if($_SERVER['HTTP_ORIGIN'] === 'http://localhost:4200') {
    header("Access-Control-Allow-Origin: *");
}

include 'database_connect.php';
include 'is_authenticated.php';
$POST = getPostData();

function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json);
}
