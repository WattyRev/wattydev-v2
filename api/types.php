<?php
/**
 * Manage post record types.
 * A type is a category taxonomy for organizing posts. Only one type can be applied to a post.
 */
header('Access-Control-Allow-Origin: *');
include 'database_connect.php';

// Determine bahavior based on request method
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
            echo retrieveType($_GET['id']);
        } else {
            echo retrieveTypes();
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

// Create a new type
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
    $newSiblings;
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

        $newSiblings = json_decode(mysql_result($result, 0, 'id'));
        if ($newSiblings === '' || $newSiblings === null) {
            $newSiblings = array();
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
            array_push($newSiblings, $id);
            $query = sprintf("update types set children = '%s' where id = '%s'",
                mysql_real_escape_string(json_encode($newSiblings)), mysql_real_escape_string($type->parent));
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

// Edit an existing type
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

    // Validate and evaluate parent
    $newSiblings;
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

        $newSiblings = json_decode(mysql_result($result, 0, 'id'));
        if ($newSiblings === '' || $newSiblings === null) {
            $newSiblings = array();
        }

        // Add reference to new parent type
        array_push($newSiblings, $id);
        $query = sprintf("update types set children = '%s' where id = '%s'",
            mysql_real_escape_string(json_encode($newSiblings)), mysql_real_escape_string($type->parent));
        if (!mysql_query($query)) {
            // Alert failure
            header('HTTP/1.1 500 Internal Server Error');
            return 'Something went wrong when adding the reference to the new parent type.';
        }

        // Check for previous parent
        $originalSiblings;

        // Get the original parent
        $query = sprintf("SELECT parent FROM types WHERE id = '%s'",
            mysql_real_escape_string($id));
        $result = mysql_query($query);
        mysql_close();

        if(mysql_num_rows($result)) {
            $originalParent = json_decode(mysql_result($result, 0, 'parent'));

            // Get type
            $query = sprintf("SELECT children FROM types WHERE id = '%s'",
                mysql_real_escape_string($originalParent));
            $result = mysql_query($query);
            mysql_close();

            // If the original parent exists, remove the reference from the parent
            if(mysql_num_rows($result)) {
                $originalSiblings = json_decode(mysql_result($result, 0, 'id'));
                if ($originalSiblings !== '' && $originalSiblings !== null) {
                    $pos = array_search($id, $originalSiblings);
                    unset($originalSiblings[$pos]);

                    // Remove reference from original parent type
                    $query = sprintf("update types set children = '%s' where id = '%s'",
                        mysql_real_escape_string(json_encode($originalSiblings)), mysql_real_escape_string($originalParent));
                    if (!mysql_query($query)) {
                        // Alert failure
                        header('HTTP/1.1 500 Internal Server Error');
                        return 'Something went wrong when removing the reference to the original parent type.';
                    }
                }
            }
        }
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

// Get an array of types
function retrieveTypes() {
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
        $type->title = mysql_result($result, $i, 'title');
        $type->slug = mysql_result($result, $i, 'slug');
        $type->parent = mysql_result($result, $i, 'parent');
        $type->children = json_decode(mysql_result($result, $i, 'children'));
        array_push($types->types, $type);
    }

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($types);
}

// Get a specific type by id
function retrieveType($id) {
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
    $type->id = mysql_result($result, $i, 'id');
    $type->title = mysql_result($result, $i, 'title');
    $type->slug = mysql_result($result, $i, 'slug');
    $type->parent = mysql_result($result, $i, 'parent');
    $type->children = json_decode(mysql_result($result, $i, 'children'));

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($type);
}

// Delete a type by id
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

// Check if the user is authenticated
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
