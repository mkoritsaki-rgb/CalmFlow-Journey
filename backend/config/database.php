<?php

$host = "localhost";
$user = "root";
$password = "";
$database = "calmflow";


$conn = new mysqli(
    $host,
    $user,
    $password,
    $database
);

// Ρύθμιση χαρακτήρων για σωστή εμφάνιση ελληνικών
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {

    die("Η σύνδεση απέτυχε: " . $conn->connect_error);

}




?>