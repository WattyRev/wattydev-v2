<!DOCTYPE html>
<html>
    <head>
        <?php if(isset($data->title)):?>
            <title>WattyDev.com</title>
        <?php else: ?>
            <title>WattyDev.com | <?php echo $data->title; ?></title>
        <?php endif; ?>

        <link rel="stylesheet" href="/site/styles/app.css" />
    </head>
    <body>
        <header>
            <div class="container clearfix">>
                <a href="/" class="brand">
                    Spencer Watson
                </a>
                <nav>
                    <a class="about-link">About</a>
                    <a class="portfolio-link">Projects</a>
                    <a class="blog-link">Blog</a>
                </nav
            </div>
        </header>
        <?php include 'templates/'.$template ?>
    </body>
</html>
