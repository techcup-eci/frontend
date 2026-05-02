import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
