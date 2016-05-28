<?php
include 'init.php';

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'PUT':
        if (!isAuthenticated()) {
            return;
        }
        if (isset($_GET['update'])) {
            echo updatePost($POST->post);
        } else {
            echo addPost($POST->post);
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
    if (!isset($post)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Please supply a post to create';
    }

    // Validate the post title
    if (!isset($post->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create post without title.';
    }

    // Validate the post status exists
    if (!isset($post->status)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create post without status.';
    }

    // Validate that featured image exists
    if (isset($post->featuredImage) && $post->featuredImage !== '0') {
        $query = sprintf("SELECT * from images WHERE id = '%s'", mysql_real_escape_string($post->featuredImage));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'The featured image does not exist.';
        }
    }

    // Validate that type exists
    if (isset($post->type) && $post->type !== '0') {
        $query = sprintf("SELECT * from types WHERE id = '%s'", mysql_real_escape_string($post->type));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'The specified type does not exist.';
        }
    }

    // Validate the post status
    if ($post->status !== 'draft' && $post->status !== 'published' && $post->status !== 'unlisted') {
        header('HTTP/1.1 400 Bad Request');
        return 'Status must be draft, published, or unlisted.';
    }

    // Generate a slug for the post
    function generateSlug($iteration, $title) {
        $slug = urlencode(strtolower(str_replace(array(' ', '.'), array('_', ''), $title)));
        if ($iteration > 0) {
            $slug .= "_$iteration";
        }
        $query = sprintf("SELECT * from posts WHERE slug = '%s'", mysql_real_escape_string($slug));
        $result = mysql_query($query);
        if (mysql_num_rows($result) > 0) {
            return generateSlug($iteration + 1, $title);
        }
        return $slug;
    }
    $post->slug = generateSlug(0, $post->title);

    // Create the post
    $sql = sprintf("insert into posts (created,updated,content,featured_image,title,tags,type,status,slug,reference_url) value (now(),now(),'%s','%s','%s','%s','%s','%s','%s','%s')",
        mysql_real_escape_string($post->content),
        mysql_real_escape_string($post->featuredImage),
        mysql_real_escape_string($post->title),
        mysql_real_escape_string(json_encode($post->tags)),
        mysql_real_escape_string($post->type),
        mysql_real_escape_string($post->status),
        mysql_real_escape_string($post->slug),
        mysql_real_escape_string($post->referenceUrl));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
        header('HTTP/1.1 201 Created');
        $response = new stdClass;
        $response->id = $id;
        return json_encode($response);

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

function updatePost($post) {
    if (!isset($post)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Please supply a post to update';
    }

    $id = $post->id;

    // Check for post id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without id.';
    }

    // Validate content
    if (!isset($post->content)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without content.';
    }

    // Validate featured image
    if (!isset($post->featuredImage)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without featured image.';
    }

    // Validate that featured image exists
    if ($post->featuredImage !== '0') {
        $query = sprintf("SELECT * from images WHERE id = '%s'", mysql_real_escape_string($post->featuredImage));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'The featured image does not exist.';
        }
    }

    // Validate title
    if (!isset($post->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without title.';
    }

    // Validate tags
    if (!isset($post->tags)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without tags.';
    }

    // Validate type
    if (!isset($post->type)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without type.';
    }

    // Validate that type exists
    if ($post->type !== '0') {
        $query = sprintf("SELECT * from types WHERE id = '%s'", mysql_real_escape_string($post->type));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'The specified type does not exist.';
        }
    }

    // Validate status
    if (!isset($post->status)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without status.';
    }

    // Validate the post status is an appropariate string
    if ($post->status !== 'draft' && $post->status !== 'published' && $post->status !== 'unlisted') {
        header('HTTP/1.1 400 Bad Request');
        return 'Status must be draft, published, or unlisted.';
    }

    // Validate slug
    if (!isset($post->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without slug.';
    }

    // Validate referenceUrl
    if (!isset($post->referenceUrl)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update post without referenceUrl.';
    }

    // Set values
    $vars = array();
    $vars['content'] = $post->content;
    $vars['featured_image'] = $post->featuredImage;
    $vars['title'] = $post->title;
    $vars['tags'] = json_encode($post->tags);
    $vars['type'] = $post->type;
    $vars['status'] = $post->status;
    $vars['slug'] = $post->slug;
    $vars['reference_url'] = $post->referenceUrl;
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
    $response = new stdClass;
    $response->message = 'Changes saved.';
    return json_encode($response);
}

function getPosts() {
    // Get all posts
    $query = sprintf("SELECT * FROM posts");
    $result = mysql_query($query);
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
        $post->status = mysql_result($result, $i, 'status');
        $post->slug = mysql_result($result, $i, 'slug');
        $post->referenceUrl = mysql_result($result, $i, 'reference_url');
        array_push($posts->posts, $post);
    }
    mysql_close();

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($posts);
}

function getPost($id) {
    // Get post
    $query = sprintf("SELECT * FROM posts WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find post.';
    }

    // Generate the data structure
    $post = (object) array();
    $post->id = mysql_result($result, 0, 'id');
    $post->created = mysql_result($result, 0, 'created');
    $post->updated = mysql_result($result, 0, 'updated');
    $post->content = mysql_result($result, 0, 'content');
    $post->featuredImage = mysql_result($result, 0, 'featured_image');
    $post->title = mysql_result($result, 0, 'title');
    $post->tags = mysql_result($result, 0, 'tags');
    $post->type = mysql_result($result, 0, 'type');
    $post->status = mysql_result($result, 0, 'status');
    $post->slug = mysql_result($result, 0, 'slug');
    $post->referenceUrl = mysql_result($result, 0, 'reference_url');
    mysql_close();

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($post);
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
