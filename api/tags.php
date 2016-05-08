<?php
/**
 * Manage post record tags.
 * A tag is taxonomy for organizing posts. Many tags can be applied to a post.
 */
include 'init.php';

// Determine bahavior based on request method
$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        if (!isAuthenticated()) {
            return;
        }
        if (isset($_GET['update'])) {
            echo updateTag($POST->tag);
        } else {
            echo addTag($POST->tag);
        }
        break;
    case 'GET':
        if (isset($_GET['id'])) {
            echo retrieveTag($_GET['id']);
        } else {
            echo retrieveTags();
        }
        break;
    case 'DELETE':
        if (!isAuthenticated()) {
            return;
        }
        echo deleteTag($_GET['id']);
        break;
    default:
        break;
}

// Create a new tag
function addTag($tag) {
    // Validate the tag title
    if (!isset($tag->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create tag without title.';
    }

    // Validate the tag slug
    if (!isset($tag->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create tag without slug.';
    }

    // Create the tag
    $sql = sprintf("insert into tags (title,slug) value ('%s','%s')",
        mysql_real_escape_string($tag->title),
        mysql_real_escape_string($tag->slug));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();

        // Alert success
        header('HTTP/1.1 201 Created');
        return $id;

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

// Edit an existing tag
function updateTag($tag) {
    $id = $tag->id;

    // Check for tag id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update tag without id.';
    }

    // Validate the tag slug
    if (!isset($tag->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create tag without slug.';
    }

    // Check that the request tag exists
    $query = sprintf("SELECT * FROM tags WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find tag.';
    }

    // Set values
    $vars = array();
    $vars['title'] = $tag->title;
    $vars['slug'] = $tag->slug;
    $success = true;
    foreach($vars as $metric => $val) {
        if (!isset($val)) {
            continue;
        }
        $query = sprintf("update tags set $metric = '%s' where id = '%s'",
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
    return 'Changes saved.';
}

// Get an array of tags
function retrieveTags() {
    // Get all tags
    $query = sprintf("SELECT * FROM tags");
    $result = mysql_query($query);
    mysql_close();
    $num = mysql_num_rows($result);

    // Generate data structure
    $tags = (object) array();
    $tags->tags = array();
    for($i = 0; $i < $num; $i++) {
        $tag = (object) array();
        $tag->id = mysql_result($result, $i, 'id');
        $tag->title = mysql_result($result, $i, 'title');
        $tag->slug = mysql_result($result, $i, 'slug');
        array_push($tags->tags, $tag);
    }

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($tags);
}

// Get a specific tag by id
function retrieveTag($id) {
    // Get tag
    $query = sprintf("SELECT * FROM tag WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find tag.';
    }

    // Generate the data structure
    $tag = (object) array();
    $tag->id = mysql_result($result, 0, 'id');
    $tag->title = mysql_result($result, 0, 'title');
    $tag->slug = mysql_result($result, 0, 'slug');
    mysql_close();

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($tag);
}

// Delete a tag by id
function deleteTag($id) {
    // Delete guest
    if(!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No id provided';
    }

    // Delete tag
    $query = sprintf("DELETE from tags WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert success
    if($result) {
        header('HTTP/1.1 200 OK');
        return 'Tag deleted';

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Failed to delete tag';
    }
}
