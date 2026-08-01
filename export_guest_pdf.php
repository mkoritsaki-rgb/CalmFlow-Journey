<?php

require_once "../../vendor/autoload.php";

use Dompdf\Dompdf;
use Dompdf\Options;


// Παίρνουμε δεδομένα από Javascript

$data = json_decode(
    file_get_contents("php://input"),
    true
);


$journal = $data["journal"] ?? [];

$moods = $data["moods"] ?? [];

$gardenFlowers = floor(count($journal) / 3);

$techniqueCount = [];

foreach($journal as $entry){

    $technique = $entry["technique"] ?? "";

    if($technique != ""){

        if(isset($techniqueCount[$technique])){

            $techniqueCount[$technique]++;

        }
        else{

            $techniqueCount[$technique] = 1;

        }

    }

}


$favoriteTechnique = "";

$favoriteUses = 0;


foreach($techniqueCount as $technique => $count){

    if($count > $favoriteUses){

        $favoriteUses = $count;

        $favoriteTechnique = $technique;

    }

}


// ===============================
// Quotes CalmFlow
// ===============================

$quotes = [

    "Μία ανάσα τη φορά. Κάθε μικρό βήμα έχει αξία.",

    "Η ηρεμία δεν χρειάζεται να είναι τέλεια. Χρειάζεται χώρο.",

    "Άκου τις σκέψεις σου χωρίς να τις κρίνεις.",

    "Η φροντίδα του εαυτού σου ξεκινά με μικρές στιγμές.",

    "Μερικές φορές μια μικρή παύση είναι αρκετή για να συνεχίσεις.",

    "Δεν χρειάζεται να λύσεις τα πάντα σήμερα. Ένα μικρό βήμα αρκεί.",

    "Λίγος χρόνος για εσένα μπορεί να κάνει διαφορά.",

   "Δώσε λίγο χρόνο σε όσα αισθάνεσαι.",

    "Μερικές σκέψεις χρειάζονται απλώς να ακουστούν.",

    "Το να σταματάς για λίγο είναι επίσης μια μορφή προόδου.",

    "Η αυτοφροντίδα δεν είναι πολυτέλεια. Είναι ανάγκη.",

    "Η γραφή μπορεί να γίνει ένας ασφαλής χώρος για τις σκέψεις σου.",

    "Μάθε να ακούς τον εαυτό σου όπως θα άκουγες έναν φίλο.",

    "Η ηρεμία χτίζεται μέσα από μικρές καθημερινές επιλογές.",

    "Ό,τι αισθάνεσαι έχει χώρο να υπάρχει.",

    "Κάθε ανάσα είναι μια μικρή επιστροφή στο παρόν."

];

$quote = $quotes[array_rand($quotes)];



// ===============================
// PDF Settings
// ===============================


$options = new Options();

$options->setDefaultFont("DejaVu Sans");

$options->set(
    "isFontSubsettingEnabled",
    false
);

$options->set(
    "isHtml5ParserEnabled",
    true
);

$options->set(
    "isRemoteEnabled",
    true
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

font-size:16px;

font-style:italic;

}



.section-title{

color:#2e7d32;

margin-top:30px;

}



.card{

background:white;

padding:18px;

margin-bottom:18px;

border:1px solid #dfe8df;

border-radius:15px;

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

Αναφορά Καταγραφών

</div>


<p>

'.date("d/m/Y").'

</p>


</div>



<div class="quote">

'.$quote.'

</div>



<h2 class="section-title">

Καταγραφές Σκέψεων

</h2>


';



// ===============================
// Journal
// ===============================


if(count($journal)==0)
{

$html .= '

<div class="card">

Δεν υπάρχουν ακόμη εγγραφές.

</div>

';

}

else
{


foreach($journal as $entry)
{


$html .= '

<div class="card">


<p class="date">

Ημερομηνία:
'
.htmlspecialchars($entry["created_at"])
.'

</p>


<p class="technique">

Τεχνική:
'
.htmlspecialchars($entry["technique"] ?? "Χωρίς τεχνική")
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


<p>

Χρησιμοποιήθηκε:

<strong>
'.$favoriteUses.'
</strong>

φορές

</p>


</div>

';


$html .= '

<h2 class="section-title">

Mood Tracker

</h2>

';




// ===============================
// Moods
// ===============================


if(count($moods)==0)
{

$html .= '

<div class="card">

Δεν υπάρχουν καταγραφές διάθεσης.

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
'
.htmlspecialchars($mood["created_at"])
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




// Δημιουργία PDF


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
    "CalmFlow_Guest_Report.pdf",
    [
        "Attachment"=>false
    ]
);


?>