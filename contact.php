<?php
function getPostData() {
    $json = file_get_contents('php://input');
    return json_decode($json);
}

var_dump(getPostData());
