import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRoutes } from "./app/router/AppRoutes";
import { useAuthSession } from "./modules/auth/hooks/useAuthSession";

export default function App() {
  useAuthSession();

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
