import { useContext, useRef, useEffect, useMemo } from 'react';
import Select from 'react-select'
import { requiredDataContext } from '../../context/RequiredDataProvider';
import countryData from '../../../../data/countryData.json';

// param warningText: if not given, validation will not be applied
function SelectField({ field, labelText, warningText }) {
  const {requiredData, setRequiredData, requiredInpRefs} = useContext(requiredDataContext);

  const places = useMemo(()=> {
    if (field === 'country') return countryData.map(c => c.country);
    
    if (!requiredData.country) return [];
    
    return countryData.filter(c => c.country == requiredData.country)[0].cities
    
  }, [field, requiredData.country]);
  
  const options = places.map(p => ({value: p, label: p}));

  const warningRef = useRef(null), inpRef = useRef(null);
  useEffect(()=>{
    if (warningText) requiredInpRefs.current[field] = { warningRef, inpRef }
  }, []);

  return (
    <div className="field">
      <label htmlFor={field}>{labelText} </label>

      <div ref={inpRef} style={{border: '1px solid'}}>
        <Select options={options} isClearable={true} className={'.select'}
          inputId={field}
          value={requiredData[field] ? { value: requiredData[field], label: requiredData[field] } : null}

          onChange={(e)=>{
            inpRef.current.style.borderColor = 'white';
            warningRef.current.classList.add('display-none');
            const v = (e? e.value : '');
            setRequiredData(prev => ({ 
              ...prev, [field]: v, city: (field==='country'? '' : v)
            }));
          }}
        />
      </div>
      
      {warningText && <small ref={warningRef} className='display-none'> {warningText} </small>}
    </div>
  );
}

export default SelectField;