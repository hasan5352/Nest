" use strict";

const imgUrlInput = document.querySelector("#img-url");
const displayImg = document.querySelector(".img-display img");
imgUrlInput.addEventListener('input', ()=>{
    displayImg.src = imgUrlInput.value;
})

const form = document.querySelector("form");
form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let formData = new FormData(form);
    let data = Object.fromEntries(formData.entries());

    let result = await fetch("http://localhost:8080/listings", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
    })
    if (!result.ok){
        result = await result.text();
        alert(result);
    } else{
        window.location.href = "http://localhost:8080/listings";
    }
})