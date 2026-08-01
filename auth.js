
console.log("AUTH.JS ΦΟΡΤΩΘΗΚΕ");
function loginUser()
{
console.log("Η loginUser ξεκίνησε");
let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



fetch("backend/api/login.php",
{

method:"POST",

credentials: "include",
headers:
{
"Content-Type":
"application/x-www-form-urlencoded"
},


body:

"email=" + encodeURIComponent(email)
+
"&password=" + encodeURIComponent(password)


})


.then(response => response.text())


.then(data=>{


console.log("Απάντηση server:", data);



if(data.includes("SUCCESS"))
{

    console.log("Μπήκα στο SUCCESS");


    let successData =
    data.split("SUCCESS|")[1];


    let parts =
    successData.split("|");



    let userId =
    parts[0];


    let username =
    parts[1];



    localStorage.setItem(
        "user_id",
        userId
    );


    localStorage.setItem(
        "loggedUser",
        username
    );



    console.log(
        "User ID:",
        userId
    );


    console.log(
        "Username:",
        username
    );



    document.getElementById("login-message").innerHTML =
    "Σύνδεση επιτυχής. Καλώς ήρθες " + username;



    window.location.href = "index.html";


}
else
{

    document.getElementById("login-message").innerHTML =
    data;

}



})


.catch(error=>{


console.log(
"Σφάλμα login:",
error
);


});



}





function checkLogin()
{


let user =
localStorage.getItem("loggedUser");



let loginButton =
document.getElementById("login-button");

let registerButton =
document.getElementById("register-button");

let userArea =
document.getElementById("user-area");




if(user)
{


    if(loginButton)
    {
        loginButton.style.display = "none";
    }

if(registerButton)
{
    registerButton.style.display = "none";
}

    if(userArea)
    {

        userArea.innerHTML =
        `
        <button class="user-button">
        ☀️ ${user}
        </button>


        <button class="logout-button" onclick="logoutUser()">
        🚪 Αποσύνδεση
        </button>

     <button id="delete-account-button" onclick="deleteAccount()">
🗑️ Διαγραφή λογαριασμού
</button>
        `;

    }



}

else
{


    if(loginButton)
    {
        loginButton.style.display = "inline";
    }


}



}





function logoutUser()
{

     fetch("/CalmFlow_Journey/backend/api/logout.php",
    {
        method:"GET",
        credentials:"include"
    })

    .then(response => response.text())

    .then(data => {

        console.log("Logout server:", data);


        localStorage.removeItem("loggedUser");

        localStorage.removeItem("user_id");
         
window.location.href = "/CalmFlow_Journey/index.html";


    })

    .catch(error => {

        console.log(
            "Σφάλμα logout:",
            error
        );

    });

}

function deleteAccount()
{

    let answer = confirm(
        "Είσαι σίγουρος/η ότι θέλεις να διαγράψεις οριστικά τον λογαριασμό και όλα τα δεδομένα σου;"
    );

    if(!answer)
    {
        return;
    }

    fetch("backend/api/delete_account.php",
    {
        method:"POST",
        credentials:"include"
    })

    .then(response => response.text())

    .then(data => {

        alert(data);

        localStorage.removeItem("loggedUser");
        localStorage.removeItem("user_id");

        window.location.href = "index.html";

    })

    .catch(error=>{

        console.log(error);

    });

}