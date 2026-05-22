export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	birthDate: string;
	schoolRelation: "STUDENT" | "PROFESSOR" | "GRADUATE";
	academicLevel?: "UNDERGRADUATE" | "POSTGRADUATE" | "MASTER";
	professorType?: "FULL_TIME" | "CHAIR";
	academicProgram?: string;
	semester?: number;
	identificationType: "CC" | "TI" | "PP" | "CE" | "OTRO";
	identificationNumber: number;
	phone: number;
}

