/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import createCache from "#/utils/createCache";
import { createContext, useContext } from "react";

type CacheContextType = ReturnType<typeof createCache>;

export const CacheContext = createContext<CacheContextType>({} as CacheContextType);

export const CacheContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { setCacheData, getCacheData, isCachedDataValid } = createCache();

  return (
    <CacheContext.Provider value={{ setCacheData, getCacheData, isCachedDataValid }}>{children}</CacheContext.Provider>
  );
};

export const useCacheContext: () => CacheContextType = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error("useCacheContext must be used within CacheProvider");
  }
  return context;
};
