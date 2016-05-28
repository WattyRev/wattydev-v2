<!DOCTYPE html>
<html>
    <head>
        <?php if(isset($data->title)):?>
            <title>WattyDev.com</title>
        <?php else: ?>
            <title>WattyDev.com | <?php echo $data->title; ?></title>
        <?php endif; ?>
        <link href='https://fonts.googleapis.com/css?family=Architects+Daughter' rel='stylesheet' type='text/css'>
        <?php if (is_development()): ?>
            <link rel="stylesheet" href="/styles/app.css" />
        <?php else: ?>
            <link rel="stylesheet" href="/site/styles/app.css" />
        <?php endif; ?>

        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <header>
            <div class="container clearfix">
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

        <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    </body>
</html>
