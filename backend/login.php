<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

header("Content-Type: text/plain; charset=UTF-8");

require_once "../config/database.php";


$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";



if(empty($email) || empty($password))
{
    echo "Συμπλήρωσε email και κωδικό";
    exit;
}



$sql = "SELECT * FROM users WHERE email=?";


$stmt = $conn->prepare($sql);


if(!$stmt)
{
    echo "Σφάλμα βάσης";
    exit;
}



$stmt->bind_param(
    "s",
    $email
);



$stmt->execute();



$result = $stmt->get_result();



if($result->num_rows > 0)
{

    $user = $result->fetch_assoc();



    if(password_verify($password, $user["password"]))
    {


        $_SESSION["user_id"] = $user["id"];

        $_SESSION["username"] = $user["username"];



        echo "SUCCESS|"
        . $user["id"]
        . "|"
        . $user["username"];


    }
    else
    {

        echo "Λάθος email ή κωδικός";

    }


}
else
{

    echo "Λάθος email ή κωδικός";

}



$stmt->close();

$conn->close();


?>