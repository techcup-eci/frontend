import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createAthleticProfile,
	deleteAthleticProfile,
	getAthleticProfileByEmail,
	getAthleticProfiles,
	updateAthleticProfile,
} from "../services/athleticProfileService";
import type { AthleticProfileDto } from "../types/athleticProfile";

export const athleticProfilesQueryKey = ["athletic-profiles"] as const;
export const athleticProfileQueryKey = (email: string) =>
	["athletic-profile", email] as const;

type UpdateAthleticProfileInput = {
	userId: number;
	payload: AthleticProfileDto;
};

export function useUpdateAthleticProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, payload }: UpdateAthleticProfileInput) =>
			updateAthleticProfile(userId, payload),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			if (variables.payload.email) {
				queryClient.invalidateQueries({
					queryKey: athleticProfileQueryKey(variables.payload.email),
				});
			}
		},
	});
}

export function useAthleticProfile(email?: string) {
	return useQuery({
		queryKey: athleticProfileQueryKey(email ?? ""),
		queryFn: () => getAthleticProfileByEmail(email as string),
		enabled: Boolean(email),
	});
}

export function useCreateAthleticProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: AthleticProfileDto) => createAthleticProfile(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			if (data?.email) {
				queryClient.invalidateQueries({
					queryKey: athleticProfileQueryKey(data.email),
				});
			}
		},
	});
}

/* export function useUpdateAthleticProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, payload }: UpdateAthleticProfileInput) =>
      updateAthleticProfile(email, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
      queryClient.invalidateQueries({
        queryKey: athleticProfileQueryKey(variables.email),
      });
    },
  });
} */

export function useDeleteAthleticProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (email: string) => deleteAthleticProfile(email),
		onSuccess: (_, email) => {
			queryClient.invalidateQueries({ queryKey: athleticProfilesQueryKey });
			queryClient.invalidateQueries({
				queryKey: athleticProfileQueryKey(email),
			});
		},
	});
}
