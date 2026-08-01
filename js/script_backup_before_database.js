function startBreathing() {


    document.getElementById("breathing-area").innerHTML = `

        <div class="breathing-box">

            <h2>CalmFlow Breathing</h2>


            <div class="breathing-line">

                <div id="light-point"></div>

            </div>


            <h3 id="breathing-text">
                Εισπνοή
            </h3>


            <p id="breathing-count">
                5
            </p>


        </div>

    `;



    let phases = [
        "Εισπνοή",
        "Κράτημα",
        "Εκπνοή",
        "Κράτημα"
    ];



    let phase = 0;

    let seconds = 5;



    let lightPoint = document.getElementById("light-point");



    lightPoint.style.left = "0px";

    lightPoint.style.transform =
    "translateY(-50%) scale(1)";



    setTimeout(function(){

        lightPoint.style.left = "220px";

        lightPoint.style.transform =
        "translateY(-50%) scale(1.3)";


    },100);





    let timer = setInterval(function(){



        seconds--;



        document.getElementById("breathing-count").innerHTML =
        seconds;




        if(seconds === 0){



            phase++;



            if(phase === phases.length){

                phase = 0;

            }




            document.getElementById("breathing-text").innerHTML =
            phases[phase];



            seconds = 5;



            document.getElementById("breathing-count").innerHTML =
            seconds;




            if(phases[phase] === "Εισπνοή"){


                lightPoint.style.left = "220px";


                lightPoint.style.transform =
                "translateY(-50%) scale(1.3)";


            }





            else if(phases[phase] === "Κράτημα"){


                lightPoint.style.transform =
                "translateY(-50%) scale(1.3)";


            }





            else if(phases[phase] === "Εκπνοή"){


                lightPoint.style.left = "0px";


                lightPoint.style.transform =
                "translateY(-50%) scale(1)";


            }



        }



    },1000);



}




// ===============================
// CalmFlow JSON Data
// ===============================


fetch("calmflow_data.json")

.then(response => response.json())

.then(data => {


    console.log("CalmFlow Data:", data);

let writingStats = {

    total: 0,
    reflective: 0,
    expressive: 0,
    gratitude: 0,
    letter: 0

};


let journalEntries =
JSON.parse(localStorage.getItem("calmflow_journal")) || [];


writingStats.total = journalEntries.length;


journalEntries.forEach(function(entry)
{

    if(entry.type === "Στοχαστικό Ημερολόγιο")
    {
        writingStats.reflective++;
    }


    else if(entry.type === "Εκφραστική Γραφή")
    {
        writingStats.expressive++;
    }


    else if(entry.type === "Ημερολόγιο Ευγνωμοσύνης")
    {
        writingStats.gratitude++;
    }


    else if(entry.type === "Γράμμα στον Εαυτό μου")
    {
        writingStats.letter++;
    }

});

    const progressBox =
    document.getElementById("progress-data");



    if(progressBox)
    {

        progressBox.innerHTML = `


        <h3>🌱 Η πρόοδός σου</h3>



        <p>
        📌 Συνεδρίες: ${data.sessions}
        </p>



        <p>
        ⏱ Συνολικός χρόνος:
        ${data.totalMinutes} λεπτά
        </p>

         <p>
        ⭐ Αγαπημένη τεχνική:
         ${data.favorite}
</p>

        <hr>



        <h4>Οι τεχνικές σου:</h4>



        <p>
        🫁 Box Breathing:
        ${data.breathing}
        </p>



        <p>
        📖 Στοχαστικό Ημερολόγιο:
        ${data.reflective}
        </p>



        <p>
        ✍️ Εκφραστική Γραφή:
        ${data.expressive}
        </p>



        <p>
        🌿 Ημερολόγιο Ευγνωμοσύνης:
        ${data.gratitude}
        </p>



        <p>
        💌 Γράμμα στον Εαυτό μου:
        ${data.letter}
        </p>

<h4>✍️ Θεραπευτική Γραφή</h4>


<p>
📚 Συνολικές εγγραφές:
${writingStats.total}
</p>


<p>
📖 Στοχαστικό Ημερολόγιο:
${writingStats.reflective}
</p>


<p>
✍️ Εκφραστική Γραφή:
${writingStats.expressive}
</p>


<p>
🌿 Ημερολόγιο Ευγνωμοσύνης:
${writingStats.gratitude}
</p>


<p>
💌 Γράμμα στον Εαυτό μου:
${writingStats.letter}
</p>


        `;

    }



})

.catch(error => {


    console.log("Σφάλμα φόρτωσης δεδομένων:", error);


});






// ===============================
// Εμφάνιση / Απόκρυψη Progress
// ===============================


function toggleProgress()

{


    const progressBox =
    document.getElementById("progress-data");



    const button =
    document.getElementById("progress-button");




    if(progressBox.style.display === "none")

    {


        progressBox.style.display = "block";


        button.innerHTML =
        "Κρύψε την πρόοδό σου";


    }

    else

    {


        progressBox.style.display = "none";


        button.innerHTML =
        "Δες την πρόοδό σου";


    }


}
// ===============================
// Θεραπευτική Γραφή
// ===============================

function openJournal()
{

    document.getElementById("journal-area").innerHTML = `


        <h4>✍️ Θεραπευτική Γραφή</h4>
<div class="journal-card message-card">

    <div id="writing-message">

    </div>

</div>

<br>

        <p>
        Διάλεξε μια άσκηση γραφής:
        </p>


        <select id="journal-type">

            <option value="Στοχαστικό Ημερολόγιο">
            📖 Στοχαστικό Ημερολόγιο
            </option>


            <option value="Εκφραστική Γραφή">
            ✍️ Εκφραστική Γραφή
            </option>


            <option value="Ημερολόγιο Ευγνωμοσύνης">
            🌿 Ημερολόγιο Ευγνωμοσύνης
            </option>


            <option value="Γράμμα στον Εαυτό μου">
            💌 Γράμμα στον Εαυτό μου
            </option>


        </select>



        <br><br>



     <textarea 
id="journal-text"
placeholder="Γράψε ό,τι αισθάνεσαι σήμερα..."
></textarea>

<p id="journal-prompt">

Τι σκέψεις ή συναισθήματα εμφανίστηκαν σήμερα;

</p>


        <br><br>



        <button onclick="saveJournal()">
        Αποθήκευση ✨
        </button>
<hr>
<h4>🌟 Η τελευταία μου εγγραφή</h4>

<div class="journal-card">

    <div id="last-entry">

    </div>

</div>

<hr>
<h4>📚 Οι προηγούμενες εγγραφές μου</h4>
<input
type="text"
id="journal-search"
placeholder="🔍 Αναζήτησε στις εγγραφές..."
onkeyup="loadJournalEntries()"
>
<select id="journal-filter" onchange="loadJournalEntries()">

<option value="all">
Όλες οι εγγραφές
</option>

<option value="Στοχαστικό Ημερολόγιο">
📖 Στοχαστικό Ημερολόγιο
</option>

<option value="Εκφραστική Γραφή">
✍️ Εκφραστική Γραφή
</option>

<option value="Ημερολόγιο Ευγνωμοσύνης">
🌿 Ημερολόγιο Ευγνωμοσύνης
</option>

<option value="Γράμμα στον Εαυτό μου">
💌 Γράμμα στον Εαυτό μου
</option>

</select>

<br><br>
<br><br>

<div class="journal-card">

    <div id="journal-history">

    </div>

</div>

    `;
loadJournalEntries();
document.getElementById("journal-type")
.addEventListener("change", updateJournalPrompt);
}
// ===============================
// Αποθήκευση Θεραπευτικής Γραφής
// ===============================

function saveJournal()
{

    const text =
    document.getElementById("journal-text").value;


    if(text.trim() === "")
    {
        alert("Γράψε πρώτα κάτι στο ημερολόγιο.");
        return;
    }


    const type =
    document.getElementById("journal-type").value;



    fetch("../backend/api/save_entry.php", {

        method: "POST",

        headers: {

            "Content-Type": "application/x-www-form-urlencoded"

        },

        body:

        "user_id=1" +
        "&technique=" + encodeURIComponent(type) +
        "&content=" + encodeURIComponent(text)

    })


    .then(response => response.text())


    .then(data => {


        console.log(data);


        alert("Η σκέψη σου αποθηκεύτηκε ✨");


        document.getElementById("journal-text").value = "";


    })


    .catch(error => {


        console.log("Σφάλμα:", error);


        alert("Υπήρξε πρόβλημα στην αποθήκευση.");

    });


}
// ===============================
// Προβολή προηγούμενων εγγραφών
// ===============================

function loadJournalEntries()
{

    let entries =
    JSON.parse(localStorage.getItem("calmflow_journal")) || [];
    showWritingMessage(entries);
showLastEntry(entries);
let search = "";

const searchBox =
document.getElementById("journal-search");

if(searchBox)
{
    search =
    searchBox.value.toLowerCase();
}
let filter = "all";

const filterBox =
document.getElementById("journal-filter");

if(filterBox)
{
    filter =
    filterBox.value;
}

    let history =
    document.getElementById("journal-history");


    if(!history)
    {
        return;
    }


    history.innerHTML = "";

entries.forEach(function(entry, index)
{

    if(
        !entry.text.toLowerCase().includes(search) &&
        !entry.type.toLowerCase().includes(search)
    )
    {
        return;
    }
    if(
    filter !== "all" &&
    entry.type !== filter
)
{
    return;
}

        history.innerHTML += `

<div class="journal-entry">

    <p>
    <strong>📅 ${entry.date}</strong>
    </p>

    <p>
    ${entry.type}
    </p>

    <p>
    ${entry.text}
    </p>


   <button onclick="editEntry(${index})">

    ✏️ Επεξεργασία

</button>


<button onclick="deleteEntry(${index})">

    🗑️ Διαγραφή

</button>

    <hr>

</div>

`;
    });

}

// ===============================
// Διαγραφή εγγραφής
// ===============================

function deleteEntry(index)
{

    let entries =
    JSON.parse(localStorage.getItem("calmflow_journal")) || [];


    entries.splice(index,1);


    localStorage.setItem(

        "calmflow_journal",

        JSON.stringify(entries)

    );


    loadJournalEntries();

}
function editEntry(index)
{

    let entries =
    JSON.parse(localStorage.getItem("calmflow_journal")) || [];


    let entry = entries[index];


    document.getElementById("journal-text").value =
    entry.text;


    document.getElementById("journal-type").value =
    entry.type;


    window.currentEditIndex = index;


}
function updateJournalPrompt()
{
    let type =
    document.getElementById("journal-type").value;


    let prompt =
    document.getElementById("journal-prompt");


    if(type === "Στοχαστικό Ημερολόγιο")
    {
        prompt.innerHTML =
        "Τι σκέψεις ή συναισθήματα εμφανίστηκαν σήμερα;";
    }


    else if(type === "Εκφραστική Γραφή")
    {
        prompt.innerHTML =
        "Γράψε ελεύθερα ό,τι υπάρχει μέσα σου χωρίς να το κρίνεις.";
    }


    else if(type === "Ημερολόγιο Ευγνωμοσύνης")
    {
        prompt.innerHTML =
        "Γράψε 3 πράγματα για τα οποία νιώθεις ευγνωμοσύνη σήμερα.";
    }


    else if(type === "Γράμμα στον Εαυτό μου")
    {
        prompt.innerHTML =
        "Γράψε ένα γράμμα στον εαυτό σου με κατανόηση και φροντίδα.";
    }
}
// ===============================
// Στατιστικά Θεραπευτικής Γραφής
// ===============================

function getWritingStats()
{

    let entries =
    JSON.parse(localStorage.getItem("calmflow_journal")) || [];


    let stats = {

        total: entries.length,

        reflective: 0,

        expressive: 0,

        gratitude: 0,

        letter: 0

    };


    entries.forEach(function(entry)
    {


        if(entry.type === "Στοχαστικό Ημερολόγιο")
        {
            stats.reflective++;
        }


        else if(entry.type === "Εκφραστική Γραφή")
        {
            stats.expressive++;
        }


        else if(entry.type === "Ημερολόγιο Ευγνωμοσύνης")
        {
            stats.gratitude++;
        }


        else if(entry.type === "Γράμμα στον Εαυτό μου")
        {
            stats.letter++;
        }


    });


    return stats;

}
// ===============================
// Τελευταία εγγραφή Θεραπευτικής Γραφής
// ===============================

function showLastEntry(entries)
{

    let box =
    document.getElementById("last-entry");


    if(!box)
    {
        return;
    }


    if(entries.length === 0)
    {
        box.innerHTML =
        "Δεν υπάρχει ακόμη κάποια εγγραφή.";
        return;
    }



    let last =
    entries[entries.length - 1];



    box.innerHTML = `

        <p>
        📅 ${last.date}
        </p>


        <p>
        ${last.type}
        </p>


        <p>
        "${last.text}"
        </p>

    `;

}
// ===============================
// Μήνυμα ενθάρρυνσης γραφής
// ===============================

function showWritingMessage(entries)
{

    let box =
    document.getElementById("writing-message");


    if(!box)
    {
        return;
    }


    let total =
    entries.length;



    if(total === 0)
    {

        box.innerHTML =
        "🌱 Ξεκίνα το πρώτο σου βήμα γραφής.";

    }

    else if(total < 10)
    {

        box.innerHTML =
        "✨ Έχεις ήδη καταγράψει " + total + " σκέψεις. Συνέχισε!";

    }

    else
    {

        box.innerHTML =
        "🌟 Η συνέπειά σου είναι ένα σημαντικό βήμα αυτογνωσίας.";

    }

}