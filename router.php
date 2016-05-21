<?php
$basepath = implode('/', array_slice(explode('/', $_SERVER['SCRIPT_NAME']), 0, -1)) . '/';
var_dump($basepath);
echo 'You got routed, son!';
