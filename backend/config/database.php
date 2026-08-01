<?php

$host = "sql207.infinityfree.com";
$user = "if0_41795264";
$password ="VjNEjPgYIH8S0";
$database ="if0_41795264_calmflow";


$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

// Ρύθμιση χαρακτήρων για σωστή εμφάνιση ελληνικών
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {

    die("DB ERROR: " . $conn->connect_error);

}




?>