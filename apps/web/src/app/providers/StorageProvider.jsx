// path : src/app/providers/{Storage,Auth,Setting}Provider.js
// invalid, need to use NoteService instead
import { createContext, useContext, useState } from "react";

const StorageContext = createContext({
  adapter: null
});

export function StorageProvider({ storageAdapter, children }) {
  const [storage, setStorage] = useState({
    adapter: storageAdapter
  });

  const switchStorage = () => {
    setStorage(none);
  }

  return (
    <StorageContext.Provider value={{ storage, switchStorage }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
