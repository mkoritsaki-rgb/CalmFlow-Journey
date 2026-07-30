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
if(empty($_POST["id"]))
{
    echo json_encode([
        "success" => false,
        "message" => "Δεν δόθηκε ID εγγραφής"
    ]);
    exit;
}

$id = (int)$_POST["id"];





$sql = "DELETE FROM entries 
        WHERE id = ? 
        AND user_id = ?";



$stmt = $conn->prepare($sql);



$stmt->bind_param(
    "ii",
    $id,
    $user_id
);



if($stmt->execute())
{

    echo json_encode([
        "success" => true,
        "message" => "Η εγγραφή διαγράφηκε"
    ]);

}
else
{

    echo json_encode([
        "success" => false,
        "message" => "Σφάλμα διαγραφής"
    ]);

}



$stmt->close();

$conn->close();


?>