<?php
$uri = substr($_SERVER['REQUEST_URI'], strlen($basepath));
var_dump($uri);
echo 'You got routed, son!';
