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
            echo updateType($_POST['type']);
        } else {
            echo addType($_POST['type']);
        }
        break;
    case 'GET':
        if (isset($_GET['id'])) {
            echo getType($_GET['id']);
        } else {
            echo getTypes();
        }
        break;
    case 'DELETE':
        if (!isAuthenticated()) {
            return;
        }
        echo deleteType($_GET['id']);
        break;
    default:
        break;
}

function addType($type) {
    $type = json_decode($type);

    // Validate the type title
    if (!isset($type->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create type without title.';
    }

    // Validate the type slug
    if (!isset($type->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create type without slug.';
    }

    // Validate parent
    $parentChildren;
    if (isset($type->parent)) {
        // Get type
        $query = sprintf("SELECT children FROM types WHERE id = '%s'",
            mysql_real_escape_string($type->parent));
        $result = mysql_query($query);
        mysql_close();

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'Indicated parent does not exist.';
        }

        $parentChildren = json_decode(mysql_result($result, 0, 'id'));
        if ($parentChildren === '' || $parentChildren === null) {
            $parentChildren = array();
        }
    }

    // Create the type
    $sql = sprintf("insert into types (title,slug,parent,children) value ('%s','%s','%s','%s')",
        mysql_real_escape_string($type->title),
        mysql_real_escape_string($type->slug),
        mysql_real_escape_string($type->parent),
        mysql_real_escape_string(json_encode($type->children)));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
        $success = true;

        // Add reference to parent type
        if (isset($type->parent)) {
            array_push($parentChildren, $id);
            $query = sprintf("update types set children = '%s' where id = '%s'",
                mysql_real_escape_string(json_encode($parentChildren)), mysql_real_escape_string($type->parent));
            if (!mysql_query($query)) {
                $success = false;
            }
        }

        // Alert success
        if ($success) {
            header('HTTP/1.1 201 Created');
            return $id;

        // Alert failure
        } else {
            header('HTTP/1.1 500 Internal Server Error');
            return 'Something went wrong when adding a reference to the parent type';
        }

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

function updateType($type) {
    $type = json_decode($type);
    $id = $type->id;

    // Check for type id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without id.';
    }

    // Validate the type slug
    if (!isset($type->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot create type without slug.';
    }

    // Validate parent
    $parentChildren;
    if (isset($type->parent)) {
        // Get type
        $query = sprintf("SELECT children FROM types WHERE id = '%s'",
            mysql_real_escape_string($type->parent));
        $result = mysql_query($query);
        mysql_close();

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'Indicated parent does not exist.';
        }

        $parentChildren = json_decode(mysql_result($result, 0, 'id'));
        if ($parentChildren === '' || $parentChildren === null) {
            $parentChildren = array();
        }
    }

    // Check for previous parent
    $originalParent;
    // Get type
    $query = sprintf("SELECT parent FROM types WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);
    mysql_close();

    // Alert failure
    if(mysql_num_rows($result)) {
        $originalParent = json_decode(mysql_result($result, 0, 'parent'));
    }

    // Set values
    $vars = array();
    $vars['title'] = $type->title;
    $vars['slug'] = $type->slug;
    $vars['parent'] = $type->parent;
    $vars['children'] = json_encode($type->children);
    $success = true;
    foreach($vars as $metric => $val) {
        if (!isset($val)) {
            continue;
        }
        $query = sprintf("update types set $metric = '%s' where id = '%s'",
            mysql_real_escape_string($val), mysql_real_escape_string($id));
        if(!mysql_query($query)) {
            $success = false;
        }
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

function getTypes() {
    // Get all types
    $query = sprintf("SELECT * FROM types");
    $result = mysql_query($query);
    mysql_close();
    $num = mysql_num_rows($result);

    // Generate data structure
    $types = (object) array();
    $types->types = array();
    for($i = 0; $i < $num; $i++) {
        $type = (object) array();
        $type->id = mysql_result($result, $i, 'id');
        $type->created = mysql_result($result, $i, 'created');
        $type->updated = mysql_result($result, $i, 'updated');
        $type->content = mysql_result($result, $i, 'content');
        $type->featuredImage = mysql_result($result, $i, 'featured_image');
        $type->title = mysql_result($result, $i, 'title');
        $type->tags = mysql_result($result, $i, 'tags');
        $type->type = mysql_result($result, $i, 'type');
        $type->subtype = mysql_result($result, $i, 'subtype');
        $type->status = mysql_result($result, $i, 'status');
        $type->slug = mysql_result($result, $i, 'slug');
        $type->referenceUrl = mysql_result($result, $i, 'reference_url');
        array_push($types->types, $type);
    }

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($types);
}

function getType($id) {
    // Get type
    $query = sprintf("SELECT * FROM type WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);
    mysql_close();

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find type.';
    }

    // Generate the data structure
    $type = (object) array();
    $type->id = mysql_result($result, 0, 'id');
    $type->created = mysql_result($result, 0, 'created');
    $type->updated = mysql_result($result, 0, 'updated');
    $type->content = mysql_result($result, 0, 'content');
    $type->featuredImage = mysql_result($result, 0, 'featured_image');
    $type->title = mysql_result($result, 0, 'title');
    $type->tags = mysql_result($result, 0, 'tags');
    $type->type = mysql_result($result, 0, 'type');
    $type->subtype = mysql_result($result, 0, 'subtype');
    $type->status = mysql_result($result, 0, 'status');
    $type->slug = mysql_result($result, 0, 'slug');
    $type->referenceUrl = mysql_result($result, 0, 'reference_url');

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($type);
}

function deleteType($id) {
    // Delete guest
    if(!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No id provided';
    }

    // Delete type
    $query = sprintf("DELETE from types WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert success
    if($result) {
        header('HTTP/1.1 200 OK');
        return 'Type deleted';

    // Alert failure
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        return 'Failed to delete type';
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
