<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([]);
    exit;
}


$user_id = $_SESSION["user_id"];


$sql = "SELECT *
        FROM moods
        WHERE user_id = ?
        ORDER BY created_at DESC";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result = $stmt->get_result();


$moods = [];


while($row = $result->fetch_assoc())
{
    $moods[] = $row;
}


echo json_encode($moods);



$stmt->close();
$conn->close();

?>