<?php



if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"]))
{
    echo json_encode([]);
    exit;
}


$user_id = $_SESSION["user_id"];





$sql = "SELECT * FROM entries WHERE user_id = ? ORDER BY created_at DESC";

$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "i",
    $user_id
);



$stmt->execute();



$result = $stmt->get_result();



$entries = [];



while($row = $result->fetch_assoc())
{

    $entries[] = $row;

}



echo json_encode($entries, JSON_UNESCAPED_UNICODE);



$stmt->close();

$conn->close();


?>