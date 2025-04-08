import { createContext, useContext } from "react";

const API_URL = "http://localhost:3000/api";

export const ApiContext = createContext({ API_URL });

export const ApiProvider = ({ children }) => {
  return (
    <ApiContext.Provider value={{ API_URL }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
