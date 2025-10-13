" use strict";

// ---------------------------------------- Image URL handling -----------------------------------------
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
const urlWarningP = document.querySelector("#url-label-div p");
const displayImg = document.querySelector("#img-display img");

let urlIsValid = false;
imgUrlInput.addEventListener('input', (e)=>{
    isValidImgURL(imgUrlInput.value)
        .then(()=> {
            displayImg.src = imgUrlInput.value;
            urlIsValid = true;
        })
    urlWarningP.classList.add("display-none");
})

// < --------- Add and remove URLs -------- >
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

// ---------------------------------------- Handling Amenities -----------------------------------------
const addAmenityBtn = document.querySelector("#amenity-div button");
const AmenityUl = document.querySelector("#amenity-div ul");
const AmenityInput = document.querySelector("#amenity-inp");

addAmenityBtn.addEventListener('click', ()=>{
    const amenity = AmenityInput.value[0].toUpperCase() + AmenityInput.value.slice(1).toLowerCase();
    const newLi = addInpToList(AmenityUl, AmenityInput, `<p>${amenity}</p> <img src="/assets/cross.png">`);
    newLi.lastChild.addEventListener('click', () => newLi.remove());    // remove listener on cross image
})
triggerButtonOnEnter(AmenityInput, addAmenityBtn);



// ------------------------------ Sending form data to backend ------------------------------ 
const form = document.querySelector("form");
form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if (!confirm("Submit this listing now?")) return;

    imgUrlInput.value = "";
    let formData = new FormData(form);                      // get form data
    let data = Object.fromEntries(formData.entries());
    
    const imgUrls = [];
    for (const li of urlOl.children){
        const imgUrl = li.firstChild.children[0].textContent;
        imgUrls.push(imgUrl);
    }
    data.imgs = imgUrls;

    const amenities = [];
    for (const li of AmenityUl.children){
        const amenity = li.children[0].textContent;
        amenities.push(amenity);
    }
    data.amenities = amenities;

    let result = await fetch("http://localhost:8080/listings", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data)
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
        window.location.href = "http://localhost:8080/listings";
    }
})



// ------------------------------ Displaying countries and cities dropdown ------------------------------ 
const COUNTRY_DATA_URL = "http://localhost:8080/api/countryData";
async function getCountryData(url) {
    let data = [];
    try{
        let response = await fetch(url, { method: "GET" });
        data = await response.json();
    } catch (err){
        console.log(err);
        alert("Unable to load form fully. Please try again later.")
        window.location.href = "http://localhost:8080/listings";
    }
    return data;
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
    let data = await getCountryData(url);
    renderCountries(data);
    renderCities(data);
}
renderCountriesAndCities(COUNTRY_DATA_URL);


