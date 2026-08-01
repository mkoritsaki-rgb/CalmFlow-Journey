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



    setTimeout(function () {

        lightPoint.style.left = "220px";

        lightPoint.style.transform =
            "translateY(-50%) scale(1.3)";


    }, 100);





    let timer = setInterval(function () {



        seconds--;



        document.getElementById("breathing-count").innerHTML =
            seconds;




        if (seconds === 0) {



            phase++;



            if (phase === phases.length) {

                phase = 0;

            }




            document.getElementById("breathing-text").innerHTML =
                phases[phase];



            seconds = 5;



            document.getElementById("breathing-count").innerHTML =
                seconds;




            if (phases[phase] === "Εισπνοή") {


                lightPoint.style.left = "220px";


                lightPoint.style.transform =
                    "translateY(-50%) scale(1.3)";


            }





            else if (phases[phase] === "Κράτημα") {


                lightPoint.style.transform =
                    "translateY(-50%) scale(1.3)";


            }





            else if (phases[phase] === "Εκπνοή") {


                lightPoint.style.left = "0px";


                lightPoint.style.transform =
                    "translateY(-50%) scale(1)";


            }



        }



    }, 1000);



}

// ===============================
// CalmFlow JSON Data
// ===============================


fetch("backend/api/get_progress.php")

.then(response => response.json())

.then(data => {


    let userId = localStorage.getItem("user_id");


    console.log("CalmFlow Data:", data);



    let writingStats = {

       total: 0,
    reflective: 0,
    expressive: 0,
    gratitude: 0,
    letter: 0,
    calmThought: 0,
    thoughtCheck: 0,
    perspective: 0,
    favorite: ""
    };


    let moodStats = {

        total: 0,
        average: 0,
        message: ""

    };


    let gardenStats = {

        flowers: 0,
        message: ""

    };



    let entriesPromise;


    if (!userId) {


        entriesPromise = Promise.resolve(
            JSON.parse(sessionStorage.getItem("guest_journal")) || []
        );


    } else {


        entriesPromise = fetch("backend/api/get_entries.php")
            .then(response => response.json());


    }




    entriesPromise.then(entries => {


        console.log("Entries:", entries);


        writingStats.total = entries.length;



        entries.forEach(function(entry){


            if(entry.technique === "Στοχαστικό Ημερολόγιο")
                writingStats.reflective++;


            else if(entry.technique === "Εκφραστική Γραφή")
                writingStats.expressive++;


            else if(entry.technique === "Ημερολόγιο Ευγνωμοσύνης")
                writingStats.gratitude++;


            else if(entry.technique === "Γράμμα στον Εαυτό μου")
                writingStats.letter++;


            else if(entry.technique === "Μια πιο ήρεμη ματιά στη σκέψη μου")
                writingStats.calmThought++;


            else if(entry.technique === "Διερεύνηση Σκέψης")
                writingStats.thoughtCheck++;


            else if(entry.technique === "Τεχνική 5-5-5 (Αλλαγή Προοπτικής)")
                writingStats.perspective++;


        });

let techniques = {
    "Στοχαστικό Ημερολόγιο": writingStats.reflective,
    "Εκφραστική Γραφή": writingStats.expressive,
    "Ημερολόγιο Ευγνωμοσύνης": writingStats.gratitude,
    "Γράμμα στον Εαυτό μου": writingStats.letter,
    "Μια πιο ήρεμη ματιά στη σκέψη μου": writingStats.calmThought,
    "Διερεύνηση Σκέψης": writingStats.thoughtCheck,
    "Τεχνική 5-5-5 (Αλλαγή Προοπτικής)": writingStats.perspective
};


let favoriteTechnique =
    Object.keys(techniques).reduce((a,b)=>
        techniques[a] >= techniques[b] ? a : b
    );


if(techniques[favoriteTechnique] > 0){

    writingStats.favorite = favoriteTechnique;

}
else{

    writingStats.favorite = "Δεν υπάρχει ακόμα";

}


        let moodsPromise;



        if(!userId){
moodsPromise = Promise.resolve(
    JSON.parse(sessionStorage.getItem("guest_moods")) || []
).then(moods => {

    let time =
        Number(sessionStorage.getItem("guest_moods_time"));

    let now = Date.now();

    let limit =
        24 * 60 * 60 * 1000;


    if (time && now - time > limit) {

        sessionStorage.removeItem("guest_moods");
        sessionStorage.removeItem("guest_moods_time");

        return [];

    }


    return moods;

});

        } else {


            moodsPromise = fetch("backend/api/get_moods.php")
            .then(response=>response.json());


        }





        moodsPromise.then(moods=>{


            console.log("Moods:", moods);


            moodStats.total = moods.length;



            if(moods.length > 0){


                let sum = 0;


                moods.forEach(function(mood){

                    sum += Number(mood.level);

                });


                moodStats.average =
                    Math.round(sum / moods.length);


            }




            if(moodStats.average >= 8){


                moodStats.message =
                "🌟 Η διάθεσή σου ήταν αρκετά θετική.";


            }
            else if(moodStats.average >=5){


                moodStats.message =
                "🌤️ Υπήρχε μια μέτρια ισορροπία στη διάθεσή σου.";


            }
            else{


                moodStats.message =
                "💙 Υπήρχαν πιο δύσκολες στιγμές. Η καταγραφή βοηθά.";


            }




         fetch("backend/api/get_journey_progress.php")

            .then(response=>response.json())

            .then(garden=>{


                gardenStats.flowers =
                    Number(garden.flowers || 0);



                if(gardenStats.flowers === 0){

                    gardenStats.message =
                    "🌱 Ο κήπος σου περιμένει το πρώτο σου λουλούδι.";

                }

                else if(gardenStats.flowers < 5){

                    gardenStats.message =
                    "🌿 Ο κήπος σου αρχίζει να μεγαλώνει.";

                }

                else{


                    gardenStats.message =
                    "🌻 Η φροντίδα σου δημιουργεί έναν ανθισμένο κήπο.";

                }




                const progressBox =
                    document.getElementById("progress-data");



                if(progressBox){


                    progressBox.innerHTML = `

<h3>🌱 Η πρόοδός σου</h3>


<p>📌 Συνεδρίες: ${writingStats.total}</p>



<p>⭐ Αγαπημένη τεχνική: ${writingStats.favorite}</p>


<hr>


<h4>😊 Mood Tracker</h4>

<p>📊 Καταγραφές: ${moodStats.total}</p>

<p>📈 Μέση διάθεση: ${moodStats.average}/10</p>

<p>${moodStats.message}</p>



<h4>🌻 Sunflower Garden Journey</h4>

<p>🌻 Λουλούδια: ${gardenStats.flowers}</p>

<p>${gardenStats.message}</p>



<h4>✍️ Θεραπευτική Γραφή</h4>

<p>📚 Συνολικές εγγραφές: ${writingStats.total}</p>

<p>📖 Στοχαστικό Ημερολόγιο: ${writingStats.reflective}</p>

<p>✍️ Εκφραστική Γραφή: ${writingStats.expressive}</p>

<p>💛 Ευγνωμοσύνη: ${writingStats.gratitude}</p>

<p>💌 Γράμμα στον Εαυτό μου: ${writingStats.letter}</p>

<p>💭 Ήρεμη ματιά στη σκέψη: ${writingStats.calmThought}</p>

<p>🔎 Διερεύνηση Σκέψης: ${writingStats.thoughtCheck}</p>

<p>🧭 Τεχνική 5-5-5: ${writingStats.perspective}</p>


`;

                }


            });


        });


    });


})

.catch(error=>{


    console.log(
        "Σφάλμα φόρτωσης δεδομένων:",
        error
    );


});

        // ===============================
        // Εμφάνιση / Απόκρυψη Progress
        // ===============================


        function toggleProgress() {


            const progressBox =
                document.getElementById("progress-data");



            const button =
                document.getElementById("progress-button");




            if (progressBox.style.display === "none") {


                progressBox.style.display = "block";


                button.innerHTML =
                    "Κρύψε την πρόοδό σου";


            }

            else {


                progressBox.style.display = "none";


                button.innerHTML =
                    "Δες την πρόοδό σου";


            }


        }
        // ===============================
        // Θεραπευτική Γραφή
        // ===============================

        function openJournal() {

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
            💛 Ημερολόγιο Ευγνωμοσύνης
            </option>


            <option value="Γράμμα στον Εαυτό μου">
            💌 Γράμμα στον Εαυτό μου
            </option>

<option value="Μια πιο ήρεμη ματιά στη σκέψη μου">
💭 Μια πιο ήρεμη ματιά στη σκέψη μου
</option>

<option value="Διερεύνηση Σκέψης">
🔎 Διερεύνηση Σκέψης
</option>

<option value="Τεχνική 5-5-5 (Αλλαγή Προοπτικής)">
🧭 Τεχνική 5-5-5 (Αλλαγή Προοπτικής / Perspective Taking)
</option>
        </select>



        <br><br>



     <div id="journal-input-area">

<textarea 
id="journal-text"
placeholder="Γράψε ό,τι αισθάνεσαι σήμερα..."
></textarea>

</div>

<p id="journal-prompt">

</p>


        <br><br>



     <button id="save-button" onclick="saveJournal()">
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
💛 Ημερολόγιο Ευγνωμοσύνης
</option>

<option value="Γράμμα στον Εαυτό μου">
💌 Γράμμα στον Εαυτό μου
</option>
<option value="Μια πιο ήρεμη ματιά στη σκέψη μου">
💭 Μια πιο ήρεμη ματιά στη σκέψη μου
</option>


<option value="Διερεύνηση Σκέψης">
🔎 Διερεύνηση Σκέψης
</option>


<option value="Τεχνική 5-5-5">
🧭 Τεχνική 5-5-5 (Αλλαγή Προοπτικής)
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
            document.getElementById("journal-type")
                .addEventListener("change", updateJournalFields);
            document.getElementById("journal-area").scrollIntoView({
                behavior: "smooth"
            });



            console.log("openJournal υπάρχει:", typeof openJournal);
        }


        // ===============================
        // Αποθήκευση Θεραπευτικής Γραφής
        // ===============================

        function saveJournal() {

            let text = "";

            let type =
                document.getElementById("journal-type").value;
            console.log("ΤΕΧΝΙΚΗ ΠΟΥ ΑΠΟΘΗΚΕΥΕΤΑΙ:", type);


            // ===============================
            // Μια πιο ήρεμη ματιά στη σκέψη μου
            // ===============================

            if (type === "Μια πιο ήρεμη ματιά στη σκέψη μου") {

                let field1 =
                    document.getElementById("journal-text").value.trim();


                let field2 =
                    document.getElementById("journal-text-2").value.trim();


                let field3 =
                    document.getElementById("journal-text-3").value.trim();


                let field4 =
                    document.getElementById("journal-text-4").value.trim();


                let field5 =
                    document.getElementById("journal-text-5").value.trim();



                if (
                    field1 === "" &&
                    field2 === "" &&
                    field3 === "" &&
                    field4 === "" &&
                    field5 === ""
                ) {
                    alert("Γράψε πρώτα κάτι στο ημερολόγιο.");
                    return;
                }



                text =
                    `
💭 Τι σκέψη με αναστάτωσε:
${field1}


🌧️ Τι φοβάμαι ότι μπορεί να συμβεί:
${field2}


🔎 Ποια στοιχεία έχω ότι αυτό θα συμβεί πραγματικά:
${field3}


🌱 Υπάρχει και μια άλλη πιθανή εξήγηση:
${field4}


✨ Ποια θα ήταν μια πιο ήρεμη και ισορροπημένη σκέψη:
${field5}
`;

            }



            // ===============================
            // Έλεγχος Σκέψης
            // ===============================

            else if (type === "Διερεύνηση Σκέψης") {


                let field1 =
                    document.getElementById("journal-text").value.trim();


                let field2 =
                    document.getElementById("journal-text-2").value.trim();


                let field3 =
                    document.getElementById("journal-text-3").value.trim();


                let field4 =
                    document.getElementById("journal-text-4").value.trim();



                if (
                    field1 === "" &&
                    field2 === "" &&
                    field3 === "" &&
                    field4 === ""
                ) {
                    alert("Γράψε πρώτα κάτι στο ημερολόγιο.");
                    return;
                }



                text =
                    `
💭 Η σκέψη που με απασχολεί:
${field1}


🔎 Τι με κάνει να πιστεύω ότι ισχύει:
${field2}


🌱Υπάρχει κάποιος άλλος τρόπος να το δω;
${field3}

✨ Μια πιο ήρεμη σκέψη:
${field4}
`;

            }


            // ===============================
            // Τεχνική 5-5-5 (Αλλαγή Προοπτικής)
            // ===============================

            else if (type === "Τεχνική 5-5-5 (Αλλαγή Προοπτικής)") {

                let field1 =
                    document.getElementById("journal-text").value.trim();


                let field2 =
                    document.getElementById("journal-text-2").value.trim();


                let field3 =
                    document.getElementById("journal-text-3").value.trim();


                let field4 =
                    document.getElementById("journal-text-4").value.trim();



                if (
                    field1 === "" &&
                    field2 === "" &&
                    field3 === "" &&
                    field4 === ""
                ) {
                    alert("Γράψε πρώτα κάτι στο ημερολόγιο.");
                    return;
                }



                text =
                    `
🧭 Η κατάσταση που με απασχολεί σήμερα:
${field1}


📅 Πώς θα φαίνεται αυτό σε 5 μήνες;
${field2}


🌱 Πώς θα φαίνεται αυτό σε 5 χρόνια;
${field3}


✨ Τι διαφορετικό βλέπω όταν παίρνω απόσταση;
${field4}
`;

            }

            // ===============================
            // Απλή γραφή
            // ===============================

            else {

                text =
                    document.getElementById("journal-text").value.trim();



                if (text === "") {
                    alert("Γράψε πρώτα κάτι στο ημερολόγιο.");
                    return;
                }

            }




            // ===============================
            // Αποθήκευση στη βάση
            // ===============================
            let userId = localStorage.getItem("user_id");
            // ===============================
            // Guest αποθήκευση
            // ===============================

            if (!userId) {

                let guestEntries =
                    JSON.parse(sessionStorage.getItem("guest_journal")) || [];


               guestEntries.push({

    id: Date.now(),

    technique: type,

    content: text,

    created_at: new Date().toLocaleString(),

    timestamp: Date.now()

});


               sessionStorage.setItem(
    "guest_journal",
    JSON.stringify(guestEntries)
);

sessionStorage.setItem(
    "guest_journal_time",
    Date.now()
);
                alert(
                    "Η σκέψη σου αποθηκεύτηκε προσωρινά ✨\n\nΔημιούργησε λογαριασμό για να κρατήσεις μόνιμα την πρόοδό σου."
                );


                document.getElementById("journal-text").value = "";


                loadJournalEntries();


                return;

            }



            // ===============================
            // Κανονικός χρήστης - βάση δεδομένων
            // ===============================
            fetch("backend/api/save_entry.php", {

                method: "POST",
                credentials: "include",
                headers: {

                    "Content-Type": "application/x-www-form-urlencoded"

                },


                body:

                    "user_id=" + encodeURIComponent(userId) +
                    "&technique=" + encodeURIComponent(type) +
                    "&content=" + encodeURIComponent(text)

            })


                .then(response => response.text())


                .then(data => {


                    console.log(data);


                    alert("Η σκέψη σου αποθηκεύτηκε ✨");


                    document.getElementById("journal-text").value = "";


                    if (document.getElementById("journal-text-2")) {
                        document.getElementById("journal-text-2").value = "";
                    }


                    if (document.getElementById("journal-text-3")) {
                        document.getElementById("journal-text-3").value = "";
                    }


                    if (document.getElementById("journal-text-4")) {
                        document.getElementById("journal-text-4").value = "";
                    }


                    if (document.getElementById("journal-text-5")) {
                        document.getElementById("journal-text-5").value = "";
                    }


                    loadJournalEntries();


                })


                .catch(error => {


                    console.log("Σφάλμα:", error);


                    alert("Υπήρξε πρόβλημα στην αποθήκευση.");

                });


        }

        // ===============================
        // Προβολή προηγούμενων εγγραφών
        // ===============================
     function cleanGuestData() {

    let now = Date.now();

    let limit =
        24 * 60 * 60 * 1000; // 24 ώρες


    // Καθαρισμός journal

    let journalTime =
        Number(sessionStorage.getItem("guest_journal_time"));


    if (journalTime && now - journalTime > limit) {

        sessionStorage.removeItem("guest_journal");
        sessionStorage.removeItem("guest_journal_time");

        console.log("Guest journal διαγράφηκε.");

    }



    // Καθαρισμός moods

    let moodTime =
        Number(sessionStorage.getItem("guest_moods_time"));


    if (moodTime && now - moodTime > limit) {

        sessionStorage.removeItem("guest_moods");
        sessionStorage.removeItem("guest_moods_time");

        console.log("Guest moods διαγράφηκαν.");

    }

}

        function loadJournalEntries() {
            let userId = localStorage.getItem("user_id");


            if (!userId) {

                let entries =
                    JSON.parse(sessionStorage.getItem("guest_journal")) || [];


                console.log("Guest entries:", entries);


                showWritingMessage(entries);

                showLastEntry(entries);



                let history =
                    document.getElementById("journal-history");


                if (!history) {
                    return;
                }


                history.innerHTML = "";


                entries.reverse().forEach(function (entry) {

                    history.innerHTML += `

    <div class="journal-entry">


    <p>
    📅 ${entry.created_at}
    </p>


    <p>
    ${entry.technique}
    </p>


    <p>
    ${entry.content}
    </p>


    <button onclick="editGuestEntry(${entry.id})">
    ✏️ Επεξεργασία
    </button>


    <button onclick="deleteGuestEntry(${entry.id})">
    🗑️ Διαγραφή
    </button>


    </div>

    `;


                });


                return;

            }


            fetch("backend/api/get_entries.php")

                .then(response => response.json())

                .then(entries => {


                    showWritingMessage(entries);

                    showLastEntry(entries);



                    let search = "";


                    const searchBox =
                        document.getElementById("journal-search");


                    if (searchBox) {
                        search =
                            searchBox.value.toLowerCase();
                    }



                    let filter = "all";


                    const filterBox =
                        document.getElementById("journal-filter");


                    if (filterBox) {
                        filter =
                            filterBox.value;
                    }



                    let history =
                        document.getElementById("journal-history");



                    if (!history) {
                        return;
                    }



                    history.innerHTML = "";



           entries.forEach(function (entry, index) {



                        if (
                            !entry.content.toLowerCase().includes(search) &&
                            !entry.technique.toLowerCase().includes(search)
                        ) {
                            return;
                        }



                        if (
                            filter !== "all" &&
                            entry.technique !== filter
                        ) {
                            return;
                        }



                        history.innerHTML += `


            <div class="journal-entry">


                <p>
                <strong>
                📅 ${entry.created_at}
                </strong>
                </p>



                <p>
                ${entry.technique}
                </p>



                <p>
                ${entry.content}
                </p>



                <button onclick="editEntry(${entry.id})">

                ✏️ Επεξεργασία

                </button>



                <button onclick="deleteEntry(${entry.id})">

                🗑️ Διαγραφή

                </button>


                <hr>


            </div>


            `;


                    });



                })


                .catch(error => {


                    console.log(
                        "Σφάλμα φόρτωσης εγγραφών:",
                        error
                    );


                });


        }

        // ===============================
        // Διαγραφή εγγραφής
        // ===============================

        function deleteEntry(id) {

            if (!confirm("Θέλεις να διαγράψεις αυτή την εγγραφή;")) {
                return;
            }


            console.log("Διαγραφή ID:", id);



            fetch("backend/api/delete_entry.php",
                {

                    method: "POST",

                    headers:
                    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },

                    body:
                        "id=" + id

                })


               .then(response => response.json())


.then(data => {

    console.log("Απάντηση διαγραφής:", data);


    if(data.success)
    {
        alert("✨ Η σκέψη σου διαγράφηκε με επιτυχία.");
    }
    else
    {
        alert("Πρόβλημα: " + data.message);
    }


    loadJournalEntries();


                })


                .catch(error => {

                    console.log("Σφάλμα διαγραφής:", error);

                });


        }
        function editEntry(id) {

            fetch("backend/api/get_entries.php")

                .then(response => response.json())

                .then(entries => {


                    let entry = entries.find(function (item) {

                        return item.id == id;

                    });



                    if (!entry) {
                        alert("Δεν βρέθηκε η εγγραφή.");
                        return;
                    }



                    document.getElementById("journal-type").value =
                        entry.technique;


                    document.getElementById("journal-text").value =
                        entry.content;
                    document.getElementById("journal-text").removeAttribute("readonly");
                    document.getElementById("journal-text").removeAttribute("disabled");
                    console.log("Κείμενο που φορτώθηκε:", entry.content);
                    alert(document.getElementById("journal-text").value);
                    console.log("Περιεχόμενο εγγραφής:", entry.content);


                    window.currentEditId = id;

                    document.getElementById("save-button").innerHTML =
                        "Αποθήκευση αλλαγών ✏️";


                    document.getElementById("save-button").onclick =
                        function () {
                            updateEntry();
                        };



                    alert("Μπορείς τώρα να επεξεργαστείς την εγγραφή.");
                    console.log("EDIT MODE ενεργό. ID:", window.currentEditId);
                });

        }
        function updateEntry() {

            console.log("UPDATE ENTRY ΚΑΛΕΣΤΗΚΕ");


            let content =
                document.getElementById("journal-text").value;


            let technique =
                document.getElementById("journal-type").value;



            console.log("ID:", window.currentEditId);
            console.log("Νέο κείμενο:", content);
            console.log("Τεχνική:", technique);



            fetch("backend/api/update_entry.php",
                {

                    method: "POST",

                    headers:
                    {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },


                    body:

                        "id=" + window.currentEditId +
                        "&content=" + encodeURIComponent(content) +
                        "&technique=" + encodeURIComponent(technique)


                })


                .then(response => response.json())


                .then(data => {


    console.log("Απάντηση server:", data);


    if(data.success)
    {
        alert("✨ Η σκέψη σου ενημερώθηκε με επιτυχία.");
    }
    else
    {
        alert("Πρόβλημα: " + data.message);
    }



                    window.currentEditId = null;



                    let button =
                        document.getElementById("save-button");



                    button.innerHTML =
                        "Αποθήκευση ✨";



                    button.onclick =
                        function () {
                            saveJournal();
                        };



                    loadJournalEntries();


                })


                .catch(error => {


                    console.log("Σφάλμα ενημέρωσης:", error);


                    alert("Υπήρξε πρόβλημα στην ενημέρωση.");

                });


        }

        function updateJournalPrompt()// Είναι υπεύθυνη για το κείμενο που εμφανίζεται όταν αλλάζει η επιλογή
        {
            let type =
                document.getElementById("journal-type").value;


            let prompt =
                document.getElementById("journal-prompt");


            if (type === "Στοχαστικό Ημερολόγιο") {
                prompt.innerHTML =
                    "Γράψε τι σκέψεις, συναισθήματα ή στιγμές θέλεις να παρατηρήσεις από τη σημερινή ημέρα.";
            }


            else if (type === "Εκφραστική Γραφή") {
                prompt.innerHTML =
                    "Γράψε ελεύθερα ό,τι υπάρχει μέσα σου χωρίς να το κρίνεις.";
            }


            else if (type === "Ημερολόγιο Ευγνωμοσύνης") {
                prompt.innerHTML =
                    "Γράψε 3 πράγματα για τα οποία νιώθεις ευγνωμοσύνη σήμερα.";
            }


            else if (type === "Γράμμα στον Εαυτό μου") {
                prompt.innerHTML =
                    "Γράψε ένα γράμμα στον εαυτό σου με κατανόηση και φροντίδα.";
            }
            else if (type === "Μια πιο ήρεμη ματιά στη σκέψη μου") {
                prompt.innerHTML =
                    `
    <p>
    Μερικές φορές το άγχος δημιουργεί έντονες σκέψεις και σενάρια.
    Ας τις παρατηρήσουμε με ηρεμία και ας αναζητήσουμε μια πιο ισορροπημένη οπτική.
    </p>
    `;
            }
            else if (type === "Διερεύνηση Σκέψης") {
                prompt.innerHTML =
                    `
    <p>
    Μια σκέψη που προκαλεί άγχος δεν είναι πάντα γεγονός.
    Με αυτή την άσκηση εξετάζουμε τα στοιχεία,
    βλέπουμε και άλλες πιθανές οπτικές
    και δημιουργούμε μια πιο ισορροπημένη σκέψη.
    </p>
    `;
            }
            else if (type === "Τεχνική 5-5-5 (Αλλαγή Προοπτικής)") {
                prompt.innerHTML =
                    `
    <p>
    🧭 Η τεχνική 5-5-5 βοηθά να πάρουμε απόσταση
    από μια έντονη σκέψη και να τη δούμε με μεγαλύτερη προοπτική.
    </p>

    <p>
    Όταν μια ανησυχία φαίνεται πολύ μεγάλη στο παρόν,
    αναρωτήσου:
    </p>

    <p>
    «Θα έχει αυτή η σκέψη την ίδια σημασία σε 5 μήνες;
    Σε 5 χρόνια;»
    </p>

    <p>
    Στόχος είναι να δημιουργήσεις χώρο ανάμεσα
    στη σκέψη και στο συναίσθημα,
    ώστε να δεις την κατάσταση πιο ήρεμα.
    </p>
    `;
            }
        }

        // ===============================
        // Τελευταία εγγραφή Θεραπευτικής Γραφής
        // ===============================

        function showLastEntry(entries) {

            let box =
                document.getElementById("last-entry");


            if (!box) {
                return;
            }


            if (entries.length === 0) {
                box.innerHTML =
                    "Δεν υπάρχει ακόμη κάποια εγγραφή.";
                return;
            }


            let last =
                entries[entries.length - 1];


            box.innerHTML = `

        <p>
        📅 ${last.created_at}
        </p>


        <p>
        ${last.technique}
        </p>


        <p>
        "${last.content}"
        </p>

    `;

        }
        // ===============================
        // Μήνυμα ενθάρρυνσης γραφής
        // ===============================

        function showWritingMessage(entries) {

            let box =
                document.getElementById("writing-message");


            if (!box) {
                return;
            }


            let total =
                entries.length;



            if (total === 0) {

                box.innerHTML =
                    "🌱 Ξεκίνα το πρώτο σου βήμα γραφής.";

            }

            else if (total < 10) {

                box.innerHTML =
                    "✨ Έχεις ήδη καταγράψει " + total + " σκέψεις. Συνέχισε!";

            }

            else {

                box.innerHTML =
                    "🌟 Η συνέπειά σου είναι ένα σημαντικό βήμα αυτογνωσίας.";

            }

        }

        function updateJournalFields() {
            console.log("updateJournalFields λειτουργεί");


            let type =
                document.getElementById("journal-type").value;
            console.log("Επιλεγμένη τεχνική:", type);

            let area =
                document.getElementById("journal-input-area");



            if (type === "Μια πιο ήρεμη ματιά στη σκέψη μου") {

                area.innerHTML = `


<textarea 
id="journal-text"
placeholder="💭 Τι σκέψη με αναστάτωσε;"
></textarea>


<br><br>


<textarea 
id="journal-text-2"
placeholder="🌧️ Τι φοβάμαι ότι μπορεί να συμβεί;"
></textarea>


<br><br>


<textarea 
id="journal-text-3"
placeholder="🔎 Ποια στοιχεία έχω ότι αυτό θα συμβεί πραγματικά;"
></textarea>


<br><br>


<textarea 
id="journal-text-4"
placeholder="🌱 Υπάρχει και μια άλλη πιθανή εξήγηση;"
></textarea>


<br><br>


<textarea 
id="journal-text-5"
placeholder="✨ Ποια θα ήταν μια πιο ήρεμη και ισορροπημένη σκέψη;"
></textarea>


`;

            }



            else if (type === "Διερεύνηση Σκέψης") {

                area.innerHTML = `


<textarea 
id="journal-text"
placeholder="🔎 Ποια είναι η σκέψη ή ο φόβος που θέλω να εξετάσω;"
></textarea>


<br><br>


<textarea 
id="journal-text-2"
placeholder="📌 Ποια στοιχεία υποστηρίζουν αυτή τη σκέψη;"
></textarea>


<br><br>


<textarea 
id="journal-text-3"
placeholder="⚖️ Ποια στοιχεία δείχνουν ότι μπορεί να υπάρχει και άλλη οπτική;"
></textarea>


<br><br>


<textarea 
id="journal-text-4"
placeholder="🌱 Ποια θα ήταν μια πιο ρεαλιστική και ισορροπημένη σκέψη;"
></textarea>


`;

            }

            else if (type === "Τεχνική 5-5-5 (Αλλαγή Προοπτικής)") {

                area.innerHTML = `


<textarea 
id="journal-text"
placeholder="🧭 Ποια σκέψη ή ανησυχία θέλω να δω από διαφορετική οπτική;"
></textarea>


<br><br>


<textarea 
id="journal-text-2"
placeholder="📅 Πώς πιστεύω ότι θα μου φαίνεται αυτή η κατάσταση σε 5 μήνες;"
></textarea>


<br><br>


<textarea 
id="journal-text-3"
placeholder="🌅 Πώς μπορεί να τη βλέπω σε 5 χρόνια;"
></textarea>


<br><br>


<textarea 
id="journal-text-4"
placeholder="✨ Ποια πιο ήρεμη και ισορροπημένη οπτική μπορώ να κρατήσω σήμερα;"
></textarea>


`;

            }

            else if (type === "Στοχαστικό Ημερολόγιο") {

                area.innerHTML = `

<textarea 
id="journal-text"
placeholder="📖 Παρατήρησε τη σημερινή σου εμπειρία..."
></textarea>

`;

            }


            else if (type === "Εκφραστική Γραφή") {

                area.innerHTML = `

<textarea 
id="journal-text"
placeholder="✍️ Άφησε τις σκέψεις σου να κυλήσουν ελεύθερα..."
></textarea>

`;

            }


            else if (type === "Ημερολόγιο Ευγνωμοσύνης") {

                area.innerHTML = `

<textarea 
id="journal-text"
placeholder="💛 1.&#10;2.&#10;3."
></textarea>

`;

            }


            else if (type === "Γράμμα στον Εαυτό μου") {

                area.innerHTML = `

<textarea 
id="journal-text"
placeholder="💌 Αγαπημένε μου εαυτέ..."
></textarea>

`;

            }


            else {

                area.innerHTML = `

<textarea 
id="journal-text"
placeholder="Γράψε ό,τι αισθάνεσαι σήμερα..."
></textarea>

`;

            }

        }


        function logoutUser() {

            fetch("backend/api/logout.php")

                .then(response => response.text())

                .then(data => {


                    console.log(data);


                    localStorage.removeItem("user_id");
                    localStorage.removeItem("loggedUser");

                    window.location.href = "../index.html";

                })

                .catch(error => {

                    console.log("Σφάλμα logout:", error);

                });

        }

        function deleteGuestEntry(id) {

            if (!confirm("Θέλεις να διαγράψεις αυτή την εγγραφή;")) {
                return;
            }


            let entries =
                JSON.parse(sessionStorage.getItem("guest_journal")) || [];


            entries = entries.filter(function (entry) {
                return entry.id !== id;
            });


            sessionStorage.setItem(
                "guest_journal",
                JSON.stringify(entries)
            );


            loadJournalEntries();

        }
        function editGuestEntry(id) {

            let entries =
                JSON.parse(sessionStorage.getItem("guest_journal")) || [];


            let entry = entries.find(function (item) {
                return item.id === id;
            });


            if (!entry) {
                alert("Δεν βρέθηκε η εγγραφή.");
                return;
            }


            document.getElementById("journal-type").value =
                entry.technique;


            document.getElementById("journal-text").value =
                entry.content;


            window.currentGuestEditId = id;


            let button =
                document.getElementById("save-button");


            button.innerHTML =
                "Αποθήκευση αλλαγών ✏️";


            button.onclick =
                function () {
                    updateGuestEntry();
                };


        }

        function updateGuestEntry() {

            let content =
                document.getElementById("journal-text").value.trim();


            let technique =
                document.getElementById("journal-type").value;



            let entries =
                JSON.parse(sessionStorage.getItem("guest_journal")) || [];



            entries = entries.map(function (entry) {

                if (entry.id === window.currentGuestEditId) {

                    entry.content = content;
                    entry.technique = technique;

                }


                return entry;

            });



            sessionStorage.setItem(
                "guest_journal",
                JSON.stringify(entries)
            );



            alert("Η εγγραφή ενημερώθηκε ✨");



            window.currentGuestEditId = null;



            let button =
                document.getElementById("save-button");


            button.innerHTML =
                "Αποθήκευση ✨";


            button.onclick =
                function () {
                    saveJournal();
                };



            document.getElementById("journal-text").value = "";



            loadJournalEntries();

        }

        // ===============================
        // Mood Tracker
        // ===============================

        function openMoodTracker() {

            document.getElementById("mood-area").innerHTML = `


    <h4>😊 Πώς νιώθεις σήμερα;</h4>


    <select id="mood-choice">

        <option value="Πολύ καλά">
        😄 Πολύ καλά
        </option>


        <option value="Καλά">
        🙂 Καλά
        </option>


        <option value="Ουδέτερα">
        😐 Ουδέτερα
        </option>


        <option value="Δύσκολα">
        😟 Δύσκολα
        </option>


        <option value="Πολύ δύσκολα">
        😞 Πολύ δύσκολα
        </option>

    </select>


    <br><br>


    <label>
    Ένταση συναισθήματος:
    </label>


    <input 
    type="range"
    id="mood-level"
    min="1"
    max="10"
    value="5"
    >


    <p>
    <span id="mood-number">5</span>/10
    </p>



    <textarea
    id="mood-note"
    placeholder="Τι επηρέασε τη διάθεσή σου σήμερα;"
    ></textarea>


    <br><br>


    <button onclick="saveMood()">
    💾 Αποθήκευση
    </button>
<hr>

<h4>📊 Οι προηγούμενες καταγραφές μου</h4>

<div id="mood-history">

</div>

    `;



            document
                .getElementById("mood-level")
                .addEventListener("input", function () {

                    document.getElementById("mood-number").innerHTML =
                        this.value;

                });

            loadMoodHistory();
        }
        // ===============================
        // Αποθήκευση Mood Tracker
        // ===============================

        function saveMood() {

            let mood =
                document.getElementById("mood-choice").value;


            let level =
                document.getElementById("mood-level").value;


            let note =
                document.getElementById("mood-note").value.trim();



            let moodEntry = {

    id: Date.now(),

    mood: mood,

    level: level,

    note: note,

    created_at: new Date().toLocaleString(),

    timestamp: Date.now()

};

            let userId = localStorage.getItem("user_id");


            if (userId) {

                fetch("backend/api/save_mood.php",
                    {

                        method: "POST",

                        headers:
                        {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },

                        body:

                            "user_id=" + userId +
                            "&mood=" + encodeURIComponent(mood) +
                            "&level=" + level +
                            "&note=" + encodeURIComponent(note)

                    })


                    .then(response => response.text())

                    .then(data => {

                        console.log("Mood database:", data);

                    });


            }

            if (!userId) {

                

                    let moods = [];

let time =
    Number(sessionStorage.getItem("guest_moods_time"));

let now = Date.now();

let limit =
    24 * 60 * 60 * 1000;


if (time && now - time <= limit) {

    let moods =
        JSON.parse(sessionStorage.getItem("guest_moods")) || [];

}


                moods.unshift(moodEntry);


                    sessionStorage.setItem(
                        "guest_moods",
                        JSON.stringify(moods)
                    );
if (!sessionStorage.getItem("guest_moods_time")) {

    sessionStorage.setItem(
        "guest_moods_time",
        Date.now()
    );

}
                

            }


            alert("Η διάθεσή σου καταγράφηκε 😊");


        }
        // ===============================
        // Ιστορικό Mood Tracker
        // ===============================

        function loadMoodHistory() {

            let userId = localStorage.getItem("user_id");


            // ===============================
            // Guest χρήστης
            // ===============================

            if (!userId) {

    let moods =
        JSON.parse(sessionStorage.getItem("guest_moods")) || [];


    let time =
        Number(sessionStorage.getItem("guest_moods_time"));

    let now = Date.now();

    let limit =
        24 * 60 * 60 * 1000;


    if(time && now - time > limit){

        sessionStorage.removeItem("guest_moods");
        sessionStorage.removeItem("guest_moods_time");

        moods = [];

    }
moods.sort(function(a, b){
    return b.id - a.id;
});

    displayMoodHistory(moods);


    return;

}



            // ===============================
            // Κανονικός χρήστης - βάση
            // ===============================

            fetch("backend/api/get_moods.php")

                .then(response => response.json())

                .then(moods => {


                    console.log("Mood database:", moods);


                    displayMoodHistory(moods);


                })


                .catch(error => {


                    console.log(
                        "Σφάλμα φόρτωσης moods:",
                        error
                    );


                });



        }



        // ===============================
        // Εμφάνιση Mood History
        // ===============================

        function displayMoodHistory(moods) {


            let history =
                document.getElementById("mood-history");



            if (!history) {
                return;
            }



            history.innerHTML = "";



            if (moods.length === 0) {

                history.innerHTML =
                    "Δεν υπάρχει ακόμη κάποια καταγραφή διάθεσης.";


                return;

            }



            moods.forEach(function (entry) {


                history.innerHTML += `


        <div class="journal-entry">


            <p>
            📅 ${entry.created_at}
            </p>


            <p>
            ${entry.mood}
            </p>


            <p>
            Ένταση: ${entry.level}/10
            </p>


            <p>
            ${entry.note || ""}
            </p>



            <button onclick="editMood(${entry.id})">
            ✏️ Επεξεργασία
            </button>


            <button onclick="deleteMood(${entry.id})">
            🗑️ Διαγραφή
            </button>


        </div>


        <hr>


        `;


            });


        }

        // ===============================
        // Διαγραφή Mood
        // ===============================

        function deleteMood(id) {

            if (!confirm("Θέλεις να διαγράψεις αυτή την καταγραφή;")) {
                return;
            }


            let moods =
                JSON.parse(sessionStorage.getItem("guest_moods")) || [];


            moods = moods.filter(function (entry) {
                return entry.id !== id;
            });



            sessionStorage.setItem(
                "guest_moods",
                JSON.stringify(moods)
            );


            loadMoodHistory();


        }

        // ===============================
        // Επεξεργασία Mood
        // ===============================

        function editMood(id) {

            let moods =
                JSON.parse(sessionStorage.getItem("guest_moods")) || [];


            let mood =
                moods.find(function (entry) {
                    return entry.id === id;
                });



            if (!mood) {
                alert("Δεν βρέθηκε η καταγραφή.");
                return;
            }



            document.getElementById("mood-choice").value =
                mood.mood;


            document.getElementById("mood-level").value =
                mood.level;


            document.getElementById("mood-number").innerHTML =
                mood.level;


            document.getElementById("mood-note").value =
                mood.note;



            window.currentMoodEditId = id;



            let button =
                document.querySelector("#mood-area button");


            button.innerHTML =
                "💾 Αποθήκευση αλλαγών";


            button.onclick =
                function () {
                    updateMood();
                };


        }

        // ===============================
        // Ενημέρωση Mood
        // ===============================

        function updateMood() {

            let mood =
                document.getElementById("mood-choice").value;


            let level =
                document.getElementById("mood-level").value;


            let note =
                document.getElementById("mood-note").value.trim();



            let moods =
                JSON.parse(sessionStorage.getItem("guest_moods")) || [];



            moods = moods.map(function (entry) {

                if (entry.id === window.currentMoodEditId) {

                    entry.mood = mood;

                    entry.level = level;

                    entry.note = note;

                }


                return entry;

            });



            sessionStorage.setItem(
                "guest_moods",
                JSON.stringify(moods)
            );



            alert("Η καταγραφή ενημερώθηκε 😊");



            window.currentMoodEditId = null;



            let button =
                document.querySelector("#mood-area button");


            button.innerHTML =
                "💾 Αποθήκευση";


            button.onclick =
                function () {
                    saveMood();
                };



            loadMoodHistory();

        }

        function exportPDF() {

            let userId = localStorage.getItem("user_id");


            if (userId) {

                // Συνδεδεμένος χρήστης
                window.open(
                    "backend/api/export_pdf.php",
                    "_blank"
                );

            }
            else {

                // Guest χρήστης

showGuestPopup();

                let journal =
                    JSON.parse(sessionStorage.getItem("guest_journal")) || [];


                let moods =
    JSON.parse(sessionStorage.getItem("guest_moods")) || [];

let time =
    Number(sessionStorage.getItem("guest_moods_time"));

let limit =
    24 * 60 * 60 * 1000;

if (time && Date.now() - time > limit) {

    moods = [];

    sessionStorage.removeItem("guest_moods");
    sessionStorage.removeItem("guest_moods_time");

}

console.log("PDF JOURNAL:", journal);

                fetch("backend/api/export_guest_pdf.php",
                    {

                        method: "POST",

                        headers:
                        {
                            "Content-Type": "application/json"
                        },


                        body: JSON.stringify(
                            {
                                journal: journal,
                                moods: moods
                            })

                    })


                    .then(response => response.blob())


                    .then(blob => {


                        let url =
                            URL.createObjectURL(blob);


                        window.open(
                            url,
                            "_blank"
                        );


                    })


                    .catch(error => {

                        console.log(
                            "Σφάλμα δημιουργίας guest PDF:",
                            error
                        );

                    });


            }


        }

        function openFloatingThoughts() {

            window.location.href = "floatingThoughts_V2/index.html";

        }


        function openSunflowerGarden() {

            window.location.href = "sunflower-garden/sunflower-garden.html";

        }
function showGuestPopup(){

    let popup = document.createElement("div");

    popup.innerHTML = `

    <div style="
        background:white;
        padding:25px;
        border-radius:25px;
        text-align:center;
        max-width:350px;
        box-shadow:0 10px 30px rgba(0,0,0,0.2);
    ">

        <h2 style="color:#4d7c0f;">
        🌱 CalmFlow
        </h2>

        <p>
        Οι καταγραφές σου ως επισκέπτης αποθηκεύονται προσωρινά.
        </p>

        <p>
        Δημιούργησε δωρεάν λογαριασμό για να κρατήσεις
        το προσωπικό σου ταξίδι και τον κήπο σου.
        </p>


        <button onclick="location.href='register.html'"
        style="
        padding:10px 20px;
        border:none;
        border-radius:20px;
        background:#84cc16;
        color:white;
        cursor:pointer;
        margin:5px;
        ">
        Δημιουργία Λογαριασμού
        </button>


        <button onclick="this.parentElement.parentElement.remove()"
        style="
        padding:10px 20px;
        border:none;
        border-radius:20px;
        background:#ddd;
        cursor:pointer;
        margin:5px;
        ">
        Συνέχεια
        </button>

    </div>

    `;


    popup.style.position="fixed";
    popup.style.top="0";
    popup.style.left="0";
    popup.style.width="100%";
    popup.style.height="100%";
    popup.style.display="flex";
    popup.style.alignItems="center";
    popup.style.justifyContent="center";
    popup.style.background="rgba(0,0,0,0.35)";
    popup.style.zIndex="9999";


    document.body.appendChild(popup);

}