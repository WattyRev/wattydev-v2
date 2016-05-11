<?php
setcookie("test", "test", time() + 1000000);
/**
 * Handle client authentication for actions that modify the database.
 */
include 'init.php';

// Determine behavior based on request method
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        echo authenticate($POST);
        break;
    case 'GET':
        echo getAuthentication();
        break;
    default:
        break;
}

// Get and refresh the authentication token
function getAuthentication() {
    if (isset($_COOKIE['auth-token'])) {
        // Refresh the cookie
        setcookie('auth-token', $token, time() + (3600 * 24), "/");

        header('HTTP/1.1 200 OK');

        // Get the token from the cookie
        $token = $_COOKIE['auth-token'];

        // Return the token
        return $token;
    } else {
        header('HTTP/1.1 401 Unauthorized');
        var_dump($_COOKIE["test"]);
        return 'No authentication present. Please log in.';
    }
}

// Authenticate using email and password
function authenticate($POST) {
    // Check for email address
    if (!isset($POST->email)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No email provided';
    }

    // Check for password
    if (!isset($POST->password)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No password provided';
    }
    $email = $POST->email;
    $password = $POST->password;

    // Get account
    $query = sprintf("SELECT password FROM authentication WHERE email = '%s'",
        mysql_real_escape_string($email));
    $result = mysql_query($query);

    // Alert failure
    if (!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find user.';
    }

    if ($password === mysql_result($result, 0, 'password')) {
        mysql_close();
        $token = getToken(15);

        // Check that the token worked
        if ($token === false) {
            header('HTTP/1.1 500 Internal Server Error');
            return 'Something went wrong when generating your token.';
        }

        // Set the cookie
        $test = setcookie('auth-token', $token, time() + (86400 * 30), "/");

        header('HTTP/1.1 200 OK');

        // Return the token
        var_dump($test);
        return $token;
    }
};

function getToken($length) {
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    $max = strlen($codeAlphabet) - 1;
    for ($i=0; $i < $length; $i++) {
        $token .= $codeAlphabet[crypto_rand_secure(0, $max)];
    }
    return $token;
}

function crypto_rand_secure($min, $max) {
    $range = $max - $min;
    if ($range < 1) return $min; // not so random...
    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
}
