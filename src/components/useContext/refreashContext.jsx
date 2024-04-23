import React, { createContext, useContext, useState } from "react";

const MainRefreshContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function useMainRefresh() {
  return useContext(MainRefreshContext);
}

export const MainRefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <MainRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </MainRefreshContext.Provider>
  );
};
