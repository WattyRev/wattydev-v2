<?php
include 'api/database_connect.php';

class DataService {
    public function getPosts() {
        // Get all posts
        $query = sprintf("SELECT * FROM posts ORDER BY created");
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
        $tag = (object) array();
        $tag->id = mysql_result($result, 0, 'id');
        $tag->title = mysql_result($result, 0, 'title');
        $tag->slug = mysql_result($result, 0, 'slug');
        $tag->posts = array();

        // Get the relevant posts
        $query = "SELECT * from posts WHERE tags LIKE '%[$tag->id]%' OR tags LIKE '%[$tag->id,' OR tags LIKE '%,$tag->id,%' OR tags LIKE '%,$tag->id]%'";
        $result = mysql_query($query);
        $num = mysql_num_rows($result);
        if ($num > 0) {
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
                array_push($tag->posts, $post);
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
        $type = (object) array();
        $type->id = mysql_result($result, 0, 'id');
        $type->title = mysql_result($result, 0, 'title');
        $type->slug = mysql_result($result, 0, 'slug');
        $type->parent = mysql_result($result, 0, 'parent');
        $type->children = json_decode(mysql_result($result, 0, 'children'));
        $type->posts = array();

        // Get relevant posts
        $query = sprintf("SELECT * FROM posts WHERE type = '%s'",
            mysql_real_escape_string($type->id));
        $result = mysql_query($query);
        if ($num > 0) {
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
                array_push($type->posts, $post);
            }
        }
        mysql_close();

        return $type;
    }
}

$DS = new DataService();
