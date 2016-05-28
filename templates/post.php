<?php
include 'lib/parsedown.php';
 ?>
 <div class="post">
    <section class="preview blue">
        <div class="container">
            <?php if ($data->post->type->title === 'Video Production'): ?>

            <?php elseif (isset($data->post->referenceUrl)): ?>
                <iframe src="<?php echo $data->post->referenceUrl; ?>" width="<?php echo $data->post->embedx;?>" height="<?php echo $data->post->embedy;?>"></iframe>
            <?php elseif (isset($data->post->featuredImage)): ?>
                <img src="http://wattydev.com/site/images/<?php echo $data->post->featuredImage->url; ?>" />
            <?php else: ?>

            <?php endif; ?>
        </div>
    </section>
    <section class="content gray">
        <div class="container">
            <h1><?php echo $data->post->title; ?></h1>
            <?php echo $Parsedown->text($data->post->content); ?>
            <?php if (count($data->post->tags)): ?>
                <p>This project uses:
                    <?php foreach($data->post->tags as $i=>$tag):
                        echo $i > 0 ? ', ' : '';
                        echo $i === count($data->post->tags) - 1 ? 'and ' : '';
                        ?><a href="<?php echo build_url('tag', $tag->slug); ?>">
                            <?php echo $tag->title; ?>
                        </a><?php
                    endforeach; ?>
                </p>
            <?php endif; ?>
        </div>
    </section>
</div>
