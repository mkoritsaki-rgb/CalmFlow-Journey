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

$mood = $_POST["mood"];
$level = $_POST["level"];
$note = $_POST["note"];



$sql = "INSERT INTO moods
(user_id, mood, level, note)
VALUES (?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "isis",
    $user_id,
    $mood,
    $level,
    $note
);



if($stmt->execute())
{
    echo json_encode([
        "success"=>true,
        "message"=>"Mood saved"
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