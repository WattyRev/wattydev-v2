<?php
/**
 * Manage post record types.
 * A type is a category taxonomy for organizing posts. Only one type can be applied to a post.
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
            echo updateType($POST->type);
        } else {
            echo addType($POST->type);
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
    // Validate the type title
    if (!isset($type->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without title.';
    }

    // Validate the type slug
    if (!isset($type->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without slug.';
    }

    // Validate parent
    if (!isset($type->parent)) {
        $type->parent = 0;
    }

    // Validate that the parent exists
    if ($type->parent !== 0) {
        // Get type
        $query = sprintf("SELECT children FROM types WHERE id = '%s'",
            mysql_real_escape_string($type->parent));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            header('HTTP/1.1 400 Bad Request');
            return 'Indicated parent does not exist.';
        }

        // Get the current children property from the new parent
        $newSiblings = json_decode(mysql_result($result, 0, 'children'));
        if ($newSiblings === '' || $newSiblings === null) {
            $newSiblings = array();
        }
    }

    // Create the type
    $sql = sprintf("insert into types (title,slug,parent,children) value ('%s','%s','%s','%s')",
        mysql_real_escape_string($type->title),
        mysql_real_escape_string($type->slug),
        mysql_real_escape_string($type->parent),
        mysql_real_escape_string(json_encode(array())));

    // Alert success
    if (mysql_query($sql)) {
        $id = mysql_insert_id();
        $success = true;

        // Add reference to parent type
        if ($type->parent !== 0) {
            // Add the new id to the new parent's children
            array_push($newSiblings, $id);

            // Update the parent record
            $query = sprintf("update types set children = '%s' where id = '%s'",
                mysql_real_escape_string(json_encode($newSiblings)), mysql_real_escape_string($type->parent));
            if (!mysql_query($query)) {
                $success = false;
            }
        }
        mysql_close();

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
        mysql_close();
        header('HTTP/1.1 500 Internal Server Error');
        return 'Something went wrong when adding the record.';
    }
}

// Edit an existing type
function updateType($type) {
    $id = $type->id;

    // Check for type id
    if (!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without id.';
    }

    // Validate the type title
    if (!isset($type->title)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without title.';
    }

    // Validate the type slug
    if (!isset($type->slug)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without slug.';
    }

    // Validate children
    if (!isset($type->children)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without children.';
    }

    // Validate parent
    if (!isset($type->parent)) {
        header('HTTP/1.1 400 Bad Request');
        return 'Cannot update type without parent.';
    }

    /**
     * If the parent has changed, make the appropriate changes to other records
     */
    $query = sprintf("SELECT parent FROM types WHERE id = '%s'",
       mysql_real_escape_string($id));
    $result = mysql_query($query);
    $originalParentId = json_decode(mysql_result($result, 0, 'parent'));
    if ($type->parent !== $originalParentId) {
        /**
         * Add reference to this type to the new parent
         */
        if ($type->parent !== 0) {
            // Get the children property from the new parent record
            $query = sprintf("SELECT children FROM types WHERE id = '%s'",
                mysql_real_escape_string($type->parent));
            $result = mysql_query($query);

            // Alert failure
            if(!mysql_num_rows($result)) {
                header('HTTP/1.1 400 Bad Request');
                return 'Indicated parent does not exist.';
            }

            // Save the list of children
            $newSiblings = json_decode(mysql_result($result, 0, 'id'));
            if ($newSiblings === '' || $newSiblings === null) {
                $newSiblings = array();
            }

            // Add reference to the new parent's list of children
            array_push($newSiblings, $id);

            // Update the parent record
            $query = sprintf("update types set children = '%s' where id = '%s'",
                mysql_real_escape_string(json_encode($newSiblings)), mysql_real_escape_string($type->parent));
            if (!mysql_query($query)) {
                // Alert failure
                header('HTTP/1.1 500 Internal Server Error');
                return 'Something went wrong when adding the reference to the new parent type.';
            }
        }

        /**
         * Remove reference from the old parent
         */
        if ($originalParentId !== 0) {
            $query = sprintf("SELECT children FROM types WHERE id = '%s'",
                mysql_real_escape_string($originalParentId));
            $result = mysql_query($query);

            // If the original parent exists, remove the reference from the parent
            if(mysql_num_rows($result)) {
                $originalSiblings = json_decode(mysql_result($result, 0, 'id'));
                if ($originalSiblings !== '' && $originalSiblings !== null) {
                    // Remove the type from the old parent's list of children
                    $pos = array_search($id, $originalSiblings);
                    unset($originalSiblings[$pos]);

                    // Update the old parent record
                    $query = sprintf("update types set children = '%s' where id = '%s'",
                        mysql_real_escape_string(json_encode($originalSiblings)), mysql_real_escape_string($originalParentId));
                    if (!mysql_query($query)) {
                        // Alert failure
                        header('HTTP/1.1 500 Internal Server Error');
                        return 'Something went wrong when removing the reference to the original parent type.';
                    }
                }
            }
        }
    }

    /**
     * Update the type record
     */
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
    mysql_close();

    // Alert succcess
    header('HTTP/1.1 200 OK');
    return JSON_encode($types);
}

// Get a specific type by id
function retrieveType($id) {
    // Get type
    $query = sprintf("SELECT * FROM types WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find type.';
    }

    // Generate the data structure
    $type = (object) array();
    $type->id = mysql_result($result, 0, 'id');
    $type->title = mysql_result($result, 0, 'title');
    $type->slug = mysql_result($result, 0, 'slug');
    $type->parent = mysql_result($result, 0, 'parent');
    $type->children = json_decode(mysql_result($result, 0, 'children'));
    mysql_close();

    // Alert success
    header('HTTP/1.1 200 OK');
    return JSON_encode($type);
}

// Delete a type by id
function deleteType($id) {
    // Validate id
    if(!isset($id)) {
        header('HTTP/1.1 400 Bad Request');
        return 'No id provided';
    }

    // Validate that type exists
    $query = sprintf("SELECT parent from types WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);
    $parentId;
    if (mysql_num_rows($result)) {
        $parentId = mysql_result($result, 0, 'parent');
    } else {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find type.';
    }

    // Remove parent references
    $query = sprintf("update types set parent = '%s' where parent = '%s'",
        mysql_real_escape_string(0), mysql_real_escape_string($id));
    mysql_query($query);

    // Remove children references
    if ($parentId !== 0) {
        $query = sprintf("SELECT children from types WHERE id = '%s'",
            mysql_real_escape_string($parentId));
        $result = mysql_query($query);
        if (mysql_num_rows($result)) {
            $children = json_decode(mysql_result($result, 0, 'children'));
            if ($children !== '' && $children !== null) {
                // Remove the type from the old parent's list of children
                $pos = array_search($id, $children);
                unset($children[$pos]);

                // Update the old parent record
                $query = sprintf("update types set children = '%s' where id = '%s'",
                    mysql_real_escape_string(json_encode($children)), mysql_real_escape_string($parentId));
                if (!mysql_query($query)) {
                    // Alert failure
                    header('HTTP/1.1 500 Internal Server Error');
                    return 'Something went wrong when removing the reference from the original parent type.';
                }
            }
        }
    }

    // Delete type
    $query = sprintf("DELETE from types WHERE id = '%s'",
        mysql_real_escape_string($id));
    $result = mysql_query($query);

    // Alert failure
    if(!mysql_num_rows($result)) {
        header('HTTP/1.1 404 Not Found');
        return 'Could not find type.';
    }

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
