import { createBrowserRouter } from "react-router";
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import AuditLog from "../../modules/admin/pages/AuditLog";
import ManageUsers from "../../modules/admin/pages/ManageUsers";
import Login from "../../modules/auth/pages/Login";
import Register from "../../modules/auth/pages/Register";
import LandingPage from "../../modules/home/pages/LandingPage";
import NotFound from "../../modules/home/pages/NotFound";
import RefereeDashboard from "../../modules/matches/pages/RefereeDashboard";
import RefereeMatchDetail from "../../modules/matches/pages/RefereeMatchDetail";
import CreateProfile from "../../modules/players/pages/CreateProfile";
import EditProfile from "../../modules/players/pages/EditProfile";
import MarkAvailability from "../../modules/players/pages/MarkAvailability";
import PlayerDashboard from "../../modules/players/pages/PlayerDashboard";
import SearchTeams from "../../modules/players/pages/SearchTeams";
import TeamDetail from "../../modules/players/pages/TeamDetail";
import ViewLineup from "../../modules/players/pages/ViewLineup";
import ViewProfile from "../../modules/players/pages/ViewProfile";
import ViewRivalLineup from "../../modules/players/pages/ViewRivalLineup";
import CaptainDashboard from "../../modules/teams/pages/CaptainDashboard";
import ConfigureLineup from "../../modules/teams/pages/ConfigureLineup";
import CreateTeam from "../../modules/teams/pages/CreateTeam";
import ManageTeam from "../../modules/teams/pages/ManageTeam";
import SearchPlayers from "../../modules/teams/pages/SearchPlayers";
import UploadPayment from "../../modules/teams/pages/UploadPayment";
import Bracket from "../../modules/tournaments/pages/Bracket";
import ConfigureTournament from "../../modules/tournaments/pages/ConfigureTournament";
import CreateTournament from "../../modules/tournaments/pages/CreateTournament";
import ManageTeams from "../../modules/tournaments/pages/ManageTeams";
import MatchCalendar from "../../modules/tournaments/pages/MatchCalendar";
import OrganizerDashboard from "../../modules/tournaments/pages/OrganizerDashboard";
import ManageRegistrations from "../../modules/registrations/pages/ManageRegistrations";
import RegisterResult from "../../modules/tournaments/pages/RegisterResult";
import ScheduleMatches from "../../modules/tournaments/pages/ScheduleMatches";
import Standings from "../../modules/tournaments/pages/Standings";
import PlayerPublicProfile from "../../shared/components/common/PlayerPublicProfile";
import TournamentInfo from "../../shared/components/common/TournamentInfo";
import TournamentStats from "../../shared/components/common/TournamentStats";
import Root from "../../shared/components/Root";

export const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{ index: true, Component: LandingPage },
			{ path: "register", Component: Register },
			{ path: "login", Component: Login },

			// Player routes
			{ path: "player/dashboard", Component: PlayerDashboard },
			{ path: "player/profile/create", Component: CreateProfile },
			{ path: "player/profile/edit", Component: EditProfile },
			{ path: "player/profile", Component: ViewProfile },
			{ path: "player/availability", Component: MarkAvailability },
			{ path: "player/teams", Component: SearchTeams },
			{ path: "player/teams/:id", Component: TeamDetail },
			{ path: "player/lineup", Component: ViewLineup },
			{ path: "player/lineup/rival/:id", Component: ViewRivalLineup },

			// Captain routes
			{ path: "captain/create-team", Component: CreateTeam },
			{ path: "captain/dashboard", Component: CaptainDashboard },
			{ path: "captain/manage-team", Component: ManageTeam },
			{ path: "captain/search-players", Component: SearchPlayers },
			{ path: "captain/payment", Component: UploadPayment },
			{ path: "captain/lineup", Component: ConfigureLineup },

			// Organizer routes
			{ path: "organizer/dashboard", Component: OrganizerDashboard },
			{ path: "organizer/create-tournament", Component: CreateTournament },
			{
				path: "organizer/tournament/configure",
				Component: ConfigureTournament,
			},
			{ path: "organizer/teams", Component: ManageTeams },
			{ path: "organizer/registrations", Component: ManageRegistrations },
			{ path: "organizer/payments", Component: ManageRegistrations },
			{ path: "organizer/schedule", Component: ScheduleMatches },
			{ path: "organizer/result/:id", Component: RegisterResult },
			{ path: "organizer/calendar", Component: MatchCalendar },
			{ path: "organizer/standings", Component: Standings },
			{ path: "organizer/bracket", Component: Bracket },

			// Referee routes
			{ path: "referee/dashboard", Component: RefereeDashboard },
			{ path: "referee/match/:id", Component: RefereeMatchDetail },

			// Admin routes
			{ path: "admin/dashboard", Component: AdminDashboard },
			{ path: "admin/players", Component: ManageUsers },
			{ path: "admin/audit", Component: AuditLog },

			// Common routes
			{ path: "stats", Component: TournamentStats },
			{ path: "tournament-info", Component: TournamentInfo },
			{ path: "players/:id", Component: PlayerPublicProfile },

			{ path: "*", Component: NotFound },
		],
	},
]);



