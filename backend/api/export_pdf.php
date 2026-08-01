<?php

session_start();

require_once "../config/database.php";
require_once "../../vendor/autoload.php";

use Dompdf\Dompdf;
use Dompdf\Options;


if(!isset($_SESSION["user_id"]))
{
    die("Δεν υπάρχει συνδεδεμένος χρήστης.");
}


$user_id = $_SESSION["user_id"];

 

// ===============================
// Quotes CalmFlow
// ===============================

$quotes = [

    "Μία ανάσα τη φορά. Κάθε μικρό βήμα έχει αξία.",

    "Η ηρεμία δεν χρειάζεται να είναι τέλεια. Χρειάζεται χώρο.",

    "Άκου τις σκέψεις σου χωρίς να τις κρίνεις.",

   "Η φροντίδα του εαυτού σου ξεκινά από μικρές στιγμές.",

    "Μια μικρή ανάσα μπορεί να γίνει μια μικρή παύση μέσα στη μέρα.",

    "Δεν χρειάζεται να λύσεις τα πάντα σήμερα. Ένα μικρό βήμα αρκεί.",

   "Δώσε στον εαυτό σου λίγο χρόνο χωρίς πίεση.",

    "Κάθε στιγμή ηρεμίας είναι μια στιγμή φροντίδας.",

    "Οι σκέψεις σου είναι μέρος του ταξιδιού σου, όχι ολόκληρη η διαδρομή.",

    "Το να παρατηρείς όσα νιώθεις είναι ένα πρώτο βήμα.",

    "Μερικά βήματα χρειάζονται χρόνο.",

    "Η ηρεμία βρίσκεται συχνά στις μικρές στιγμές που επιλέγουμε να προσέξουμε.",

    "Το να γράφεις τις σκέψεις σου είναι ένας τρόπος να τις κατανοήσεις.",

    "Κάθε σελίδα που γράφεις είναι ένα βήμα πιο κοντά στον εαυτό σου."

];


$quote = $quotes[array_rand($quotes)];



// ===============================
// Θεραπευτικές εγγραφές
// ===============================


$sqlEntries = 
"SELECT * FROM entries 
WHERE user_id = ?
ORDER BY created_at DESC";


$stmtEntries = $conn->prepare($sqlEntries);


$stmtEntries->bind_param(
    "i",
    $user_id
);


$stmtEntries->execute();


$resultEntries = $stmtEntries->get_result();


$entries = [];


while($row = $resultEntries->fetch_assoc())
{
    $entries[] = $row;
}



// ===============================
// Mood Tracker
// ===============================


$sqlMoods = 
"SELECT * FROM moods 
WHERE user_id = ?
ORDER BY created_at DESC";


$stmtMoods = $conn->prepare($sqlMoods);


$stmtMoods->bind_param(
    "i",
    $user_id
);


$stmtMoods->execute();


$resultMoods = $stmtMoods->get_result();


$moods = [];


while($row = $resultMoods->fetch_assoc())
{
    $moods[] = $row;
}
$totalEntries = count($entries);
$totalMoods = count($moods);



$totalSteps = $totalEntries + $totalMoods;
$gardenFlowers = floor($totalSteps / 3);

$averageMood = 0;

// Favorite Technique

$techniqueCounts = [];

foreach($entries as $entry)
{
    $technique = $entry["technique"];

    if(!isset($techniqueCounts[$technique]))
    {
        $techniqueCounts[$technique] = 0;
    }

    $techniqueCounts[$technique]++;
}


$favoriteTechnique = "Δεν υπάρχει ακόμα";


if(!empty($techniqueCounts))
{
    $favoriteTechnique = array_search(
        max($techniqueCounts),
        $techniqueCounts
    );
}

// ===============================
// CalmFlow Statistics
// ===============================

$totalEntries = count($entries);

$totalMoods = count($moods);

$averageMood = 0;


if($totalMoods > 0)
{

    $sumMood = 0;


    foreach($moods as $mood)
    {
        $sumMood += intval($mood["level"]);
    }


    $averageMood = round(
        $sumMood / $totalMoods,
        1
    );

}




// ===============================
// PDF Settings
// ===============================


$options = new Options();


$options->set(
    "defaultFont",
    "DejaVu Sans"
);


$dompdf = new Dompdf($options);



$html = '

<html lang="el">

<head>

<meta charset="UTF-8">


<style>


body{

font-family: DejaVu Sans, sans-serif;

background:#f4fbf7;

color:#333;

}



.header{

text-align:center;

padding:20px;

}



.logo{

font-size:28px;

color:#2e7d32;

font-weight:bold;

}



.subtitle{

font-size:18px;

color:#555;

}



.quote{

margin:25px 0;

padding:20px;

background:#e8f5e9;

border-left:6px solid #43a047;

border-radius:12px;

font-size:16px;

font-style:italic;

}



.section-title{

color:#2e7d32;

margin-top:30px;

}



.card{

background:white;

border-radius:15px;

padding:18px;

margin-bottom:18px;

border:1px solid #dfe8df;

}



.date{

color:#777;

font-size:13px;

}



.technique{

color:#2e7d32;

font-weight:bold;

}



.footer{

text-align:center;

margin-top:40px;

color:#666;

font-size:14px;

}



</style>


</head>



<body>



<div class="header">



<div class="logo">

CalmFlow Journey

</div>


<div class="subtitle">

Προσωπική Αναφορά CalmFlow Journey

</div>


<p>

'.date("d/m/Y").'

</p>


</div>



<div class="quote">

 '.$quote.'

</div>


<h2 class="section-title">

 Προσωπικές Καταγραφές
</h2>


';
// ===============================
// Εμφάνιση Προσωπικών Καταγραφών
// ===============================


if(count($entries) == 0)
{

$html .= '

<div class="card">

Δεν υπάρχουν ακόμη εγγραφές θεραπευτικής γραφής.

</div>

';

}

else
{

foreach($entries as $entry)
{


$html .= '

<div class="card">


<p class="date">

 '
.htmlspecialchars($entry["created_at"])
.'

</p>



<p class="technique">

'
.htmlspecialchars($entry["technique"])
.'

</p>



<p>

'
.nl2br(htmlspecialchars($entry["content"]))
.'

</p>



</div>


';

}

}

$html .= '

<h2 class="section-title">

⭐ Αγαπημένη Τεχνική

</h2>


<div class="card">

<p>

⭐ Η τεχνική που χρησιμοποιείς περισσότερο:

<strong>
'.htmlspecialchars($favoriteTechnique).'
</strong>

</p>

</div>

';



$html .= '

<h2 class="section-title">

 Mood Tracker

</h2>

';
// ===============================
// Εμφάνιση Mood Tracker
// ===============================


if(count($moods) == 0)
{

$html .= '

<div class="card">

Δεν υπάρχουν ακόμη καταγραφές διάθεσης.

</div>

';

}

else
{

foreach($moods as $mood)
{


$html .= '

<div class="card">


<p class="date">

 Ημερομηνία: 
'.htmlspecialchars($mood["created_at"])
.'

</p>



<p class="technique">

 Διάθεση:
'
.htmlspecialchars($mood["mood"])
.'

</p>



<p>

Ένταση:
'
.htmlspecialchars($mood["level"])
.'
/10

</p>



<p>

'
.nl2br(htmlspecialchars($mood["note"]))
.'

</p>



</div>


';

}

}


$html .= '

<h2 class="section-title">

✿ Sunflower Garden Journey

</h2>


<div class="card">


<p>

✿ Λουλούδια που άνθισαν:

<strong>
'.$gardenFlowers.'
</strong>


</p>


<p>';



if($gardenFlowers == 0)
{

    $html .= '
    🌱 Ο κήπος σου περιμένει το πρώτο σου λουλούδι.
    ';

}

else if($gardenFlowers < 5)
{

    $html .= '
    🌿 Ο κήπος σου αρχίζει να μεγαλώνει.
    ';

}

else
{

    $html .= '
    ✿ Η φροντίδα σου δημιούργησε έναν ανθισμένο κήπο.
    ';

}


$html .= '

</p>


</div>

';

// ===============================
// Footer
// ===============================


$html .= '

<div class="footer">

<p>

 CalmFlow Journey

</p>


<p>

Μία ανάσα τη φορά.

</p>


<p>

Κάθε μικρό βήμα προς την ηρεμία μετράει.

</p>


</div>



</body>

</html>

';
// ===============================
// Δημιουργία PDF
// ===============================


$dompdf->loadHtml(
    $html,
    "UTF-8"
);


$dompdf->setPaper(
    "A4",
    "portrait"
);


$dompdf->render();



$dompdf->stream(
    "CalmFlow_Report.pdf",
    [
        "Attachment" => true
    ]
);

?>
