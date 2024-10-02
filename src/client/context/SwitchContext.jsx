import React, { createContext, useState, useContext } from 'react';

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
  const [switchPlans, setSwitchPlans] = useState(false);

  const toggleSwitch = () => {
    setSwitchPlans(prevState => !prevState);
  };

  return (
    <SwitchContext.Provider value={{ switchPlans, toggleSwitch }}>
      {children}
    </SwitchContext.Provider>
  );
};

export const useSwitch = () => {
  return useContext(SwitchContext);
};

export default SwitchContext;
