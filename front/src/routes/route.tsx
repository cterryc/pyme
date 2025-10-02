import { createBrowserRouter } from "react-router-dom";
import { Auth } from "@/pages/Auth";


export const mainRouter = createBrowserRouter([
  { path: "/auth", element: <Auth /> },
])
