import './NewListingForm.css';
import { useContext, useRef } from "react";
import useScrollToAndFocus from '../../hooks/useScrollToAndFocus';
import InputField from "./components/InputField/InputField";
import SelectField from "./components/SelectField/SelectField";
import ListInput from "./components/ListInput/ListInput";
import { requiredDataContext } from './context/RequiredDataProvider';
import { notRequiredDataContext } from './context/NotRequiredDataProvider';
import axios from 'axios';

function isValidNum(num, lowerBound, upperBound){
  num = Number(num);
  if (isNaN(num) || num < lowerBound || num > upperBound) return false;
  return true;
}

const FORM_SUBMISSION_URL = '/api/listings';
async function postDataToBackend(data, url){
  try{
    let res = await axios.post(url, data);
    console.log("SUCESS BRO")
  } catch (err) {
    alert(err.response.data);
  }
}

function NewListingForm() {
  const displayImg = useRef(null);

  const {notRequiredData} = useContext(notRequiredDataContext);
  const {requiredData, requiredInpRefs} = useContext(requiredDataContext);

  function isValidateForm(){
    let firstInvalid = null;

    Object.keys(requiredData).forEach(k => {
      const v = requiredData[k];
      let isProblematic = false;

      if (!v) {
        isProblematic = true;
      } else if (k == 'price') {
			  if (!isValidNum(v, 5, 10000)) isProblematic = true;
      } else if (k == 'rooms' || k == "bathrooms"){
        if (!isValidNum(v, 1, 15)) isProblematic = true;
		  }

      if (isProblematic) {
        const { warningRef, inpRef } = requiredInpRefs.current[k];
        if (!firstInvalid) firstInvalid = inpRef.current;
        inpRef.current.style.borderColor = 'red';
        warningRef.current.classList.remove('display-none');
      }
    })

    if (!firstInvalid) return true;
    useScrollToAndFocus(firstInvalid);

    return false;
  }

  function submitHandler(e) {
    e.preventDefault();
    if (!isValidateForm()) return;

    const formData = {...notRequiredData, ...requiredData};
    formData.price = Number(formData.price); formData.rooms = Number(formData.rooms); 
    formData.bathrooms = Number(formData.bathrooms);

    console.log(formData);
    postDataToBackend(formData, FORM_SUBMISSION_URL);
  }

  return (
    <form action="" noValidate onSubmit={submitHandler}>
      <div className="container">
        <InputField field={"title"} labelText={"Title"} warningText={"Provide a valid title"} 
          type={"text"}/>

        <InputField field={"price"} labelText={"Price (€ /night)"} min={'5'} max={'10000'}
          warningText={"Provide a price between 5 - 10k €"} type="number" />
      </div>

      <div className="container">
        <InputField field={'rooms'} labelText={'Rooms'} min={'1'} max={'15'} 
          warningText={'Provide no. of rooms between 1 - 15'} type="number" />
          
        <InputField field={'bathrooms'} labelText={'Bathrooms'} min={'1'} max={'15'} 
          warningText={'Provide no. of bathrooms between 1 - 15'} type="number" />
      </div>

      <div className="container">
        <SelectField field='country' labelText='Country' warningText='Provide a valid country' />
        <SelectField field='city' labelText='City' warningText='Provide a valid city' />
      </div>

      <div className="container">
        <InputField field={'street'} labelText={'Street'} type="text" warningText={'Provide a valid street'} />
        
        <InputField field={'postalCode'} labelText={'Postal Code'} type="text"
          warningText={'Provide a valid postal-code'} />
        
        <InputField field={'houseNum'} labelText={'House No.'} type="text"
          warningText={'Provide a valid house no.'} min='0' />
      </div>
      
      <div className="container">
        <InputField field={'description'} labelText={'Description'} />
      </div>

      <div className="container" id="img-div">
        <div id="img-display"> <img src={null} alt="Preview image" ref={displayImg} /> </div>
        <ListInput field={'imgs'} labelText={'Image URL'} warningText={'Invalid URL !'} 
          isForImgs={true} displayImg={displayImg} />
      </div>

      <ListInput field={'amenities'} labelText={'Amenities'} />
      
      <button type="submit">Add Listing</button>
    </form>
  );
}

export default NewListingForm;