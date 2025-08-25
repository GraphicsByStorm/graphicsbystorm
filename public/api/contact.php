<?php
// public/api/contact.php

// --- SETTINGS ---
$MAIL_TO   = 'business@graphicsbystorm.com';          // must be a domain email you own
$MAIL_SUBJ = 'New message from graphicsbystorm.com';
$MAIL_FROM = 'business@graphicsbystorm.com';      // use a domain mailbox; improves deliverability
$REDIRECT_OK  = '/contact/?sent=1';
$REDIRECT_ERR = '/contact/?error=1';

// --- ONLY ALLOW POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('HTTP/1.1 405 Method Not Allowed');
  exit('Method Not Allowed');
}

// --- SIMPLE HONEYPOT ---
$botTrap = isset($_POST['website']) ? trim($_POST['website']) : '';
if ($botTrap !== '') {
  // Silently succeed to not tip off bots
  header('Location: ' . $REDIRECT_OK);
  exit;
}

// --- COLLECT + SANITIZE ---
function clean($v) {
  $v = is_array($v) ? implode(', ', $v) : $v;
  $v = trim($v);
  $v = strip_tags($v);
  return $v;
}
function no_header_injection($v) {
  return str_replace(array("\r", "\n"), ' ', $v);
}

$name     = isset($_POST['name'])     ? clean($_POST['name'])     : '';
$email    = isset($_POST['email'])    ? clean($_POST['email'])    : '';
$subject  = isset($_POST['subject'])  ? clean($_POST['subject'])  : 'Contact form';
$message  = isset($_POST['message'])  ? clean($_POST['message'])  : '';
$consent  = isset($_POST['consent'])  ? 'yes' : 'no'; // checkbox

// Basic validation
if ($name === '' || $email === '' || $message === '') {
  header('Location: ' . $REDIRECT_ERR);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  header('Location: ' . $REDIRECT_ERR);
  exit;
}

// Prevent header injection via From/Reply-To
$fromName  = no_header_injection($name);
$replyMail = no_header_injection($email);

// --- BUILD EMAIL ---
$bodyLines = array(
  "Name: " . $name,
  "Email: " . $email,
  "Consent: " . $consent,
  "Subject: " . $subject,
  "",
  $message
);
$body = implode("\n", $bodyLines);

// Headers
$headers = '';
$headers .= 'From: ' . $fromName . ' <' . $MAIL_FROM . '>' . "\r\n";
$headers .= 'Reply-To: ' . $replyMail . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Try to send
$ok = @mail($MAIL_TO, $MAIL_SUBJ, $body, $headers);

// Redirect either way (don’t leak errors to users)
header('Location: ' . ($ok ? $REDIRECT_OK : $REDIRECT_ERR));
exit;
