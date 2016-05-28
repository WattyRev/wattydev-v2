<?php
$domain = $_SERVER['HTTP_HOST'];

include 'data.php';

function is_development() {
    if (strstr($_SERVER['HTTP_HOST'], 'localhost')) {
        return true;
    }
    return false;
}

function build_url($type, $slug) {
    $url = '';
    if (is_development()) {
        $url .= '/router.php';
    }
    switch ($type) {
        case 'type':
            $url .= '/c';
            break;
        case 'tag':
            $url .= '/t';
            break;
    }
    $url .= '/' . $slug;

    return $url;
}
