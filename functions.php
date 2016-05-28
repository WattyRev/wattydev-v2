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

    if ($type === 'home') {
        if (is_development()) {
            return '/router.php';
        } else {
            return '/';
        }
    }
    if (is_development() && $type !== 'css' && $type !== 'js') {
        $url .= '/router.php';
    } elseif (!is_development() && ($type === 'css' || $type === 'js')) {
        $url .= '/site';
    }
    switch ($type) {
        case 'type':
            $url .= '/c';
            break;
        case 'tag':
            $url .= '/t';
            break;
        case 'css':
            $url .= '/styles';
            break;
        case 'js':
            $url .= '/scripts';
            break;
    }
    $url .= '/' . $slug;

    return $url;
}

function get_js() {
    $dev_files = array(
        'main.js',
        'home.js',
        'post.js'
    );
    $prod_files = array(
        'app.js'
    );
    if (is_development()) {
        return $dev_files;
    }
    return $prod_files;
}
