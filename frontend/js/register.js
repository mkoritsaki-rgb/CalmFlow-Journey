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



fetch("../backend/api/register.php",
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


.then(response => response.text())


.then(data =>
{

console.log(data);


document.getElementById("register-message").innerHTML = data;


})


.catch(error =>
{

console.log(error);

});


});
