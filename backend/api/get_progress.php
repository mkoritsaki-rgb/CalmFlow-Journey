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



$sql = "SELECT * FROM progress WHERE user_id = ?";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result = $stmt->get_result();


if($row = $result->fetch_assoc())
{
    echo json_encode([
        "sessions" => $row["sessions"],
        "totalMinutes" => $row["total_minutes"],
        "favorite" => $row["favorite"]
    ], JSON_UNESCAPED_UNICODE);
}
else
{
    echo json_encode([
        "sessions" => 0,
        "totalMinutes" => 0,
        "favorite" => ""
    ], JSON_UNESCAPED_UNICODE);
}



$stmt->close();

$conn->close();

?>