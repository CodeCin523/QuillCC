// path : src/app/providers/{Storage,Auth,Setting}Provider.js
// invalid, need to use NoteService instead
import { createContext, useContext } from "react";

const StorageContext = createContext(null);

export function StorageProvider({ storage, children }) {
  return (
    <StorageContext.Provider value={storage}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
}
 