<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "../config/database.php";



$username = trim($_POST["username"] ?? "");

$email = trim($_POST["email"] ?? "");

$password = $_POST["password"] ?? "";





if(
    empty($username) ||
    empty($email) ||
    empty($password)
)
{

    echo json_encode([
        "success"=>false,
        "message"=>"Όλα τα πεδία είναι υποχρεωτικά"
    ], JSON_UNESCAPED_UNICODE);

    exit;

}




// Έλεγχος αν υπάρχει ήδη username ή email

$check = $conn->prepare(
    "SELECT id FROM users WHERE email=? OR username=?"
);


$check->bind_param(
    "ss",
    $email,
    $username
);


$check->execute();


$result = $check->get_result();



if($result->num_rows > 0)
{

    echo json_encode([
        "success"=>false,
        "message"=>"Το email ή το username χρησιμοποιείται ήδη"
    ], JSON_UNESCAPED_UNICODE);

    exit;

}



$check->close();





// Δημιουργία κρυπτογραφημένου password

$hashedPassword =
password_hash(
    $password,
    PASSWORD_DEFAULT
);





// Εισαγωγή χρήστη

$sql = $conn->prepare(

"INSERT INTO users
(username,email,password)
VALUES (?,?,?)"

);



$sql->bind_param(
    "sss",
    $username,
    $email,
    $hashedPassword
);





if($sql->execute())
{

    $user_id = $conn->insert_id;



    // Δημιουργία αρχικής προόδου

    $progress = $conn->prepare(

    "INSERT INTO progress
    (user_id,sessions,total_minutes,favorite)
    VALUES (?,?,?,?)"

    );


    $sessions = 0;

    $minutes = 0;

    $favorite = "";



    $progress->bind_param(
        "iiis",
        $user_id,
        $sessions,
        $minutes,
        $favorite
    );



    $progress->execute();



    $progress->close();



    echo json_encode([
        "success"=>true,
        "message"=>"Ο χρήστης δημιουργήθηκε επιτυχώς"
    ], JSON_UNESCAPED_UNICODE);



}

else
{

    echo json_encode([
        "success"=>false,
        "message"=>"Σφάλμα δημιουργίας χρήστη"
    ], JSON_UNESCAPED_UNICODE);

}




$sql->close();

$conn->close();


?>