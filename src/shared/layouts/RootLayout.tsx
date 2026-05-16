import { Outlet, useLocation } from "react-router";
import Navbar from "../components/shared/Navbar";

export default function RootLayout() {
	const location = useLocation();
	const hideNavbarActions = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background flex flex-col">
			<Navbar hideActions={hideNavbarActions} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
