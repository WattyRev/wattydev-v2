<?php
include 'api/init.php';

$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'] . "\n\nSent from wattydev.com";
$message = wordwrap($message,70);
$headers = "From: noreply@wattydev.com" . "\r\n" .
    "Reply-To: $email" . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// send email
mail("spencer@wattydev.com",$subject,$message,$headers);
