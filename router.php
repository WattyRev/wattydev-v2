<?php
$uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));
$uriMap = (object) array(
    "/" => "index.php",
    "tag" => "tag.php",
    "type" => "type.php",
    "*" => "post.php"
);
$directory = explode('/', $uri)[1];
if ($directory === "") {
    $directory = "/";
}
var_dump($uri);
var_dump($directory);
echo 'You got routed, son!';
