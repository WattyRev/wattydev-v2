<section class="about-section">
    <div class="container">
        <?php include 'svg/aboutSvg.php'; ?>

        <article>
            <h1>This is me.</h1>
            <p>
                My name is Spencer Watson, and I am a frontend web developer. I currently work as a Software Design Engineer at <a href="http://www.bittitan.com" target="_blank">BitTitan</a> and have been working as a developer since 2012. This is my portfolio website, where I post about all the projects that I work on, and I write blog posts about technical issues that I have solved. If you want to contact me, feel free to do so using one of the buttons below.
            </p>

            <div class="contact-links">
                <a href="https://www.linkedin.com/in/spencer-watson-921a7043" target="_blank">LinkedIn</a>
                <a href="https://www.facebook.com/wattyrev" target="_blank">Facebook</a>
                <a href="#">Email</a>
            </div>
            <form class="email-form">
                <div class="form-group">
                    <label>Your Email Address</label>
                    <input type="email" placeholder="adoring_fan@gmail.com"/>
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" placeholder="You're so amazing! Will you have my babies!?"/>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <textarea></textarea>
                </div>
                <button>Send</button>
            </form>
        </article>
    </div>
</section>
<section class="portfolio-section">
    <div class="container">
        <article>
            <h1>This is what I do.</h1>
            <ul>
                <?php foreach($data->portfolio as $post):?>
                    <li>
                        <img src="http://wattydev.com/site/images/<?php echo $post->featuredImage->url ?>" />
                    </li>
                <?php endforeach?>
            </ul>
        </article>

        <?php include 'svg/projectsSvg.php'; ?>
    </div>
</section>
<section class="blog-section">
    <div class="container">
        <?php include 'svg/blogSvg.php'; ?>

        <article>
            <h1>This is waht I talk about.</h1>
            <ul>
                <?php foreach($data->blog as $post):?>
                    <li>
                        <img src="http://wattydev.com/site/images/<?php echo $post->featuredImage->url ?>" />
                    </li>
                <?php endforeach?>
            </ul>
        </article>
    </div>
</section>
