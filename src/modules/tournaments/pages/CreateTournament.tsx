import { queryClient } from "../../../core/api/queryClient";
import { createTournament } from "../services/createtor";

export default function CreateTournament() {
	const handleSubmit = queryClient.getMutationCache().build({
		mutationFn: async (formData: { name: string; description: string }) =>
			createTournament(formData),
		onSuccess: () => {
			queryClient.invalidateQueries(["tournaments"]);
		},
	});
	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex flex-1">
				<main className="flex-1 bg-background p-8">
					<div className="mx-auto max-w-7xl space-y-8">
						<h1 className="text-3xl font-bold">Crear Nuevo Torneo</h1>
						<form className="space-y-6 rounded-xl border border-border bg-card p-6">
							<div>
								<label
									htmlFor="tournament-name"
									className="block text-sm font-medium text-muted-foreground"
								>
									Nombre del Torneo
								</label>
								<input
									type="text"
									id="tournament-name"
									className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
									placeholder="TechCup Fútbol 2025-2"
								/>
							</div>

							<div>
								<label
									htmlFor="tournament-description"
									className="block text-sm font-medium text-muted-foreground"
								>
									Descripción
								</label>
								<textarea
									id="tournament-description"
									className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 focus:border-primary focus:ring focus:ring-primary/50"
									placeholder="Descripción breve del torneo, reglas, formato, etc."
									rows={4}
								/>
							</div>

							<div className="flex items-center justify-end gap-4">
								<button
									type="button"
									className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-card/80"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="rounded-md bg-primary px-4 py-2 text
                  sm font-medium text-white hover:bg-primary/90"
								>
									Crear Torneo
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}
