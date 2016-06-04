<?php
/**
 * Handles creating, editing, viewing, and deleting images
 */
include 'init.php';

// Determine behavior based on method
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        if (!isAuthenticated()) {
            return;
        }
        if (isset($_GET['update'])) {
            echo updateImage($POST->image);
        } else {
            echo addImage($POST->image);
        }
        break;
    case 'GET':
        if (isset($_GET['id'])) {
            echo getImage($_GET['id']);
        } else {
            echo getImages();
        }
        break;
    case 'DELETE':
        if (!isAuthenticated()) {
            return;
        }
        echo deleteImage($_GET['id']);
        break;
    default:
        break;
}

// Add a new image
function addImage($image) {
    // Setup to allow committing to git
    $output = putenv("HOME=/home1/r3vfan");
    // $output = shell_exec('git config --global user.email "spencer@wattydev.com"');
    // $output = shell_exec('git config --global user.name "WattyDev.com"');

    if (!isset($image)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Please supply a image to create';
    }

    // Validate the image title
    if (!isset($image->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create image without title.';
    }

    if (!isset($image->file)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create image without the file.';
    }

    if (strpos($image->file, 'data:image/png;base64') === -1) {
        header('HTTP/1.1 400 Bad Request');
        return 'The file must be a base64 encoded PNG.';
    }

    // Parse and upload the image
    $data = str_replace('data:image/png;base64,', '', $image->file);
    $data = str_replace(' ', '+', $data);
    $data = base64_decode($data);
    $file = '../images/'. uniqid() . '.png';
    $success = file_put_contents($file, $data);

    if (!$success) {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when uploading the file.';
    }

    // Sync with git
    $git_response = array();
    array_push($git_response, shell_exec("git add ../images"));
    array_push($git_response, shell_exec("git commit -a -m 'Update image file'"));
    array_push($git_response, shell_exec("git push"));

    // Add the image to the database
    $sql = sprintf("insert into images (created,title,description,url) value (now(),'%s','%s','%s')",
        mysql_real_escape_string($image->title),
        mysql_real_escape_string($image->description),
        mysql_real_escape_string(str_replace('../images/', '', $file)));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
        header('HTTP/1.1 201 Created');
        $response = new stdClass;
        $response->id = $id;
        $response->git = $git_response;
        return json_encode($response);

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

// Update an existing image
function updateImage($image) {

    // Setup to allow committing to git
    $output = putenv("HOME=/home1/r3vfan");
    // $output = shell_exec('git config --global user.email "spencer@wattydev.com"');
    // $output = shell_exec('git config --global user.name "WattyDev.com"');

    if (!isset($image)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Please supply a image to update';
    }

    $id = $image->id;

    // Check for image id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update image without id.';
    }

    if (isset($image->file)) {
        if (strpos($image->file, 'data:image/png;base64') === -1) {
            header('HTTP/1.1 400 Bad Request');
            return 'The file must be a base64 encoded PNG.';
        }

        // Get the record so that we can save the image to the same url
        $query = sprintf("SELECT url FROM images WHERE id = '%s'",
            mysql_real_escape_string($id));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 404 Not Found');
            return 'Could not find image.';
        }

        // Generate the data structure
        $url = '../images/' . mysql_result($result, 0, 'url');

        // Parse and upload the image
        $data = str_replace('data:image/png;base64,', '', $image->file);
        $data = str_replace(' ', '+', $data);
        $data = base64_decode($data);
        $file = $url;
        $success = file_put_contents($file, $data);

        if (!$success) {
            header('HTTP/1.1 500 Internal Server Error');
            return 'Something went wrong when uploading the file.';
        }

        // Sync with git
        shell_exec("git add /*");
        shell_exec("git commit -a -m 'Update image file'");
        shell_exec("git push");
    }

    // Set values
    $vars = array();
    $vars['title'] = $image->title;
    $vars['description'] = $image->description;
    $success = true;
    foreach($vars as $metric => $val) {
        if (!isset($val)) {
            continue;
        }
        $query = sprintf("update images set $metric = '%s' where id = '%s'",
            mysql_real_escape_string($val), mysql_real_escape_string($id));
        if(!mysql_query($query)) {
            $success = false;
        }
    }
    mysql_close();

    // Alert failure
    if(!$success) {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong. Some of your changes may have been saved.';
    }

    // Alert success
    header('HTTP/1.1 200 OK');
    $response = new stdClass;
    $response->message = 'Changes saved.';
    return json_encode($response);
}

function getImages() {
    // Get all images
    $query = sprintf("SELECT * FROM images");
    $result = mysql_query($query);
    mysql_close();
    $num = mysql_num_rows($result);

    // Generate data structure
    $images = (object) array();
    $images->images = array();
    for($i = 0; $i < $num; $i++) {
        $image = (object) array();
        $image->id = mysql_result($result, $i, 'id');
        $image->created = mysql_result($result, $i, 'created');
        $image->title = mysql_result($result, $i, 'title');
        $image->description = mysql_result($result, $i, 'description');
        $image->url = mysql_result($result, $i, 'url');
        array_push($images->images, $image);
    }

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($images);
}

function getImage($id) {
    // Get image
    $query = sprintf("SELECT * FROM images WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);
    mysql_close();

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find image.';
    }

    // Generate the data structure
    $image = (object) array();
    $image->id = mysql_result($result, 0, 'id');
    $image->created = mysql_result($result, 0, 'created');
    $image->title = mysql_result($result, 0, 'title');
    $image->description = mysql_result($result, 0, 'description');
    $image->url = mysql_result($result, 0, 'url');

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($image);
}

function deleteImage($id) {
    // Setup to allow committing to git
    $output = putenv("HOME=/home1/r3vfan");
    // $output = shell_exec('git config --global user.email "spencer@wattydev.com"');
    // $output = shell_exec('git config --global user.name "WattyDev.com"');|

    // Delete image
    if(!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No id provided';
    }

    // Get image name
    $query = sprintf("SELECT url FROM images WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find image.';
    }
    $url = '../images/' . mysql_result($result, 0, 'url');

    // Delete image from database
    $query = sprintf("DELETE from images WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    if(!$result) {
        // Alert failure
        header('HTTP/1.1 500 Internal Server Error');
        return 'Failed to delete image from database';
    }

    if (!unlink($url)) {
        // Alert failure
        header('HTTP/1.1 500 Internal Server Error');
        return 'Failed to delete image file';
    }

    // Sync with git
    shell_exec("git add /*");
    shell_exec("git commit -a -m 'Delete image file'");
    shell_exec("git push");

    header('HTTP/1.1 200 OK');
    return 'Image deleted';
}
