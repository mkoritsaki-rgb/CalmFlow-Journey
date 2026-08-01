<?php

session_start();

require_once "../config/database.php";


header("Content-Type: text/plain; charset=UTF-8");


// Έλεγχος σύνδεσης

if(!isset($_SESSION["user_id"]))
{
    echo "Δεν υπάρχει συνδεδεμένος χρήστης.";
    exit;
}


$user_id = $_SESSION["user_id"];



// Ξεκινάμε συναλλαγή

$conn->begin_transaction();


try
{


    // Διαγραφή θεραπευτικής γραφής

    $stmt = $conn->prepare(
        "DELETE FROM entries WHERE user_id = ?"
    );

    $stmt->bind_param(
        "i",
        $user_id
    );

    $stmt->execute();



    // Διαγραφή moods

    $stmt = $conn->prepare(
        "DELETE FROM moods WHERE user_id = ?"
    );

    $stmt->bind_param(
        "i",
        $user_id
    );

    $stmt->execute();



    // Διαγραφή προόδου παιχνιδιών

    $stmt = $conn->prepare(
        "DELETE FROM game_progress WHERE user_id = ?"
    );

    $stmt->bind_param(
        "i",
        $user_id
    );

    $stmt->execute();



    // Διαγραφή γενικής προόδου

    $stmt = $conn->prepare(
        "DELETE FROM progress WHERE user_id = ?"
    );

    $stmt->bind_param(
        "i",
        $user_id
    );

    $stmt->execute();



    // Διαγραφή λογαριασμού

    $stmt = $conn->prepare(
        "DELETE FROM users WHERE id = ?"
    );

    $stmt->bind_param(
        "i",
        $user_id
    );

    $stmt->execute();



    // Ολοκλήρωση

    $conn->commit();



    session_destroy();



    echo "Ο λογαριασμός και όλα τα προσωπικά δεδομένα διαγράφηκαν επιτυχώς.";

}


catch(Exception $e)
{


    $conn->rollback();


    echo "Παρουσιάστηκε σφάλμα κατά τη διαγραφή.";

}


?>
