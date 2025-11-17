import { createContext, useState } from "react";

async function isValidImgURL(url){
  try{
    new URL(url);
    const res = await fetch(url, { method: "HEAD" })
    if (res.ok) return true;
    // Verify MIME type is image
    const type = res.headers.get("content-type");
    return type && type.startsWith("image/");
  } catch{
    return false;
  }
}

export const notRequiredDataContext = createContext(null);

function NotRequiredDataProvider({ children }){
  const [notRequiredData, setNotRequiredData] = useState({
    imgs: [], amenities: [], description: '',
  });

  async function addListItem(field, inpRef, isForImgs, imgIsValidRef=null, warningRef=null, imgRef=null) {
    const item = inpRef.current.value.trim();
    if (!item) return;

    if (isForImgs) {
      if (!imgIsValidRef.current) { warningRef.current.classList.remove('display-none'); return; }
      imgRef.current.src = '';
    }

    setNotRequiredData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    inpRef.current.value = '';
  }
  
  function removeListItem(field, idx) {
    setNotRequiredData(prev => ({
      ...prev, [field]: prev[field].filter((_, i) => i !== idx )
    }))
  }

  async function checkValidImgOnChange(isForImgs, inpRef=null, imgIsValidRef=null, warningRef=null, imgRef=null) {
    if (!isForImgs) return;

    warningRef.current.classList.add('display-none');
    if (await isValidImgURL(inpRef.current.value)) {
      imgRef.current.src = inpRef.current.value; 
      imgIsValidRef.current = true;
    } else {
      imgRef.current.src = ''; 
      imgIsValidRef.current = false;
    }
  }

  return (
    <notRequiredDataContext.Provider value={{
      notRequiredData, addListItem, removeListItem, checkValidImgOnChange, setNotRequiredData
    }}>
      {children}
    </notRequiredDataContext.Provider>
  );
}

export default NotRequiredDataProvider;