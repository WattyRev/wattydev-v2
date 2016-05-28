<?php
include 'lib/parsedown.php';
?>
<?php
$showPreview = $data->post->type->title !== 'Blog' && ((isset($data->post->referenceUrl) && $data->post->referenceUrl !== '') || isset($data->post->featuredImage));
?>
<div class="post">
    <?php if ($showPreview):?>
        <section class="preview blue">
            <div class="container">
                <?php if ($data->post->type->title === 'Video Production' && isset($data->post->referenceUrl) && $data->post->referenceUrl !== ''): ?>
                    <div class="video">
                        <?php
                            $url = $data->post->referenceUrl;
                            if (strpos($url, '/watch') !== false) {
                                $url = str_replace('/watch?v=', '/embed/', $data->post->referenceUrl);
                            }
                        ?>
                        <iframe src="<?php echo $url; ?>" frameborder="0" allowfullscreen></iframe>
                    </div>
                <?php elseif (isset($data->post->referenceUrl) && $data->post->referenceUrl !== ""): ?>
                    <iframe src="<?php echo $data->post->referenceUrl; ?>" width="<?php echo $data->post->embedx;?>" height="<?php echo $data->post->embedy;?>"></iframe>
                    <div class="overlay"></div>
                <?php elseif (isset($data->post->featuredImage)): ?>
                    <img src="http://wattydev.com/site/images/<?php echo $data->post->featuredImage->url; ?>" />
                <?php endif; ?>
            </div>
        </section>
    <?php endif; ?>
    <section class="content gray <?php echo $showPreview ? '' : 'full'; ?>">
        <div class="container">
            <h1><?php echo $data->post->title; ?></h1>
            <?php if($data->post->type->title !== 'Blog'): ?>
                <p><small><a href="<?php echo build_url('type', $data->post->type->slug); ?>"><?php echo $data->post->type->title; ?> Project</a></small></p>
            <?php else: ?>
                <br/>
            <?php endif; ?>
            <?php echo $Parsedown->text($data->post->content); ?>
            <?php if (count($data->post->tags)): ?>
                <br/>
                <small><p>This project uses:
                    <?php foreach($data->post->tags as $i=>$tag):
                        echo $i > 0 ? ', ' : '';
                        echo $i === count($data->post->tags) - 1 && $i !== 0 ? 'and ' : '';
                        ?><a href="<?php echo build_url('tag', $tag->slug); ?>">
                            <?php echo $tag->title; ?>
                        </a><?php
                    endforeach; ?>
                </p></small>
            <?php endif; ?>
        </div>
    </section>
</div>
