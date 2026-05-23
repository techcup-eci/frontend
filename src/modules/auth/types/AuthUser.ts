export type AuthRole =
	| "player"
	| "captain"
	| "organizer"
	| "referee"
	| "admin"
	| "invited";

export interface AuthUser {
	id: number;
	email: string;
	role: AuthRole;
	name: string;
}
