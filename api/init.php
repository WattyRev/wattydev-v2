<?php
// Actions to perform at the beginning of any endpoint

$POST = getPostData();

function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json);
}
