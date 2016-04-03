<?php
header('Access-Control-Allow-Origin: *');
include 'database_connect.php';

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        if (!isAuthenticated()) {
            return;
        }
        if (isset($_GET['update'])) {
            echo updatePost($_POST['post']);
        } else {
            echo addPost($_POST['post']);
        }
        break;
    case 'GET':
        if (isset($_GET['id'])) {
            echo getPost($_GET['id']);
        } else {
            echo getPosts();
        }
        break;
    case 'DELETE':
        if (!isAuthenticated()) {
            return;
        }
        echo deletePost($_GET['id']);
        break;
    default:
        break;
}

function addPost($post) {
    $post = json_decode($post);

    // Validate the post title
    if (!isset($post->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create post without title.';
    }

    // Validate the post status
    if ($post->status !== 'draft' || $post->status !== 'published' || $post->status !== 'unlisted') {
        header('HTTP/1.1 400 Bad Request');
        return 'Status must be draft, published, or unlisted.';
    }

    // Create the post
    $sql = sprintf("insert into posts (created,updated,content,featured_image,title,tags,type,subtype,status) value (now(),now(),'%s','%s','%s','%s','%s','%s','%s')",
        mysql_real_escape_string($post->content),
        mysql_real_escape_string($post->featuredImage),
        mysql_real_escape_string($post->title),
        mysql_real_escape_string($post->tags),
        mysql_real_escape_string($post->type),
        mysql_real_escape_string($post->subtype),
        mysql_real_escape_string($post->status));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
        header('HTTP/1.1 201 Created');
        return $id;

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

function updatePost($post) {
    $post = json_decode($post);
    $id = $post->id;

    // Check for post id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without id.';
    }

    // Set values
    $vars = array();
    $vars['content'] = $post->content;
    $vars['featured_image'] = $post->featuredImage;
    $vars['title'] = $post->title;
    $vars['tags'] = $post->tags;
    $vars['type'] = $post->type;
    $vars['subtype'] = $post->subtype;
    $vars['status'] =$post->status;
    $success = true;
    foreach($vars as $metric => $val) {
        if (!isset($val)) {
            continue;
        }
        $query = sprintf("update posts set $metric = '%s' where id = '%s'",
            mysql_real_escape_string($val), mysql_real_escape_string($id));
        if(!mysql_query($query)) {
            $success = false;
        }
    }

    // Set updated time
    $query = sprintf("update posts set updated = now() where id = '%s'",
        mysql_real_escape_string($id));
    if(!mysql_query($query)) {
        $success = false;
    }

    // Alert failure
    if(!$success) {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong. Some of your changes may have been saved.';
    }

    // Alert success
    header('HTTP/1.1 200 OK');
    return 'Changes saved.';
}

function getPosts() {
    // Get all posts
    $query = sprintf("SELECT * FROM posts");
    $result = mysql_query($query);
    mysql_close();
    $num = mysql_num_rows($result);

    // Generate data structure
    $posts = (object) array();
    $posts->posts = array();
    for($i = 0; $i < $num; $i++) {
        $post = (object) array();
        $post->id = mysql_result($result, $i, 'id');
        $post->created = mysql_result($result, $i, 'created');
        $post->updated = mysql_result($result, $i, 'updated');
        $post->content = mysql_result($result, $i, 'content');
        $post->featuredImage = mysql_result($result, $i, 'featured_image');
        $post->title = mysql_result($result, $i, 'title');
        $post->tags = mysql_result($result, $i, 'tags');
        $post->type = mysql_result($result, $i, 'type');
        $post->subtype = mysql_result($result, $i, 'subtype');
        $post->status = mysql_result($result, $i, 'status');
        array_push($posts->posts, $post);
    }

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($posts);
}

function getPost($id) {
    // Get post
    $query = sprintf("SELECT * FROM post WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);
    mysql_close();

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find post.';
    }

    // Generate the data structure
    $post = (object) array();
    $post->id = mysql_result($result, $i, 'id');
    $post->created = mysql_result($result, $i, 'created');
    $post->updated = mysql_result($result, $i, 'updated');
    $post->content = mysql_result($result, $i, 'content');
    $post->featuredImage = mysql_result($result, $i, 'featured_image');
    $post->title = mysql_result($result, $i, 'title');
    $post->tags = mysql_result($result, $i, 'tags');
    $post->type = mysql_result($result, $i, 'type');
    $post->subtype = mysql_result($result, $i, 'subtype');
    $post->status = mysql_result($result, $i, 'status');

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($guest);
}

function deletePost($id) {
    // Delete guest
    if(!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No id provided';
    }

    // Delete post
    $query = sprintf("DELETE from posts WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert success
    if($result) {
        header('HTTP/1.1 200 OK');
        return 'Post deleted';

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Failed to delete post';
    }
}

function isAuthenticated() {
    $headers = getallheaders();
    if (!isset($headers['x-wattydev-authentication']) || !isset($_COOKIE['auth-token'])) {
        header('HTTP/1.1 401 Unauthorized');
        return false;
    }

    $token = $headers['x-wattydev-authentication'];
    if ($token !== $_COOKIE['auth-token']) {
        header('HTTP/1.1 401 Unauthorized');
        return false;
    }
    return true;
}
