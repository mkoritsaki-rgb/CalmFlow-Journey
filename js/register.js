document.getElementById("register-form")
.addEventListener("submit", function(e)
{

e.preventDefault();


let username =
document.getElementById("username").value;


let email =
document.getElementById("email").value;


let password =
document.getElementById("password").value;



fetch("backend/api/register.php",
{

method:"POST",

headers:
{
"Content-Type":"application/x-www-form-urlencoded"
},


body:
"username=" + encodeURIComponent(username) +
"&email=" + encodeURIComponent(email) +
"&password=" + encodeURIComponent(password)

})


.then(response => response.json())


.then(data =>
{

console.log(data);


let message =
document.getElementById("register-message");



if(data.success)
{

    message.innerHTML =
    "✅ Ο λογαριασμός δημιουργήθηκε επιτυχώς! Μπορείς τώρα να συνδεθείς.";


    message.style.color = "green";


}
else
{

    message.innerHTML =
    "⚠️ " + data.message;


    message.style.color = "red";

}


})


.catch(error =>
{

console.log(error);


document.getElementById("register-message").innerHTML =
"❌ Παρουσιάστηκε πρόβλημα. Δοκίμασε ξανά.";

});


});