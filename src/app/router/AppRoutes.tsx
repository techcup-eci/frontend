import { Navigate, Route, Routes } from "react-router";
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import AuditLog from "../../modules/admin/pages/AuditLog";
import ManageUsers from "../../modules/admin/pages/ManageUsers";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";
import Login from "../../modules/auth/pages/Login";
import Register from "../../modules/auth/pages/Register";
import LandingPage from "../../modules/home/pages/LandingPage";
import NotFound from "../../modules/home/pages/NotFound";
import RefereeDashboard from "../../modules/matches/pages/RefereeDashboard";
import RefereeMatchDetail from "../../modules/matches/pages/RefereeMatchDetail";
import BecomePlayer from "../../modules/players/pages/BecomePlayer";
import CreateProfile from "../../modules/players/pages/CreateProfile";
import EditProfile from "../../modules/players/pages/EditProfile";
import MarkAvailability from "../../modules/players/pages/MarkAvailability";
import PlayerDashboard from "../../modules/players/pages/PlayerDashboard";
import PlayerInvitations from "../../modules/players/pages/PlayerInvitations";
import SearchTeams from "../../modules/players/pages/SearchTeams";
import TeamDetail from "../../modules/players/pages/TeamDetail";
import TeamInvitationDetail from "../../modules/players/pages/TeamInvitationDetail";
import ViewLineup from "../../modules/players/pages/ViewLineup";
import ViewProfile from "../../modules/players/pages/ViewProfile";
import ViewRivalLineup from "../../modules/players/pages/ViewRivalLineup";
import ManageRegistrations from "../../modules/registrations/pages/ManageRegistrations";
import CaptainDashboard from "../../modules/teams/pages/CaptainDashboard";
//import ConfigureLineup from "../../modules/teams/pages/ConfigureLineup";
import CreateTeam from "../../modules/teams/pages/CreateTeam";
import ManageTeam from "../../modules/teams/pages/ManageTeam";
import PendingRequests from "../../modules/teams/pages/PendingRequests";
import PlayerRequestDetail from "../../modules/teams/pages/PlayerRequestDetail";
import SearchPlayers from "../../modules/teams/pages/SearchPlayers";
import UploadPayment from "../../modules/teams/pages/UploadPayment";
import Bracket from "../../modules/tournaments/pages/Bracket";
import ConfigureTournament from "../../modules/tournaments/pages/ConfigureTournament";
import CreateTournament from "../../modules/tournaments/pages/CreateTournament";
import ManageTeams from "../../modules/tournaments/pages/ManageTeams";
import MatchCalendar from "../../modules/tournaments/pages/MatchCalendar";
import OrganizerDashboard from "../../modules/tournaments/pages/OrganizerDashboard";
import OrganizerProfile from "../../modules/tournaments/pages/OrganizerProfile";
import RegisterResult from "../../modules/tournaments/pages/RegisterResult";
import ScheduleMatches from "../../modules/tournaments/pages/ScheduleMatches";
import Standings from "../../modules/tournaments/pages/Standings";
import UserDashboard from "../../modules/users/pages/UserDashboard";
import UserProfile from "../../modules/users/pages/UserProfile";
import UserTeams from "../../modules/users/pages/UserTeams";
import PlayerPublicProfile from "../../shared/components/common/PlayerPublicProfile";
import TournamentInfo from "../../shared/components/common/TournamentInfo";
import TournamentStats from "../../shared/components/common/TournamentStats";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import AuthLayout from "../../shared/layouts/AuthLayout";
import DashboardLayout from "../../shared/layouts/DashboardLayout";
import RootLayout from "../../shared/layouts/RootLayout";

// ── Role Guard ──────────────────────────────────────────────────────────────
function RoleGuard({
	allowed,
	children,
}: {
	allowed: string[];
	children: React.ReactNode;
}) {
	const role = useAuthStore((state) => state.user?.role ?? "invited");
	const roleDashboards: Record<string, string> = {
		admin: "/admin/dashboard",
		organizer: "/organizer/dashboard",
		captain: "/captain/dashboard",
		referee: "/referee/dashboard",
		player: "/player/dashboard",
		invited: "/user/dashboard",
	};
	if (!allowed.includes(role)) {
		return <Navigate to={roleDashboards[role] ?? "/user/dashboard"} replace />;
	}
	return <>{children}</>;
}

function RoleBasedHome() {
	const user = useAuthStore((state) => state.user);
	const roleDashboards: Record<string, string> = {
		admin: "/admin/dashboard",
		organizer: "/organizer/dashboard",
		captain: "/captain/dashboard",
		referee: "/referee/dashboard",
		player: "/player/dashboard",
		invited: "/user/dashboard",
	};
	const dest = roleDashboards[user?.role ?? "invited"] ?? "/user/dashboard";
	return <Navigate to={dest} replace />;
}

export function AppRoutes() {
	return (
		<Routes>
			{/* Public Routes with Navbar */}
			<Route element={<RootLayout />}>
				<Route path="/tournament-stats" element={<TournamentStats />} />
				<Route path="/tournament-info" element={<TournamentInfo />} />
				<Route path="/players/:id" element={<PlayerPublicProfile />} />
			</Route>

			{/* Landing Page — standalone, no RootLayout Navbar */}
			<Route path="/" element={<LandingPage />} />

			{/* Auth Routes without Navbar/Sidebar */}
			<Route element={<AuthLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Route>

			{/* Protected/Dashboard Routes with Navbar & Sidebar */}
			<Route element={<ProtectedRoute />}>
				<Route element={<DashboardLayout />}>
					{/* User (invited) */}
					<Route
						path="/user/dashboard"
						element={
							<RoleGuard allowed={["invited", "user"]}>
								<UserDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/user/profile"
						element={
							<RoleGuard allowed={["invited", "user"]}>
								<UserProfile />
							</RoleGuard>
						}
					/>
					<Route
						path="/user/teams"
						element={
							<RoleGuard allowed={["invited", "user", "player", "captain"]}>
								<UserTeams />
							</RoleGuard>
						}
					/>
					<Route path="/user/teams/:id" element={<TeamDetail />} />

					{/* Player */}
					<Route
						path="/player/dashboard"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<PlayerDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/profile/create"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<CreateProfile />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/profile/becomePlayer"
						element={
							<RoleGuard allowed={["invited", "user"]}>
								<BecomePlayer />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/profile/edit"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<EditProfile />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/profile"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<ViewProfile />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/availability"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<MarkAvailability />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/teams"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<SearchTeams />
							</RoleGuard>
						}
					/>
					<Route path="/player/teams/:id" element={<TeamDetail />} />
					<Route
						path="/player/invitations"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<PlayerInvitations />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/invitations/:teamId"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<TeamInvitationDetail />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/lineup"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<ViewLineup />
							</RoleGuard>
						}
					/>
					<Route
						path="/player/lineup/rival/:id"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<ViewRivalLineup />
							</RoleGuard>
						}
					/>

					{/* Captain */}
					<Route
						path="/captain/create-team"
						element={
							<RoleGuard allowed={["player", "captain"]}>
								<CreateTeam />
							</RoleGuard>
						}
					/>
					<Route
						path="/captain/dashboard"
						element={
							<RoleGuard allowed={["captain"]}>
								<CaptainDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/captain/manage-team"
						element={
							<RoleGuard allowed={["captain"]}>
								<ManageTeam />
							</RoleGuard>
						}
					/>
					<Route
						path="/captain/search-players"
						element={
							<RoleGuard allowed={["captain"]}>
								<SearchPlayers />
							</RoleGuard>
						}
					/>

					<Route
						path="/captain/requests"
						element={
							<RoleGuard allowed={["captain"]}>
								<PendingRequests />
							</RoleGuard>
						}
					/>
					<Route
						path="/captain/requests/:jugadorId"
						element={
							<RoleGuard allowed={["captain"]}>
								<PlayerRequestDetail />
							</RoleGuard>
						}
					/>
					<Route
						path="/captain/payments"
						element={
							<RoleGuard allowed={["captain"]}>
								<UploadPayment />
							</RoleGuard>
						}
					/>

					{/* Organizer */}
					<Route
						path="/organizer/dashboard"
						element={
							<RoleGuard allowed={["organizer"]}>
								<OrganizerDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/profile"
						element={
							<RoleGuard allowed={["organizer"]}>
								<OrganizerProfile />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/create-tournament"
						element={
							<RoleGuard allowed={["organizer"]}>
								<CreateTournament />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/tournament/configure"
						element={
							<RoleGuard allowed={["organizer"]}>
								<ConfigureTournament />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/teams"
						element={
							<RoleGuard allowed={["organizer", "admin"]}>
								<ManageTeams />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/payments"
						element={
							<RoleGuard allowed={["organizer", "admin"]}>
								<ManageRegistrations />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/schedule"
						element={
							<RoleGuard allowed={["organizer", "admin"]}>
								<ScheduleMatches />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/result/:id"
						element={
							<RoleGuard allowed={["organizer", "admin"]}>
								<RegisterResult />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/calendar"
						element={
							<RoleGuard allowed={["organizer", "admin"]}>
								<MatchCalendar />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/standings"
						element={
							<RoleGuard
								allowed={[
									"organizer",
									"admin",
									"player",
									"captain",
									"referee",
									"invited",
									"user",
								]}
							>
								<Standings />
							</RoleGuard>
						}
					/>
					<Route
						path="/organizer/bracket"
						element={
							<RoleGuard
								allowed={[
									"organizer",
									"admin",
									"player",
									"captain",
									"referee",
									"invited",
									"user",
								]}
							>
								<Bracket />
							</RoleGuard>
						}
					/>

					<Route
						path="/referee/dashboard"
						element={
							<RoleGuard allowed={["referee"]}>
								<RefereeDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/referee/match/:id"
						element={
							<RoleGuard allowed={["referee"]}>
								<RefereeMatchDetail />
							</RoleGuard>
						}
					/>

					<Route
						path="/admin/dashboard"
						element={
							<RoleGuard allowed={["admin"]}>
								<AdminDashboard />
							</RoleGuard>
						}
					/>
					<Route
						path="/admin/players"
						element={
							<RoleGuard allowed={["admin"]}>
								<ManageUsers />
							</RoleGuard>
						}
					/>
					<Route
						path="/admin/audit"
						element={
							<RoleGuard allowed={["admin"]}>
								<AuditLog />
							</RoleGuard>
						}
					/>

					<Route path="/home" element={<RoleBasedHome />} />
				</Route>
			</Route>

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
