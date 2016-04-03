<?php
if($_SERVER['HTTP_ORIGIN'] === 'http://localhost:9000') {
    header("Access-Control-Allow-Origin: *");
}
include 'database_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        echo authentiate();
        break;
    case 'GET':
        echo getAuthentication();
        break;
    default:
        break;
}

function getAuthentication() {
    if (isset($_COOKIE['auth-token'])) {
        header('HTTP/1.1 200 OK');

        // Get the token from the cookie
        $token = $_COOKIE['auth-token'];

        // Refresh the cookie
        setcookie('auth-token', $token, time() + (3600 * 24), "/");

        // Return the token
        return $token;
    } else {
        header('HTTP/1.1 401 Unauthorized');
        return 'No authentication present. Please log in.';
    }
}

function authenticate() {
    // Check for email address
    if (!isset($_POST['email'])) {
        header('HTTP/1.1 400 Bad Request');
        return 'No email provided';
    }

    // Check for password
    if (!isset($_POST['password'])) {
        header('HTTP/1.1 400 Bad Request');
        return 'No password provided';
    }
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Get account
    $query = sprintf("SELECT password FROM authentication WHERE email = '%s'",
        mysql_real_escape_string($email));
    $result = mysql_query($query);
    mysql_close();

    // Alert failure
    if (!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find user.';
    }

    if ($password === mysql_result($result, 1, 'password')) {
        $token = openssl_random_pseudo_bytes(15);

        // Check that the token worked
        if ($token === false) {
            header('HTTP/1.1 500 Internal Server Error');
            return 'Something went wrong when generating your token.';
        }

        header('HTTP/1.1 200 OK');

        // Set the cookie
        setcookie('auth-token', $token, time() + (3600 * 24), "/");

        // Return the token
        return $token;
    }
};
