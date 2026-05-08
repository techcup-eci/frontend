export type RegistrationStatus = 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface RegistrationRequest {
  tournamentId: string;
  teamId: string;
  capitanId: string;
  paymentProofURL: string;
}

export interface ReviewRegistrationRequest {
  status: 'APPROVED' | 'REJECTED';
}

export interface RegistrationResponse {
  id: string;
  submittedAt: string;
  reviewedAt: string | null;
  paymentProofURL: string;
  status: RegistrationStatus;
  tournamentId: string;
  reviewedBy: string | null;
  teamId: string;
  capitanId: string;
}
