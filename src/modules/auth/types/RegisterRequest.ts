export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	birthDate: string;
	schoolRelation: "STUDENT" | "PROFESSOR" | "GRADUATE";
	academicLevel?: "UNDERGRADUATE" | "POSTGRADUATE" | "MASTER" | null;
	professorType?: "FULL_TIME" | "CHAIR" | null;
	academicProgram?: string | null;
	semester?: number | null;
	identificationType: "CC" | "TI" | "PP" | "CE" | "OTRO";
	identificationNumber: number;
	phone: number;
}

