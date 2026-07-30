<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([
        "success" => false,
        "message" => "Δεν υπάρχει συνδεδεμένος χρήστης"
    ]);

    exit;
}



$user_id = $_SESSION["user_id"];



$id = $_POST["id"];

$content = $_POST["content"];

$technique = $_POST["technique"];



if(empty($content))
{
    echo json_encode([
        "success" => false,
        "message" => "Το κείμενο είναι κενό"
    ]);

    exit;
}




$sql = "UPDATE entries

        SET content = ?, technique = ?

        WHERE id = ?

        AND user_id = ?";




$stmt = $conn->prepare($sql);




$stmt->bind_param(
    "ssii",
    $content,
    $technique,
    $id,
    $user_id
);




if($stmt->execute())
{

    echo json_encode([
        "success" => true,
        "message" => "Η εγγραφή ενημερώθηκε"
    ]);

}
else
{

    echo json_encode([
        "success" => false,
        "message" => "Σφάλμα ενημέρωσης"
    ]);

}



$stmt->close();

$conn->close();


?>