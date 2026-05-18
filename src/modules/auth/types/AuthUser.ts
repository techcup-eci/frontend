export type AuthRole =
	| "participant"
	| "captain"
	| "organizer"
	| "referee"
	| "administrator"
	| "invited";

export interface AuthUser {
	email: string;
	role: AuthRole;
	token: string;
	type: string;
	expiresAt: number;
	firstName?: string;
	lastName?: string;
}

export function getFullName(user: AuthUser | null): string {
	if (!user) return "Usuario";
	const { firstName = "", lastName = "" } = user;
	const fullName = `${firstName} ${lastName}`.trim();
	return fullName || "Usuario";
}