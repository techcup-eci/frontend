export type AuthRole =
	| "participant"
	| "captain"
	| "organizer"
	| "referee"
	| "administrator"
	| "invited";

export interface AuthUser {
	id: number;
	email: string;
	role: AuthRole;
	token: string;
	type: string;
	expiresAt: number;
	name: string;
	firstName?: string;
	lastName?: string;
}

export function getFullName(user: AuthUser | null): string {
	if (!user) return "Usuario";
	const { firstName = "", lastName = "" } = user;
	const fullName = `${firstName} ${lastName}`.trim();
	return fullName || name || "Usuario";
}