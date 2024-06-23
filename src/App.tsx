import { Outlet } from "react-router-dom";

import { CacheContextProvider } from "./contexts/CacheContext";

const App = () => {
  return (
    <CacheContextProvider>
      <Outlet />
    </CacheContextProvider>
  );
};

export default App;
