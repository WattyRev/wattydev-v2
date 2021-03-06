<?php
include 'functions.php';

$data = (object) array(
    'title' => false
);

$data = (object) array_merge((array) $data, (array) getData());

function getData() {
    global $DS;
    $posts = $DS->getPosts();

    $data = (object) array();
    // Set recent portfolio items
    $data->portfolio = array_filter($posts->posts, function ($post) {
        return $post->type->title !== "Blog";
    });

    // Set recent blog posts
    $data->blog = array_filter($posts->posts, function ($post) {
        return $post->type->title === "Blog";
    });

    return $data;
}
