const startButton = document.querySelector("#startButton");
const welcomeScreen = document.querySelector("#welcomeScreen");
const gameScreen = document.querySelector("#gameScreen");

const thoughtButton = document.querySelector("#thoughtButton");
const thoughtInput = document.querySelector("#thoughtInput");

const thoughtSection = document.querySelector("#thoughtSection");

const balloons = document.querySelector("#balloons");

const breathingSection =
document.querySelector("#breathingSection");

const breathingText =
document.querySelector("#breathingText");

const choiceSection =
document.querySelector("#choiceSection");

const calmerButton =
document.querySelector("#calmerButton");

const timeButton =
document.querySelector("#timeButton");


const releaseSection =
document.querySelector("#releaseSection");

const releaseButton =
document.querySelector("#releaseButton");


const visualizationSection =
document.querySelector("#visualizationSection");


const backButton =
document.querySelector("#backButton");


const soundButton =
document.querySelector("#soundButton");

const rainSound =
document.querySelector("#rainSound");

const sunButton =
document.querySelector("#sunButton");

const sun =
document.querySelector("#sun");


const finalMessage =
document.querySelector("#finalMessage");


const restartButton =
document.querySelector("#restartButton");


const sky =
document.querySelector(".sky");

const clouds =
document.querySelector("#clouds");

const rain =
document.querySelector("#rain");


let currentBalloon = null;
let rainInterval = null;



// LOCAL STORAGE HELPERS

function saveGameData(key,value){

    localStorage.setItem(key,value);

}


function clearGameData(){

    localStorage.removeItem("floatingThought");
    localStorage.removeItem("floatingChoice");
    localStorage.removeItem("floatingCompleted");

}

// SAVE GAME TO DATABASE

function saveGameProgress(progressData){


    const formData = new FormData();


    formData.append(
        "game_name",
        "Floating Thoughts"
    );


    formData.append(
        "progress",
        JSON.stringify(progressData)
    );



    fetch("../../backend/api/save_game_progress.php",{

        method:"POST",
credentials:"include",
        body:formData

    })


    .then(response=>response.json())


    .then(data=>{

        console.log(
            "Database:",
            data
        );

    })


    .catch(error=>{

        console.error(
            "Save error:",
            error
        );

    });


}

// START

startButton.addEventListener("click",()=>{

    welcomeScreen.style.display="none";

    gameScreen.style.display="block";

});




// ΠΡΩΤΗ ΣΚΕΨΗ

thoughtButton.addEventListener("click",()=>{


    if(thoughtInput.value.trim()===""){
        return;
    }


    saveGameData(
        "floatingThought",
        thoughtInput.value.trim()
    );


    createRedBalloon();


    thoughtSection.style.display="none";

    breathingSection.style.display="block";


    startBreathing();


});





// ΔΗΜΙΟΥΡΓΙΑ ΜΠΑΛΟΝΙΟΥ


function createRedBalloon(){


    if(currentBalloon){

        currentBalloon.remove();

    }


    const balloon=document.createElement("div");


    balloon.className="balloon";


    balloon.innerHTML = `

    <div class="shine"></div>

    <div class="knot"></div>

    <svg class="stringSVG" width="40" height="70">
        <path 
        d="M20 0 C20 20, 35 35, 20 70"
        stroke="#94a3b8"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"/>
    </svg>

    `;


    balloons.appendChild(balloon);


    currentBalloon=balloon;


    createClouds();


}





// ΔΗΜΙΟΥΡΓΙΑ ΣΤΑΓΟΝΑΣ


function createRainDrop(){


    const drop=document.createElement("div");


    drop.className="drop";


    drop.style.left =
    Math.random()*100 + "%";


    drop.style.animationDuration =
    (Math.random()*1.5+3)+"s";


    rain.appendChild(drop);



    setTimeout(()=>{

        drop.remove();

    },1300);


}

// ΑΝΑΠΝΟΗ

function startBreathing(){


breathingText.innerHTML =
"🌬️ Πάρε μια αργή βαθιά εισπνοή...";


setTimeout(()=>{

breathingText.innerHTML =
"☁️ Κράτησε για λίγο αυτή την ηρεμία...";

},2500);



setTimeout(()=>{

breathingText.innerHTML =
"🌊 Άφησε την ένταση να μαλακώσει...";

},5000);



setTimeout(()=>{

breathingText.innerHTML =
"💭 Πώς νιώθεις τώρα;";

},7500);



setTimeout(()=>{

breathingSection.style.display="none";

choiceSection.style.display="block";


},8500);


}





// ΠΡΑΣΙΝΗ ΕΠΙΛΟΓΗ

calmerButton.addEventListener("click",()=>{


stopRain();


choiceSection.style.display="none";


releaseSection.style.display="block";


saveGameData(
    "floatingChoice",
    "green"
);


});






// ΜΠΛΕ ΕΠΙΛΟΓΗ

timeButton.addEventListener("click",()=>{


choiceSection.style.display="none";


visualizationSection.style.display="block";


saveGameData(
    "floatingChoice",
    "blue"
);



if(currentBalloon){

    currentBalloon.classList.add("yellow");

}



startRain();


});







// ΑΦΗΣΕ ΤΗ ΣΚΕΨΗ ΝΑ ΤΑΞΙΔΕΨΕΙ

releaseButton.addEventListener("click",()=>{


if(currentBalloon){

    currentBalloon.classList.add("fly-away");

}



setTimeout(()=>{


sky.style.background =
"linear-gradient(to bottom,#87ceeb,#dbeafe)";


document.body.classList.add("clear-mode");


},1500);




setTimeout(()=>{


if(currentBalloon){

    currentBalloon.remove();

}



releaseSection.style.display="none";


saveGameData(
    "floatingCompleted",
    "true"
);

saveGameProgress({

    completed:true,

    choice:"green",

    balloon:"released"

});

finalMessage.style.display="block";



},3500);



});







// ΗΧΟΣ ΒΡΟΧΗΣ


soundButton.addEventListener("click",()=>{


if(rainSound.paused){


    rainSound.play();


    soundButton.innerHTML =
    "🔇 Σταμάτησε τη βροχή";


}

else{


    rainSound.pause();


    soundButton.innerHTML =
    "🔊 Άκουσε τη βροχή";


}



});







// ΠΙΣΩ

backButton.addEventListener("click",()=>{


stopRain();



if(rainSound){

    rainSound.pause();

    rainSound.currentTime=0;

    soundButton.innerHTML =
    "🔊 Άκουσε τη βροχή";

}



if(currentBalloon){

    currentBalloon.classList.remove("yellow");

}



visualizationSection.style.display="none";


choiceSection.style.display="block";



});







// ΚΑΘΑΡΙΣΜΟΣ ΟΥΡΑΝΟΥ


sunButton.addEventListener("click",()=>{


stopRain();



if(rainSound){

    rainSound.pause();

    rainSound.currentTime=0;


    soundButton.innerHTML =
    "🔊 Άκουσε τη βροχή";

}



sky.style.background =
"linear-gradient(to bottom,#87ceeb,#dbeafe)";


document.body.classList.add("clear-mode");


if(sun){

    sun.classList.add("sun-show");

}



visualizationSection.style.display="none";


saveGameData(
    "floatingCompleted",
    "true"
);
saveGameProgress({

    completed:true,

    choice:"blue",

    sky:"clear",

    sun:true

});


finalMessage.style.display="block";



});







// ΝΕΑ ΣΚΕΨΗ


restartButton.addEventListener("click",()=>{


stopRain();



clearGameData();



if(sun){

    sun.classList.remove("sun-show");

}



document.body.classList.remove("clear-mode");



finalMessage.style.display="none";



thoughtSection.style.display="block";



thoughtInput.value="";



sky.style.background =
"linear-gradient(to bottom,#1e293b,#64748b)";



});







// ΣΥΝΝΕΦΑ


function createClouds(){


clouds.innerHTML="";



for(let i=0;i<5;i++){


const cloud=document.createElement("div");


cloud.className="cloud";


cloud.style.left =
Math.random()*100+"%";


cloud.style.top =
Math.random()*60+"%";


cloud.style.animationDelay =
Math.random()*10+"s";



clouds.appendChild(cloud);


}



}






// ΒΡΟΧΗ


function startRain(){



if(rainInterval){

    return;

}



rainInterval=setInterval(()=>{


    createRainDrop();


},90);



}






function stopRain(){


clearInterval(rainInterval);


rainInterval=null;



const drops=document.querySelectorAll(".drop");



drops.forEach(drop=>{


drop.classList.add("fade-out");



setTimeout(()=>{


    drop.remove();


},1500);



});



}

// ΕΠΙΣΤΡΟΦΗ ΣΤΟ CALMFLOW

const backToCalmflow = document.querySelector("#backToCalmflow");


if(backToCalmflow){

    backToCalmflow.addEventListener("click", function(){

        window.location.href="../index.html";

    });

}

// ΕΞΟΔΟΣ ΑΠΟ ΤΟ FLOATING THOUGHTS

const exitCalmflow = document.querySelector("#exitCalmflow");


if(exitCalmflow){

    exitCalmflow.addEventListener("click", function(){

        window.location.href="../index.html";

    });

}