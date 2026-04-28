// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./core/router";
import { useAuthSession } from "./modules/auth/hooks/useAuthSession";
import { useAuthStore } from "./modules/auth/hooks/useAuthStore";

function App() {
	useAuthSession();
	const authStatus = useAuthStore((state) => state.status);

	if (authStatus === "checking") {
		return (
			<div className="flex min-h-screen items-center justify-center px-6 text-center text-slate-700">
				<p className="text-lg font-medium">Verificando sesión activa...</p>
			</div>
		);
	}

	return <RouterProvider router={router} />;
}

export default App;
