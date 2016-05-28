<?php
include 'lib/parsedown.php';
?>
<div class="list">
    <section class="gray">
        <div class="container">
            <h1><?php echo $data->type->title ?> Projects</h1>
        </div>
    </section>

    <?php foreach($data->type->posts as $index=>$post): ?>
        <section class="<?php echo $index % 2 ? 'gray' : 'blue';?>">
            <div class="container clearfix">
                <div class="thumbail">
                    <?php
                    $url = '';
                    if ($post->featuredImage->url) {
                        $url = $post->featuredImage->url;
                    } else {
                        $url = '574a0e54395a1.png';
                    }
                    ?>
                    <a href="<?php echo build_url('post', $post->slug); ?>">
                        <img src="http://wattydev.com/site/images/<?php echo $url ?>" />
                    </a>
                </div>
                <div class="content">
                    <h2><a href="<?php echo build_url('post', $post->slug); ?>"><?php echo $post->title ?></a></h2>
                    <?php echo truncate_html($Parsedown->text($post->content), 200); ?>
                    <p><a href="<?php echo build_url('post', $post->slug); ?>">Read More</a></p>
                </div>
            </div>
        </section>
    <?php endforeach; ?>
</div>
