<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";


if(!isset($_SESSION["user_id"])){

    echo json_encode([
        "success"=>false,
        "message"=>"Δεν υπάρχει χρήστης"
    ]);

    exit;
}


$user_id = $_SESSION["user_id"];


// Μετράμε θεραπευτικές εγγραφές

$sql1 = "SELECT COUNT(*) as total 
         FROM entries 
         WHERE user_id=?";


$stmt1 = $conn->prepare($sql1);

$stmt1->bind_param(
    "i",
    $user_id
);

$stmt1->execute();

$result1 = $stmt1->get_result();

$entries = $result1->fetch_assoc()["total"];




// Μετράμε mood καταγραφές

$sql2 = "SELECT COUNT(*) as total 
         FROM moods 
         WHERE user_id=?";


$stmt2 = $conn->prepare($sql2);

$stmt2->bind_param(
    "i",
    $user_id
);

$stmt2->execute();

$result2 = $stmt2->get_result();

$moods = $result2->fetch_assoc()["total"];





// Κάθε 3 βήματα = 1 λουλούδι

$totalSteps = $entries + $moods;


$flowers = floor($totalSteps / 3);



echo json_encode([

    "success"=>true,

    "entries"=>$entries,

    "moods"=>$moods,

    "steps"=>$totalSteps,

    "flowers"=>$flowers

], JSON_UNESCAPED_UNICODE);



$stmt1->close();
$stmt2->close();

$conn->close();


?>
