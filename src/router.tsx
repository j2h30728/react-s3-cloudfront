import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import DetailCharacter from "./pages/DetailCharacter";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "",
    errorElement: <div>Error</div>,
    children: [
      {
        path: "character/:id",
        element: <DetailCharacter />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);
export default router;
