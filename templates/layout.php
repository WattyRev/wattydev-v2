<!DOCTYPE html>
<html>
    <head>
        <?php if(isset($data->title)):?>
            <title>WattyDev.com</title>
        <?php else: ?>
            <title>WattyDev.com | <?php echo $data->title; ?></title>
        <?php endif; ?>

        <link rel="stylesheet" href="/styles/app.css" />
    </head>
    <body>
        <header>
            <nav>
                <a class="about-link">About</a>
                <a class="portfolio-link">Projects</a>
                <a class="blog-link">Blog</a>
            </nav>
            <div class="brand">
                Spencer Watson
            </div>
        </header>
        <?php include 'templates/'.$template ?>
    </body>
</html>
