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
    // used inside renderCountriesAndCities()
    const countryDropdown = document.querySelector("#country");
    for (let obj of data){
        let option = document.createElement("option");
        option.value = obj.country;
        option.innerText = obj.country;
        countryDropdown.insertAdjacentElement('beforeend', option);
    }
}
function renderCities(data){
    // used inside renderCountriesAndCities()
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


