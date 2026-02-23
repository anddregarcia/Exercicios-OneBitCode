import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { PurchaseFormProvider } from "./contexts/PurchaseFormContext";

export default function App() {
  return (
    <AuthProvider>
      <PurchaseFormProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PurchaseFormProvider>
    </AuthProvider>
  );
}