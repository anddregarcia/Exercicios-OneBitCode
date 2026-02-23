import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { NewPurchase } from "./pages/NewPurchase";
import { Pantry } from "./pages/Pantry";
import { Items } from "./pages/Items";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Pricing } from "./pages/Pricing";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/pricing",
    Component: Pricing,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "new-purchase", Component: NewPurchase },
      { path: "pantry", Component: Pantry },
      { path: "items", Component: Items },
      { path: "settings", Component: Settings },
    ],
  },
]);