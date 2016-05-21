<?php
/**
 * Route the user the the relevant location
 */

$router = (object) array();

$router->getTemplate = function() {
    $uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));

    // A map of directories and what php file to use
    $uriMap = array(
        "/" => "index.php",
        "t" => "tag.php",
        "c" => "type.php",
        "*" => "post.php"
    );

    // Include the correct file
    $directory = explode('/', $uri)[1];
    if ($directory === "") {
        $directory = "/";
    }
    if (isset($uriMap[$directory])) {
        return $uriMap[$directory];
    } else {
        return $uriMap["*"];
    }
};

$template = $router->getTemplate();

include 'controllers/'.$template;
include 'layout.php';
