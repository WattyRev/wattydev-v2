<?php
/**
 * Route the user the the relevant location
 */

class Router {
    public function getTemplate() {
        $uri = $_SERVER['REQUEST_URI'];

        // A map of directories and what php file to use
        $uriMap = array(
            "/" => "index.php",
            "t" => "tag.php",
            "c" => "type.php",
            "*" => "post.php"
        );

        $uri = str_replace("router.php/", "", $uri, $i);
        $uri = str_replace("router.php", "", $uri, $i);

        // Include the correct file
        $directory = explode('/', $uri)[1];

        // Replace router.php so that it can run locally
        str_replace("router.php", "", $directory);

        if ($directory === "") {
            $directory = "/";
        }
        if (isset($uriMap[$directory])) {
            return $uriMap[$directory];
        } else {
            return $uriMap["*"];
        }
    }
}

$router = new Router();

$template = $router->getTemplate();

include 'controllers/'.$template;
include 'templates/layout.php';
