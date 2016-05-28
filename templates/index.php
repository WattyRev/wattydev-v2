<div class="home">
    <section class="about-section gray">
        <div class="container clearfix">
            <?php include 'svg/aboutSvg.php'; ?>

            <article>
                <?php include 'svg/arrow.php'; ?>
                <h1>This is me.</h1>
                <p>I'm Spencer, and I'm a frontend developer. I build stuff and post about it here. I also post about other techy things sometimes.</p>
            </article>
        </div>
    </section>
    <section class="portfolio-section blue">
        <div class="container">
            <article>
                <h1>This is what I do.</h1>
                <ul class="post-list">
                    <?php foreach($data->portfolio as $post):?>
                        <?php
                        $url = '';
                        if ($post->featuredImage->url) {
                            $url = $post->featuredImage->url;
                        } else {
                            $url = '574a0e54395a1.png';
                        }
                        ?>
                        <a href="<?php echo build_url('post', $post->slug); ?>">
                            <li data-tooltip="<?php echo $post->title; ?>" style="background-image: url(http://wattydev.com/site/images/<?php echo $url ?>)">
                            </li>
                        </a>
                    <?php endforeach?>
                </ul>
            </article>

            <?php include 'svg/projectsSvg.php'; ?>
        </div>
    </section>
    <section class="blog-section gray">
        <div class="container clearfix">
            <?php include 'svg/blogSvg.php'; ?>

            <article>
                <h1>This is what I talk about.</h1>
                <ul class="post-list">
                    <?php foreach($data->blog as $post):?>
                        <a href="<?php echo build_url('post', $post->slug); ?>">
                            <li data-tooltip="<?php echo $post->title; ?>" style="background-image: url(http://wattydev.com/site/images/<?php echo $post->featuredImage->url ?>)">
                            </li>
                        </a>
                    <?php endforeach?>
                </ul>
            </article>
        </div>
    </section>
</div>
