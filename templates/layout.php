<!DOCTYPE html>
<html>
    <head>
        <?php if(isset($data->title)):?>
            <title>WattyDev.com</title>
        <?php else: ?>
            <title>WattyDev.com | <?php echo $data->title; ?></title>
        <?php endif; ?>
        <link href='https://fonts.googleapis.com/css?family=Architects+Daughter' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="<?php echo build_url('css', 'app.css') ?>" />

        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <header>
            <div class="container clearfix">
                <a href="/" class="brand">
                    Spencer Watson
                </a>
                <div class="contact-links">
                    <a href="https://www.linkedin.com/in/spencer-watson-921a7043" target="_blank">in</a>
                    <a href="https://www.facebook.com/wattyrev" target="_blank">f</a>
                    <a href="https://github.com/wattyrev" target="_blank"><?php include 'svg/github.php'; ?></a>
                    <a class="show-contact"><?php include 'svg/mail.php'; ?></a>
                </div>
            </div>
        </header>
        <?php include 'templates/'.$template ?>

        <div class="contact-form">
            <div class="overlay"></div>
            <div class="modal">
                <div class="modal-close">&times;</div>
                <h1>Contact</h1>
                <div class="messages">
                    <span class="loading">Sending...</span>
                    <span class="error">Something went wrong! Email me directly at <a href="mailto:spencer@wattydev.com" target="_blank">spencer@wattydev.com</a>.
                </div>
                <p>
                    Use this form to send me an email. <small>No scam emails please.</small>
                </p>
                <form>
                    <div class="form-group">
                        <label for="contact-email">What's your email address?</label>
                        <input id="contact-email" type="email" placeholder="nigerianprince@totallynotascam.com" required />
                    </div>
                    <div class="form-group">
                        <label for="contact-subject">What are you contacting me about?</label>
                        <input if="contact-subject" type="text" placeholder="I want to give you money" required />
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Tell me about it.</label>
                        <textarea id="contact-message" placeholder="Dear Sir:

I have been requested by the Nigerian National Petroleum Company to contact you for assistance in resolving a matter. The Nigerian National Petroleum Company has recently concluded a large number of contracts for oil exploration in the sub-Sahara region..." required></textarea>
                    </div>
                    <div class="form-group clearfix">
                        <button class="pull-right btn btn-default">Send</button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
        <?php foreach(get_js() as $file):?>
            <script src="<?php echo build_url('js', $file); ?>"></script>
        <?php endforeach; ?>
    </body>
</html>
