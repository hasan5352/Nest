import { useContext, useRef } from 'react';
import './ListInput.css';
import { notRequiredDataContext } from '../../context/NotRequiredDataProvider';
import crossImg from '../../../../assets/cross.png';

// field: can be imgs or amenities
// props only for imgs: isForImgs, displayImg
function ListInput({ field, labelText, warningText, isForImgs, displayImg }) {
  const {notRequiredData, addListItem, removeListItem, checkValidImgOnChange} = useContext(notRequiredDataContext);
  const inp = useRef(null), warning = useRef(null); 
  let imgIsValid = useRef(false);

  return (
    <div className='list-div' id={`${field}-div`}>
      <div>
        <label htmlFor={field}> {labelText} </label>
        {isForImgs && <small ref={warning} className='display-none' >{warningText}</small>}
      </div>

      <div>
        <input ref={inp} placeholder={`Add ${field}...`} 
          type="text" id={field} 
          onChange={()=>{checkValidImgOnChange(isForImgs, inp, imgIsValid, warning, displayImg)}}
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              e.preventDefault();
              addListItem(field, inp, isForImgs, imgIsValid, warning, displayImg);
            }
          }}
        />
        <button onClick={()=>{addListItem(field, inp, isForImgs, imgIsValid, warning, displayImg)}} 
          type="button"> Add </button>
      </div>
      
      <ol>
        {[notRequiredData[field].map((x, i) => (
          <li key={i}>
            <div>
              <p> {x} </p> <img src={crossImg} onClick={() => {removeListItem(field, i)}} />
            </div>
          </li>
        ))]}
      </ol>
    </div>
  );
}

export default ListInput;