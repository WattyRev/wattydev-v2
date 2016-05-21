<?php
include 'functions.php';

$data = (object) array(
    'title' => false
);
init();

function init() {
    $posts = ds_getPosts();

    var_dump($data);
    var_dump($posts);
    // Set recent portfolio items
    $data->portfolio = array_filter($posts->posts, function ($post) {
        return $post->type !== "46" && $post->type !== 46;
    });

    // Set recent blog posts
    $data->$blog = array_filter($posts->posts, function ($post) {
        return $post->type === "46" || $post->type === 46;
    });
}
