import { athleticProfileSchema, type AthleticProfileFormData } from "../types/athleticProfileSchemas";

type AthleticProfileErrors = Partial<
	Record<"position" | "dorsalNumber" | "laterality" | "stature" | "state" | "email", string>
>;

export function validateAthleticProfile(values: AthleticProfileFormData): AthleticProfileErrors {
	const parsedResult = athleticProfileSchema.safeParse(values);

	if (parsedResult.success) {
		return {};
	}

	const fieldErrors = parsedResult.error.flatten().fieldErrors;
	return {
		email: fieldErrors.email?.[0],
		position: fieldErrors.position?.[0],
		dorsalNumber: fieldErrors.dorsalNumber?.[0],
		laterality: fieldErrors.laterality?.[0],
		stature: fieldErrors.stature?.[0],
		state: fieldErrors.state?.[0],
	};
}
