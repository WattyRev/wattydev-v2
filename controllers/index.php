<?php
include 'functions.php';

$data = (object) array(
    'title' => false
);
var_dump($data);
$data = array_merge((array) $data, (array) getData());

function getData() {
    $posts = ds_getPosts();

    $data = (object) array();
    // Set recent portfolio items
    $data->portfolio = array_filter($posts->posts, function ($post) {
        return $post->type !== "46" && $post->type !== 46;
    });

    var_dump($posts);

    // Set recent blog posts
    $data->$blog = array_filter($posts->posts, function ($post) {
        return $post->type === "46" || $post->type === 46;
    });

    return $data;
}

var_dump($data);
