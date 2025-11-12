" use strict";

// -------------------------------- Invalid Input warnings -----------------------------------
function hideWarningMsgs(){
    const warnings = document.querySelectorAll(".field small");
    for (let warning of warnings) warning.classList.add("display-none");
}
hideWarningMsgs();

// ---------------------------------------- Displaying Image -----------------------------------------
function isValidImgURL(url){
    return new Promise(async (resolve, reject)=>{
        try{
            new URL(url);

            const res = await fetch(url, { method: "HEAD" })
            if (res.ok) resolve("Valid URL")
            else throw Error();
        } catch{
            reject("Invalid URL")
        }
    });
}
const imgUrlInput = document.querySelector("#img-url");
const urlWarningP = document.querySelector("#img-div small");
const displayImg = document.querySelector("#img-display img");

let urlIsValid = false;
imgUrlInput.addEventListener('input', (e)=>{
    isValidImgURL(imgUrlInput.value)
        .then(()=> {
            displayImg.src = imgUrlInput.value;
            urlIsValid = true;
        }) .catch(()=>{
            displayImg.src = "";
            urlIsValid = false;
        })
    urlWarningP.classList.add("display-none");
})

// ------------------------------- Add and remove image URLs ------------------------- >
function addInpToList(listEl, inpEl, innerHtml){
    if (inpEl.value.length == 0) return;
    let newLi = document.createElement("li");
    newLi.innerHTML = innerHtml;
    listEl.append(newLi);
    inpEl.value = "";
    return newLi;
}
const addImgBtn = document.querySelector("#img-div button");
const urlOl = document.querySelector("#img-div ol");

addImgBtn.addEventListener('click', ()=>{
    if (imgUrlInput.value.length == 0) return;
    if (urlIsValid){
        const innerHtml = `<div> <p> ${imgUrlInput.value} </p> <img src="/assets/cross.png"></div>`;
        const newLi = addInpToList(urlOl, imgUrlInput, innerHtml);
        newLi.firstChild.lastChild.addEventListener('click', () => newLi.remove());    // remove listener on cross image
        displayImg.src = "";
    } else{
        urlWarningP.classList.remove("display-none")
    }
})

function triggerButtonOnEnter(inp, btn){
    inp.addEventListener('keypress', (e)=>{
        if (e.key != "Enter") return;
        e.preventDefault();
        btn.classList.add("scale-09");
        btn.click();
        setTimeout(() => {
            btn.classList.remove("scale-09");
        }, 100);
    })
}
triggerButtonOnEnter(imgUrlInput, addImgBtn);

// ---------------------------------------- Adding and removing Amenities -----------------------------------------
const addAmenityBtn = document.querySelector("#amenity-div button");
const AmenityUl = document.querySelector("#amenity-div ul");
const AmenityInput = document.querySelector("#amenity-inp");

addAmenityBtn.addEventListener('click', ()=>{
    const amenity = AmenityInput.value[0].toUpperCase() + AmenityInput.value.slice(1).toLowerCase();
    const newLi = addInpToList(AmenityUl, AmenityInput, `<p>${amenity}</p> <img src="/assets/cross.png">`);
    newLi.lastChild.addEventListener('click', () => newLi.remove());    // remove listener on cross image
})
triggerButtonOnEnter(AmenityInput, addAmenityBtn);


// --------------------------------- Handling required elems for form submission ---------------------------
const form = document.querySelector("form");
let requiredElems = form.querySelectorAll('[required]');
requiredElems.forEach((el) => {
    el.addEventListener('input', () => {        // reset field state
        el.classList.remove("red-border");
        el.nextElementSibling.classList.add("display-none");    // invalid message
    });
})

// ------------------------------ Handling form submission ----------------------------------
function validateForm(requiredElements){
    let firstInvalid = null;
    
    requiredElements.forEach(el => {
        let isProblematic = false;
        const elValue = el.value.trim();

        if (!elValue) {
            isProblematic = true;
        } else if (el.id == 'price'){
            const price = Number(elValue);
            if (elValue[0] == '0' || isNaN(price) || price < 5 || price > 10000) isProblematic = true;
        } else if (el.id == 'rooms' || el.id == "bathrooms"){
            const unit = Number(elValue);
            if (elValue[0] == '0' || isNaN(unit) || unit < 1 || price > 15) isProblematic = true;
        }
        
        if (isProblematic) {                             // field missing
            if (!firstInvalid) firstInvalid = el;
            el.nextElementSibling.classList.remove("display-none");
            el.classList.add("red-border");
        } 
    });

    if (firstInvalid) {
        firstInvalid.scrollIntoView({behavior: "smooth", block: "center"});
        setTimeout(() => firstInvalid.focus(), 100);
        return false;
    }
    return true;
}

async function handleFormSubmission (url, requestBody) {
    let result = await fetch(url, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(requestBody)
    });
    if (!result.ok){
        try{
            result = await result.json();
            alert("Missing required fields:\n- " + result.join("\n- "));
        } catch {
            result = await result.text();
            alert(result);
        }
    } else{
        form.reset();
        window.location.href = "http://localhost:8080/listings";
    }
}

const formSubmitUrl = "http://localhost:8080/listings";
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (!validateForm(requiredElems)) return;

    if (!confirm("Submit this listing now?")) return;

    imgUrlInput.value = "";
    let formData = new FormData(form);                      // get form data
    let data = Object.fromEntries(formData.entries());
    
    data.imgs = Array.from(urlOl.children).map( li => li.firstChild.children[0].textContent );     // get all image urls
    data.amenities = Array.from(AmenityUl.children).map(li => li.children[0].textContent);         // get all amenities

    handleFormSubmission(formSubmitUrl, data);
})

// ------------------------------ Displaying countries and cities dropdown ------------------------------ 
const COUNTRY_DATA_URL = "http://localhost:8080/api/countryData";
async function getCountryData(url) {
    let res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
}
function renderCountries(data) {
    /* 
    Used inside renderCountriesAndCities().
    param data: got from getCountryData().
    */
    const countryDropdown = document.querySelector("#country");
    for (let obj of data){
        let option = document.createElement("option");
        option.value = obj.country;
        option.innerText = obj.country;
        countryDropdown.insertAdjacentElement('beforeend', option);
    }
}
function renderCities(data){
    /* 
    Used inside renderCountriesAndCities().
    param data: got from getCountryData().
    */
    const countryDropdown = document.querySelector("#country");
    countryDropdown.addEventListener('change', (e)=>{
        let idx = e.target.selectedIndex
        let country = e.target.options[idx].value.toLowerCase();
        let cities = [];
        for (let obj of data){
            if (obj.country.toLowerCase() == country) {
                cities = obj.cities;
                break;
            }
        }
        const cityDropdown = document.querySelector("#city");
        while (cityDropdown.children.length > 1) cityDropdown.removeChild(cityDropdown.lastChild);
        for (let city of cities){
            let option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            cityDropdown.insertAdjacentElement('beforeend', option);
        }
    })
}
async function renderCountriesAndCities(url) {
    try {
        let data = await getCountryData(url);
        if (!data || (Array.isArray(data) && data.length === 0)) throw new Error("No data received");
        renderCountries(data);
        renderCities(data);
    } catch {
        alert("Unable to load form fully. Please try again later.")
        window.location.href = "http://localhost:8080/listings";
    }
}
renderCountriesAndCities(COUNTRY_DATA_URL);


