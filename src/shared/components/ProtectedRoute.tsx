import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";

interface ProtectedRouteProps {
	children?: React.ReactNode;
	requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
	const status = useAuthStore((state) => state.status);
	const user = useAuthStore((state) => state.user);
	const location = useLocation();

	// Still checking stored auth on app load
	if (status === "checking") {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-cool-sky)] border-t-transparent" />
			</div>
		);
	}

	// Not authenticated — redirect to login with return URL
	if (status === "unauthenticated") {
		const redirect = encodeURIComponent(location.pathname + location.search);
		return <Navigate to={`/login?redirect=${redirect}`} replace />;
	}

	// Authenticated but role check fails
	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to="/" replace />;
	}

	// Authenticated and role OK — render children or Outlet for layout routes
	return <>{children ?? <Outlet />}</>;
}
