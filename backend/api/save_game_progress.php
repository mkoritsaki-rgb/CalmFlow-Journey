<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([
        "success"=>false,
        "message"=>"Δεν υπάρχει συνδεδεμένος χρήστης"
    ]);
    exit;
}


$user_id = $_SESSION["user_id"];

$game_name = $_POST["game_name"];
$progress = $_POST["progress"];



$sql = "INSERT INTO game_progress
(user_id, game_name, progress)
VALUES (?, ?, ?)";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "iss",
    $user_id,
    $game_name,
    $progress
);



if($stmt->execute())
{
    echo json_encode([
        "success"=>true,
        "message"=>"Game progress saved"
    ]);
}
else
{
    echo json_encode([
        "success"=>false,
        "message"=>$stmt->error
    ]);
}



$stmt->close();
$conn->close();

?>