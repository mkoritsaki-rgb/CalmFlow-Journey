<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([
        "success" => false,
        "message" => "Δεν υπάρχει συνδεδεμένος χρήστης"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}



$user_id = $_SESSION["user_id"];



$technique = trim($_POST["technique"] ?? "");

$content = trim($_POST["content"] ?? "");



if($technique === "")
{
    echo json_encode([
        "success" => false,
        "message" => "Δεν υπάρχει τεχνική"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}



if($content === "")
{
    echo json_encode([
        "success" => false,
        "message" => "Το κείμενο είναι κενό"
    ], JSON_UNESCAPED_UNICODE);

    exit;
}



$sql = "INSERT INTO entries
(user_id, technique, content)
VALUES (?, ?, ?)";



$stmt = $conn->prepare($sql);



$stmt->bind_param(
    "iss",
    $user_id,
    $technique,
    $content
);



if($stmt->execute())
{

    echo json_encode([
        "success" => true,
        "message" => "Η εγγραφή αποθηκεύτηκε!"
    ], JSON_UNESCAPED_UNICODE);

}
else
{

    echo json_encode([
        "success" => false,
        "message" => "Σφάλμα βάσης: " . $stmt->error
    ], JSON_UNESCAPED_UNICODE);

}



$stmt->close();

$conn->close();


?>