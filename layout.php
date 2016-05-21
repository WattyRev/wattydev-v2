<!DOCTYPE html>
<html>
    <head>
        <?php if(isset($data->title)):?>
            <title>WattyDev.com</title>
        <?php else: ?>
            <title>WattyDev.com | <?php echo $data->title; ?></title>
        <?php endif; ?>
    </head>
    <body>
        <?php include $template ?>
    </body>
</html>
