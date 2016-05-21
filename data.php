<?php
include 'api/database_connect.php';

class DataService {
    // Build the post data structure
    private function buidPost($result, $i) {
        $post = (object) array();
        $post->id = mysql_result($result, $i, 'id');
        $post->created = mysql_result($result, $i, 'created');
        $post->updated = mysql_result($result, $i, 'updated');
        $post->content = mysql_result($result, $i, 'content');
        $post->featuredImage = mysql_result($result, $i, 'featured_image');
        $post->title = mysql_result($result, $i, 'title');
        $post->status = mysql_result($result, $i, 'status');
        $post->slug = mysql_result($result, $i, 'slug');
        $post->referenceUrl = mysql_result($result, $i, 'reference_url');

        // get the type
        $typeId = mysql_result($result, $i, 'type');
        $query = sprintf("SELECT * FROM types WHERE id = '%s'",
            mysql_real_escape_string($typeId));
        $result = mysql_query($query);
        if(mysql_num_rows($result)) {
            $post->type = $self->buildType($result, 0);
        }

        // get the tags
        $post->tag = array();
        foreach(json_decode(mysql_result($result, $i, 'tags')) as $tagId) {
            $query = sprintf("SELECT * FROM tags WHERE id = '%s'",
                mysql_real_escape_string($tagId));
            $result = mysql_query($query);

            if(mysql_num_rows($result)) {
                array_push($post->tag, $self->buildTag($result, 0));
            }
        }
        return $post;
    }

    // Build the tag data structure
    private function buildTag($result, $i) {
        $tag = (object) array();
        $tag->id = mysql_result($result, $i, 'id');
        $tag->title = mysql_result($result, $i, 'title');
        $tag->slug = mysql_result($result, $i, 'slug');
        $tag->posts = array();
        return $tag;
    }

    // Build the type data structure
    private function buildType($result, $i) {
        $type = (object) array();
        $type->id = mysql_result($result, $i, 'id');
        $type->title = mysql_result($result, $i, 'title');
        $type->slug = mysql_result($result, $i, 'slug');
        $type->parent = mysql_result($result, $i, 'parent');
        $type->children = json_decode(mysql_result($result, $i, 'children'));
        $type->posts = array();
        return $type;
    }

    // Get all posts
    public function getPosts() {
        // Get all posts
        $query = sprintf("SELECT * FROM posts ORDER BY created");
        $result = mysql_query($query);
        $num = mysql_num_rows($result);

        // Generate data structure
        $posts = (object) array();
        $posts->posts = array();
        for($i = 0; $i < $num; $i++) {
            array_push($posts->posts, $self->buildPost($result, $i));
        }
        mysql_close();

        return $posts;
    }

    public function getPost($slug) {
        // Get post
        $query = sprintf("SELECT * FROM posts WHERE slug = '%s'",
            mysql_real_escape_string($slug));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            return false;
        }

        // Generate the data structure
        $post = $self->buildPost($result, 0);
        mysql_close();

        return $post;
    }

    public function getTag($slug) {
        // Get tag
        $query = sprintf("SELECT * FROM tags WHERE slug = '%s'",
            mysql_real_escape_string($slug));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            return false;
        }

        // Generate the data structure
        $tag = $self->buildTag($result, 0);

        // Get the relevant posts
        $query = "SELECT * from posts WHERE tags LIKE '%[$tag->id]%' OR tags LIKE '%[$tag->id,' OR tags LIKE '%,$tag->id,%' OR tags LIKE '%,$tag->id]%'";
        $result = mysql_query($query);
        $num = mysql_num_rows($result);
        if ($num > 0) {
            for($i = 0; $i < $num; $i++) {
                array_push($tag->posts, $self->buildPost($result, $i));
            }
        }
        mysql_close();

        return $tag;
    }

    public function getType($slug) {
        // Get type
        $query = sprintf("SELECT * FROM types WHERE slug = '%s'",
            mysql_real_escape_string($slug));
        $result = mysql_query($query);

        // Alert failure
        if(!mysql_num_rows($result)) {
            return false;
        }

        // Generate the data structure
        $type = $self->buildType($result, 0);

        // Get relevant posts
        $query = sprintf("SELECT * FROM posts WHERE type = '%s'",
            mysql_real_escape_string($type->id));
        $result = mysql_query($query);
        if ($num > 0) {
            for($i = 0; $i < $num; $i++) {
                array_push($type->posts, $self->buildPost($result, $i));
            }
        }
        mysql_close();

        return $type;
    }
}

$DS = new DataService();
