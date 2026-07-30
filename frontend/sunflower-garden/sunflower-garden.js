const modeSelection = document.querySelector(".mode-selection");
const garden = document.querySelector(".garden");

const simpleMode = document.querySelector("#simpleMode");
const journeyMode = document.querySelector("#journeyMode");
const gardenSelection = document.querySelector(".garden-selection");

const openSimpleGarden = document.querySelector("#openSimpleGarden");

const openJourneyGarden = document.querySelector("#openJourneyGarden");

const backToCalmflow = document.querySelector("#backToCalmflow");

const journeyMessage = document.querySelector("#journeyMessage");
const flowerMessage = document.querySelector("#flowerMessage");

const backToJourney = document.querySelector("#backToJourney");

const sun = document.querySelector(".sun");
const sky = document.querySelector(".sky");

const gardenArea = document.querySelector("#gardenArea");

let gardenMode = "simple";
let sunflowerCount = 0;
let flowerPositions = [];
let activeSeed = false;

simpleMode.addEventListener("click", () => {
    gardenMode = "simple";
    openGarden();
});

journeyMode.addEventListener("click", () => {

    gardenMode = "journey";

    modeSelection.style.display = "none";
    garden.style.display = "block";

    loadJourneyGarden();

    if (journeyMessage) {
        journeyMessage.style.opacity = "1";

        setTimeout(() => {
            journeyMessage.style.opacity = "0";
        }, 4000);
    }

});
openSimpleGarden.addEventListener("click", function(){

    gardenMode = "simple";

    gardenSelection.style.display = "none";

    garden.style.display = "block";
 activeSeed = false;
    loadSunflowerProgress();

});


openJourneyGarden.addEventListener("click", function(){

    gardenMode = "journey";

    gardenSelection.style.display = "none";

    garden.style.display = "block";

loadJourneyGarden();
    
});


backToCalmflow.addEventListener("click", function(){

    window.location.href="../index.html";

});

const backToGardens = document.querySelector("#backToGardens");



if(backToGardens){

    backToGardens.addEventListener("click",function(){
        activeSeed = false;

        garden.style.display="none";

        gardenSelection.style.display="block";

    });

}


if(backToCalmflow){

    backToCalmflow.addEventListener("click",function(){

        window.location.href="../index.html";

    });

}
function openGarden() {

    modeSelection.style.display = "none";
    garden.style.display = "block";

    activeSeed = false;

    setTimeout(() => {
        loadSunflowerProgress();
    }, 300);

}
function saveSunflowerProgress(){

    console.log("Saving sunflower progress...");

}


function loadSunflowerProgress() {


    if(gardenMode === "simple"){

        sunflowerCount = 0;

        flowerPositions = [];

        gardenArea.innerHTML = "";


        updateGardenSky();


        plantSunflower();


        console.log("Simple garden - fresh start");


        return;

    }

let userId = localStorage.getItem("user_id");



    fetch(
        "../../backend/api/get_game_progress.php?game_name=" +
        (
            gardenMode === "journey"
                ? "Sunflower Garden Journey"
                : "Sunflower Garden Simple"
        )
    )

    .then(response => response.json())

    .then(data => {

        console.log("LOADED:", data);

        sunflowerCount = Number(data.flowers || 0);

        flowerPositions = data.positions || [];

        gardenArea.innerHTML = "";

        if (flowerPositions.length > 0) {

    flowerPositions.forEach(position => {

        createMatureSunflower(position);

    });

} else {

    console.log("NO FLOWERS - CALLING PLANT");

    plantSunflower();

}
        updateGardenSky();

    })

    .catch(error => {

        console.error(error);

    });

}

function loadJourneyGarden(){

    let userId = localStorage.getItem("user_id");


    // ===============================
    // Guest Journey
    // ===============================

    if(!userId){

        let guestEntries =
            JSON.parse(sessionStorage.getItem("guest_journal")) || [];


        sunflowerCount =
            Math.floor(guestEntries.length / 3);


        console.log(
            "GUEST JOURNEY FLOWERS:",
            sunflowerCount
        );


        gardenArea.innerHTML = "";

        flowerPositions = [];


        updateGardenSky();



        for(let i = 0; i < sunflowerCount; i++){

            const position = getNewFlowerPosition();


            flowerPositions.push(position);


            createMatureSunflower(position);

        }


        return;

    }



    // ===============================
    // Registered User Journey
    // ===============================


    fetch("../../backend/api/get_journey_progress.php")

    .then(response => response.json())

    .then(data => {


        console.log("JOURNEY:", data);


        sunflowerCount =
            Number(data.flowers || 0);


        gardenArea.innerHTML = "";


        flowerPositions = [];


        updateGardenSky();



        if(sunflowerCount === 0){

            return;

        }



        for(let i = 0; i < sunflowerCount; i++){


            const position =
                getNewFlowerPosition();


            flowerPositions.push(position);


            createMatureSunflower(position);


        }


    })

    .catch(error => {

        console.error(error);

    });

}
function createMatureSunflower(position){

    const flower = document.createElement("div");

    flower.className = "flower";

    flower.innerHTML = "🌻";

    flower.style.left = position.left + "%";

    flower.style.bottom = position.bottom + "%";

    flower.style.fontSize = "clamp(40px, 12vw, 75px)";

    let clicked = false;

    flower.addEventListener("click", function(){

        if(clicked){
            return;
        }

        clicked = true;

        plantSunflower();

    });

    gardenArea.appendChild(flower);

}



function getNewFlowerPosition(){

    let position;

    let attempts = 0;

    while(attempts < 100){

        position = {

            left: Math.random() * 75 + 10,

            bottom: Math.random() * 20 + 5

        };

        let tooClose = flowerPositions.some(old=>{

            let distance = Math.sqrt(

                Math.pow(old.left-position.left,2) +

                Math.pow(old.bottom-position.bottom,2)

            );

            return distance < 12;

        });

        if(!tooClose){

            return position;

        }

        attempts++;

    }

    return {

        left: Math.random()*85,

        bottom: Math.random()*25

    };

}

function plantSunflower(){
console.trace("plantSunflower called");
    if(activeSeed){
        return;
    }


    activeSeed = true;


    const flower = document.createElement("div");


    flower.className = "flower";


    flower.innerHTML = "🌱";


    flower.style.fontSize = "30px";


    let newPosition = getNewFlowerPosition();


    let left = newPosition.left;

    let bottom = newPosition.bottom;


    flower.style.left = left + "%";

    flower.style.bottom = bottom + "%";


    gardenArea.appendChild(flower);


    let stage = 0;
    flower.addEventListener("click", function(){


    stage++;


    if(stage === 1){

        flower.innerHTML = "🌱";

        flower.style.fontSize = "35px";

    }


    else if(stage === 2){

        flower.innerHTML = "🌿";

        flower.style.fontSize = "45px";

    }


    else if(stage === 3){

        flower.innerHTML = "🌻";

        flower.style.fontSize = "55px";

    }


    else if(stage === 4){

        flower.innerHTML = "🌻";

        flower.style.fontSize = "70px";

    }


    else if(stage === 5){


        flower.innerHTML = "🌻";

        flower.style.fontSize = "75px";


        sunflowerCount++;


        flowerPositions.push({

            left:left,

            bottom:bottom

        });


        console.log("MATURE FLOWER:", sunflowerCount);


        saveSunflowerProgress();


        updateGardenSky();


        activeSeed = false;
setTimeout(()=>{

    plantSunflower();

},1500);

    }


});
     console.log("NEW SEED CREATED:", {
        left:left,
        bottom:bottom
    });

}
function updateGardenSky(){


    if(sunflowerCount < 3){

        sky.style.background =
        "linear-gradient(to bottom,#93c5fd,#d9f99d)";

    }


    else if(sunflowerCount < 6){

        sky.style.background =
        "linear-gradient(to bottom,#60a5fa,#fde68a)";

    }


    else{

        sky.style.background =
        "linear-gradient(to bottom,#38bdf8,#fef3c7)";

    }



    if(sunflowerCount >= 6){

        sun.style.opacity="1";

        sun.style.filter="grayscale(0%)";

        sun.style.transform="scale(1.2)";

    }


    else if(sunflowerCount >=3){

        sun.style.opacity="0.7";

        sun.style.filter="grayscale(30%)";

    }


    else{

        sun.style.opacity="0.4";

        sun.style.filter="grayscale(70%)";

    }

}
