" use strict";

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

	handleFormSubmission(formSubmitUrl, data);
})


