import { apiClient } from "../../../core/api/apiClient";

export const createTournament = () => {
	return apiClient.post("/tournaments", {
		name: "Summer Showdown",
		description: "An exciting summer tournament for all skill levels.",
	});
};
