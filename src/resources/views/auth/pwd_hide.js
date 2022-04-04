'strict mode'
let passwordSwitch = document.querySelector(".clickety");

passwordSwitch.addEventListener("click", function() {
    let password = document.querySelector(".password"),
    pwd_label = document.querySelector(".pwd_label");
    
    if  (password.type === "password"){
        password.type = "text";
        pwd_label.innerhtml = "hide";
        console.log(lol);
    } else {
        password.type = "password";
        pwd_label.innerhtml = "show";
        console.log(nope);
    }
    password.focus();
})