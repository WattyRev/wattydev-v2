<?php
// Actions to perform at the beginning of any endpoint

include 'database_connect.php';
include 'is_authenticated.php';
$POST = getPostData();

function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json);
}
