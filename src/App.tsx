import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { AppRoutes } from "./app/router/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  );
}
