import { createContext, useRef, useState } from "react";

export const requiredDataContext = createContext(null);

function RequiredDataProvider({ children }){
  const [requiredData, setRequiredData] = useState({
    title: '', price: '', rooms: '', bathrooms: '',
    country: '', city: '', street:'', postalCode: '', houseNum: ''
  });
  const requiredInpRefs = useRef({});
  
  return (
    <requiredDataContext.Provider value={{requiredData, setRequiredData, requiredInpRefs}}>
      {children}
    </requiredDataContext.Provider>
  );
}
export default RequiredDataProvider;