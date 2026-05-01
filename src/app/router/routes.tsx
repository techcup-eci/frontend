import { createBrowserRouter } from "react-router";
import Root from "../../shared/components/Root";
import LandingPage from "../../modules/home/pages/LandingPage";
import Register from "../../modules/auth/pages/Register";
import Login from "../../modules/auth/pages/Login";
import PlayerDashboard from "../../modules/players/pages/PlayerDashboard";
import CreateProfile from "../../modules/players/pages/CreateProfile";
import EditProfile from "../../modules/players/pages/EditProfile";
import ViewProfile from "../../modules/players/pages/ViewProfile";
import MarkAvailability from "../../modules/players/pages/MarkAvailability";
import SearchTeams from "../../modules/players/pages/SearchTeams";
import TeamDetail from "../../modules/players/pages/TeamDetail";
import ViewLineup from "../../modules/players/pages/ViewLineup";
import ViewRivalLineup from "../../modules/players/pages/ViewRivalLineup";
import CreateTeam from "../../modules/teams/pages/CreateTeam";
import CaptainDashboard from "../../modules/teams/pages/CaptainDashboard";
import ManageTeam from "../../modules/teams/pages/ManageTeam";
import SearchPlayers from "../../modules/teams/pages/SearchPlayers";
import UploadPayment from "../../modules/teams/pages/UploadPayment";
import ConfigureLineup from "../../modules/teams/pages/ConfigureLineup";
import OrganizerDashboard from "../../modules/tournaments/pages/OrganizerDashboard";
import CreateTournament from "../../modules/tournaments/pages/CreateTournament";
import ConfigureTournament from "../../modules/tournaments/pages/ConfigureTournament";
import ManageTeams from "../../modules/tournaments/pages/ManageTeams";
import ScheduleMatches from "../../modules/tournaments/pages/ScheduleMatches";
import RegisterResult from "../../modules/tournaments/pages/RegisterResult";
import MatchCalendar from "../../modules/tournaments/pages/MatchCalendar";
import Standings from "../../modules/tournaments/pages/Standings";
import Bracket from "../../modules/tournaments/pages/Bracket";
import RefereeDashboard from "../../modules/matches/pages/RefereeDashboard";
import RefereeMatchDetail from "../../modules/matches/pages/RefereeMatchDetail";
import AdminDashboard from "../../modules/admin/pages/AdminDashboard";
import ManageUsers from "../../modules/admin/pages/ManageUsers";
import AuditLog from "../../modules/admin/pages/AuditLog";
import TournamentStats from "../../shared/components/common/TournamentStats";
import TournamentInfo from "../../shared/components/common/TournamentInfo";
import PlayerPublicProfile from "../../shared/components/common/PlayerPublicProfile";
import NotFound from "../../modules/home/pages/NotFound";

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
      { path: "organizer/tournament/configure", Component: ConfigureTournament },
      { path: "organizer/teams", Component: ManageTeams },
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
      { path: "admin/users", Component: ManageUsers },
      { path: "admin/audit", Component: AuditLog },

      // Common routes
      { path: "stats", Component: TournamentStats },
      { path: "tournament-info", Component: TournamentInfo },
      { path: "players/:id", Component: PlayerPublicProfile },

      { path: "*", Component: NotFound },
    ],
  },
]);
