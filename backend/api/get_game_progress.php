<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([
        "success"=>false,
        "message"=>"Δεν υπάρχει χρήστης"
    ]);

    exit;
}


$user_id = $_SESSION["user_id"];


$game_name = $_GET["game_name"] ?? "";


$sql = "SELECT progress 
        FROM game_progress 
        WHERE user_id=? 
        AND game_name=?
        ORDER BY id DESC
        LIMIT 1";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "is",
    $user_id,
    $game_name
);


$stmt->execute();


$result = $stmt->get_result();


if($row = $result->fetch_assoc())
{

    echo $row["progress"];

}
else
{

    echo json_encode([
        "flowers"=>0,
        "mode"=>"simple"
    ]);

}


$stmt->close();
$conn->close();

?>