<?php
// Return JSON response
header('Content-Type: application/json; charset=utf-8');

// 1. Set recipient
$to = "shawn@bitwide.com"; // <-- your email
$subject = "New lead: BitWide landing Snake";

// 2. Collect fields safely
$name    = isset($_POST['name']) ? trim($_POST['name']) : '';
$company = isset($_POST['company']) ? trim($_POST['company']) : '';
$email   = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if ($name === '' || $email === '') {
    echo json_encode(['ok' => false, 'error' => 'Required fields missing']);
    exit;
}

// 3. Build message text
$body = "New lead from BitWide landing:\n\n";
$body .= "Name: $name\n";
$body .= "Company: $company\n";
$body .= "Email: $email\n\n";
$body .= "Message:\n$message\n";

// 4. Headers
$headers  = "From: no-reply@bitwideanalytics.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// 5. Send
$sent = mail($to, $subject, $body, $headers);

// 6. Return JSON
echo json_encode(["ok" => $sent]);
