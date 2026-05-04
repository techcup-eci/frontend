import { Routes, Route } from "react-router";
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
import RegisterResult from "../../modules/tournaments/pages/RegisterResult";
import ScheduleMatches from "../../modules/tournaments/pages/ScheduleMatches";
import Standings from "../../modules/tournaments/pages/Standings";
import PlayerPublicProfile from "../../shared/components/common/PlayerPublicProfile";
import TournamentInfo from "../../shared/components/common/TournamentInfo";
import TournamentStats from "../../shared/components/common/TournamentStats";
import RootLayout from "../../shared/layouts/RootLayout";
import AuthLayout from "../../shared/layouts/AuthLayout";
import DashboardLayout from "../../shared/layouts/DashboardLayout";
import BecomePlayer from "../../modules/players/pages/BecomePlayer.tsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with Navbar */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/stats" element={<TournamentStats />} />
        <Route path="/tournament-info" element={<TournamentInfo />} />
        <Route path="/players/:id" element={<PlayerPublicProfile />} />
      </Route>

      {/* Auth Routes without Navbar/Sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected/Dashboard Routes with Navbar & Sidebar */}
      <Route element={<DashboardLayout />}>
        {/* Player */}
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/player/dashboard" element={<PlayerDashboard />} />
        <Route path="/player/profile/create" element={<CreateProfile />} />
        <Route path="/player/profile/becomePlayer" element={<BecomePlayer />} />
        <Route path="/player/profile/edit" element={<EditProfile />} />
        <Route path="/player/profile" element={<ViewProfile />} />
        <Route path="/player/availability" element={<MarkAvailability />} />
        <Route path="/player/teams" element={<SearchTeams />} />
        <Route path="/player/teams/:id" element={<TeamDetail />} />
        <Route path="/player/lineup" element={<ViewLineup />} />
        <Route path="/player/lineup/rival/:id" element={<ViewRivalLineup />} />

        {/* Captain */}
        <Route path="/captain/create-team" element={<CreateTeam />} />
        <Route path="/captain/dashboard" element={<CaptainDashboard />} />
        <Route path="/captain/manage-team" element={<ManageTeam />} />
        <Route path="/captain/search-players" element={<SearchPlayers />} />
        <Route path="/captain/payment" element={<UploadPayment />} />
        <Route path="/captain/lineup" element={<ConfigureLineup />} />

        {/* Organizer */}
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/organizer/create-tournament" element={<CreateTournament />} />
        <Route path="/organizer/tournament/configure" element={<ConfigureTournament />} />
        <Route path="/organizer/teams" element={<ManageTeams />} />
        <Route path="/organizer/schedule" element={<ScheduleMatches />} />
        <Route path="/organizer/result/:id" element={<RegisterResult />} />
        <Route path="/organizer/calendar" element={<MatchCalendar />} />
        <Route path="/organizer/standings" element={<Standings />} />
        <Route path="/organizer/bracket" element={<Bracket />} />

        {/* Referee */}
        <Route path="/referee/dashboard" element={<RefereeDashboard />} />
        <Route path="/referee/match/:id" element={<RefereeMatchDetail />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/audit" element={<AuditLog />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
