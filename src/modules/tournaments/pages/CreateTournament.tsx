import { AlertCircle, Calendar, Link, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { ZodIssue } from "zod";
import { useCreateTournament } from "../hooks/useCreateTournament";
import {
	type CreateTournamentFormData,
	createTournamentSchema,
} from "../types/tournamentSchemas";

type FieldName = keyof CreateTournamentFormData;

const FIELD_CONFIGS = [
	{
		section: "Información General",
		icon: Trophy,
		fields: [
			{
				id: "name" as const,
				label: "Nombre del Torneo",
				type: "text",
				placeholder: "TechCup Fútbol 2026-1",
				required: true,
				colSpan: "full",
			},
		],
	},
	{
		section: "Fechas",
		icon: Calendar,
		fields: [
			{
				id: "startDate" as const,
				label: "Fecha de Inicio",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
			{
				id: "endDate" as const,
				label: "Fecha de Finalización",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
			{
				id: "registrationCloseDate" as const,
				label: "Cierre de Inscripciones",
				type: "date",
				placeholder: "",
				required: true,
				colSpan: "half",
			},
		],
	},
	{
		section: "Configuración",
		icon: Users,
		fields: [
			{
				id: "maxTeams" as const,
				label: "Máximo de Equipos",
				type: "number",
				placeholder: "8",
				required: true,
				colSpan: "half",
				min: 2,
				max: 32,
			},
			{
				id: "cost" as const,
				label: "Costo por Equipo (COP)",
				type: "number",
				placeholder: "50000",
				required: true,
				colSpan: "half",
				min: 0,
			},
		],
	},
	{
		section: "Reglamento",
		icon: Link,
		fields: [
			{
				id: "regulationsUrl" as const,
				label: "URL del Reglamento",
				type: "url",
				placeholder: "https://drive.google.com/...",
				required: false,
				colSpan: "full",
			},
		],
	},
];

function zodErrorsToMap(
	issues: ZodIssue[],
): Partial<Record<FieldName, string>> {
	const map: Partial<Record<FieldName, string>> = {};
	for (const issue of issues) {
		const field = issue.path[0] as FieldName;
		if (field && !map[field]) {
			map[field] = issue.message;
		}
	}
	return map;
}

export default function CreateTournament() {
	const navigate = useNavigate();
	const createMutation = useCreateTournament();

	const [form, setForm] = useState<CreateTournamentFormData>({
		name: "",
		startDate: "",
		endDate: "",
		registrationCloseDate: "",
		maxTeams: 0,
		cost: 0,
		regulationsUrl: "",
	});
	const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

	const handleChange = (id: FieldName, value: string) => {
		const parsedValue: string | number =
			id === "maxTeams" || id === "cost"
				? value === ""
					? 0
					: Number(value)
				: value;
		setForm((prev) => ({ ...prev, [id]: parsedValue }));
		if (errors[id]) setErrors((prev) => ({ ...prev, [id]: "" }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const result = createTournamentSchema.safeParse(form);
		if (!result.success) {
			setErrors(zodErrorsToMap(result.error.issues));
			return;
		}

		setErrors({});

		createMutation.mutate(
			{
				...result.data,
				regulationsUrl:
					result.data.regulationsUrl && result.data.regulationsUrl.trim() !== ""
						? result.data.regulationsUrl
						: undefined,
			},
			{
				onSuccess: () => {
					toast.success("¡Torneo creado!");
					setTimeout(() => navigate("/organizer/dashboard"), 1200);
				},
				onError: (err: any) => {
					const message =
						err?.response?.data?.message ||
						err?.response?.data?.error ||
						err?.message ||
						"No fue posible crear el torneo.";
					toast.error(message);
				},
			},
		);
	};

	const inputClass = (id: string) =>
		`w-full rounded-lg border px-4 py-3 text-foreground focus:outline-none transition-all ${
			errors[id as FieldName]
				? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-1 focus:ring-destructive"
				: "border-border bg-muted focus:border-secondary focus:ring-1 focus:ring-secondary"
		}`;

	return (
		<div className="min-h-screen bg-background p-6 sm:p-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8 flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
						<Trophy className="h-6 w-6 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-foreground sm:text-3xl">
							Crear Nuevo Torneo
						</h1>
						<p className="text-sm text-muted-foreground">
							Completa la información para registrar el torneo en estado
							Borrador.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{FIELD_CONFIGS.map(({ section, icon: Icon, fields }) => (
						<div
							key={section}
							className="rounded-xl border border-border bg-card p-6 shadow-sm"
						>
							<div className="mb-5 flex items-center gap-2 border-b border-border pb-4">
								<Icon className="h-4 w-4 text-primary" />
								<h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
									{section}
								</h2>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								{fields.map((field) => (
									<div
										key={field.id}
										className={field.colSpan === "full" ? "sm:col-span-2" : ""}
									>
										<label
											htmlFor={field.id}
											className="mb-1.5 block text-sm font-medium text-foreground"
										>
											{field.label}
											{field.required && (
												<span className="ml-1 text-destructive">*</span>
											)}
										</label>
										<input
											id={field.id}
											type={field.type}
											required={field.required}
											placeholder={field.placeholder}
											min={(field as any).min}
											max={(field as any).max}
											value={String(form[field.id])}
											onChange={(e) => handleChange(field.id, e.target.value)}
											className={inputClass(field.id)}
										/>
										{errors[field.id] && (
											<p className="mt-1 text-xs text-destructive">
												{errors[field.id]}
											</p>
										)}
									</div>
								))}
							</div>
						</div>
					))}

					<div className="flex items-start gap-3 rounded-lg border border-secondary/30 bg-secondary/5 p-4 text-sm text-foreground">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
						<span>
							El torneo se creará en estado <strong>Borrador</strong>. Podrás
							activarlo desde el panel de control cuando esté listo.
						</span>
					</div>

					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-card/80"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={createMutation.isPending}
							className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg focus:ring-2 focus:ring-secondary focus:outline-none disabled:opacity-60"
						>
							{createMutation.isPending ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Creando...
								</>
							) : (
								<>
									<Trophy className="h-4 w-4" />
									Crear Torneo
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
