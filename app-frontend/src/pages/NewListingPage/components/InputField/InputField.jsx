import { useContext, useEffect, useRef } from 'react';
import './InputField.css';
import { notRequiredDataContext } from '../../context/NotRequiredDataProvider';
import { requiredDataContext } from '../../context/RequiredDataProvider';

// Optional args: min, max, customName
//** customName should match with corresponding field in requiredData
// param warningText: if not given, validation will not be applied

function InputField({ field, labelText, warningText, type, min, max }){
  const {notRequiredData, setNotRequiredData} = useContext(notRequiredDataContext);
  const {requiredData, setRequiredData, requiredInpRefs} = useContext(requiredDataContext);

  const warningRef = useRef(null), inpRef = useRef(null);

  function onChangeHandler(e, updater){
    if (field != 'description'){
      inpRef.current.style.borderColor = '#524f4f';
      warningRef.current.classList.add('display-none');
    }
    updater(prev => ({...prev, [field]: e.target.value}))
  }

  const inpElem = (field == 'description') ?
    <textarea onChange={e => {onChangeHandler(e, setNotRequiredData)}}
      value={notRequiredData[field]}
      placeholder={`Provide ${field}...`}
    > </textarea>
    :
    <input type={type} min={min} max={max}
      value={requiredData[field]}
      onChange={e => {onChangeHandler(e, setRequiredData)}}
      ref={inpRef} placeholder={`Provide ${field}...`}
      className='red-border'
    />;

    useEffect(()=>{requiredInpRefs.current[(field)] = { warningRef, inpRef }}, []);

  return (
    <div className="field" id={field}>
      <label htmlFor={field}> {labelText} </label>

      {inpElem}
      
      {warningText && <small ref={warningRef} className='display-none'> {warningText} </small>}
    </div>
  );
}

export default InputField;