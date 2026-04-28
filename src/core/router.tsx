// src/core/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "../modules/auth/LoginPage";
export const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/login" replace />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	// This will be the main layout route, where we can add a navbar and sidebar for navigation between modules
	/* {
		path: "/",
		element: <MainLayout />, // Layout con Navbar y Sidebar
		children: [
			{
				path: "teams",
				element: <TeamsPage />,
			},
			{
				path: "payments",
				element: <PaymentsPage />,
			},
			// Más rutas de módulos aquí...
		],
	}, */
]);
