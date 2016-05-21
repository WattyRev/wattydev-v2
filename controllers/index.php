<?php
include 'functions.php';

$data = (object) array();
init();

function init() {
    $posts = $DS->getPosts()->posts;

    // Set recent portfolio items
    $data->portfolio = array_filter($posts, function ($post) {
        return $post->type !== "46" && $post->type !== 46;
    });

    // Set recent blog posts
    $data->$blog = array_filter($posts, function ($post) {
        return $post->type === "46" || $post->type === 46;
    });
}