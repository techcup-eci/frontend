import { useQuery } from "@tanstack/react-query";
import { getFields } from "../../competitions/services/competitionService";
import type { FieldResponse } from "../../competitions/services/competitionService";

export const fieldsQueryKey = (tournamentId: string) =>
  ["fields", tournamentId] as const;

export function useFields(tournamentId: string) {
  return useQuery<FieldResponse[]>({
    queryKey: fieldsQueryKey(tournamentId),
    queryFn: () => getFields(tournamentId),
    enabled: !!tournamentId,
  });
}
