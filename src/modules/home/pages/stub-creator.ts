// Script helper to create stub views
const stubViews = {
  player: ['EditProfile', 'ViewProfile', 'MarkAvailability', 'TeamDetail', 'ViewLineup', 'ViewRivalLineup'],
  captain: ['CreateTeam', 'ManageTeam', 'SearchPlayers', 'UploadPayment', 'ConfigureLineup'],
  organizer: ['CreateTournament', 'ConfigureTournament', 'ManageTeams', 'ScheduleMatches', 'RegisterResult', 'MatchCalendar', 'Standings', 'Bracket'],
  referee: ['RefereeDashboard', 'RefereeMatchDetail'],
  admin: ['AdminDashboard', 'ManageUsers', 'AuditLog'],
  common: ['TournamentStats', 'TournamentInfo', 'PlayerPublicProfile'],
  public: ['NotFound']
};

export default stubViews;
