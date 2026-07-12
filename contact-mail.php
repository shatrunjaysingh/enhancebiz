<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "info@enhance-biz.com"; // Your email address

    // Get and sanitize input
    $fname = trim($_POST['fname']);
    $lname = trim($_POST['lname']);
    $from = trim($_POST['email']);
    $company = trim($_POST['company']);
    $messageBody = trim($_POST['message']);

    // Validate email
    if (!filter_var($from, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // Build email content
    $subject = "Contact Form Message from $fname $lname for Company: $company";

    $message = "Name: $fname $lname\n";
    $message .= "Company: $company\n";
    $message .= "Email: $from\n";
    $message .= "Message:\n$messageBody";

    // Set headers
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    // Send and redirect
    if (mail($to, $subject, $message, $headers)) {
        header("Location: /contact-us.html?status=success");
        exit;
    } else {
        header("Location: /contact-us.html?status=error");
        exit;
    }
}
?>