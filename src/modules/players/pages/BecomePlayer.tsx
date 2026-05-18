import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, User } from "lucide-react";
import { useAuthStore } from "../../auth/hooks/useAuthStore";
import { useCreateAthleticProfile } from "../hooks/useAthleticProfile";
import { validateAthleticProfile } from "../hooks/useValidateAthleticProfile";
import { athleticProfileSchema, type AthleticProfileFormData } from "../types/athleticProfileSchemas";

type AthleticProfileErrors = Partial<
	Record<"position" | "dorsalNumber" | "laterality" | "stature" | "state", string>
>;

const initialValues: AthleticProfileFormData = {
	email: "",
	position: "Mediocampista Central",
	dorsalNumber: 8,
	laterality: "RIGHT",
	stature: 1.7,
	state: "ACTIVE",
};

export default function BecomePlayer() {
	const navigate = useNavigate();
	const authUser = useAuthStore((state) => state.user);
	const createProfile = useCreateAthleticProfile();

	const [values, setValues] = useState<AthleticProfileFormData>(() => ({
		...initialValues,
		email: authUser?.email ?? "",
	}));
	const [errors, setErrors] = useState<AthleticProfileErrors>({});
	const [photoPreview, setPhotoPreview] = useState<string>("");
	const [submitError, setSubmitError] = useState("");

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	function handleFieldChange(field: keyof AthleticProfileFormData, value: string | number) {
		setValues((currentValues) => ({
			...currentValues,
			[field]: value,
		}));

		// Limpiar error del campo cuando el usuario comienza a escribir
		setErrors((currentErrors) => {
			if (!currentErrors[field]) {
				return currentErrors;
			}
			const nextErrors = { ...currentErrors };
			delete nextErrors[field];
			return nextErrors;
		});

		if (submitError) {
			setSubmitError("");
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const validationErrors = validateAthleticProfile(values);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});

		const userEmail = values.email ?? sessionStorage.getItem("playerEmail") ?? "";
		if (!userEmail) {
			setSubmitError("No se pudo identificar el correo del usuario. Inicia sesión nuevamente.");
			return;
		}

		setSubmitError("");
		const storageKey = (base: string) => (userEmail ? `${base}:${userEmail}` : base);

		try {
			const parsedData = athleticProfileSchema.parse(values);
			await createProfile.mutateAsync({
				email: userEmail,
				dorsalNumber: parsedData.dorsalNumber,
				position: parsedData.position,
				laterality: parsedData.laterality ?? "RIGHT",
				stature: parsedData.stature?.toString() ?? "1.70",
				state: parsedData.state ?? "ACTIVE",
			});

			sessionStorage.setItem(
				storageKey("playerProfileForm"),
				JSON.stringify({
					position: values.position,
					dorsalNumber: values.dorsalNumber,
					laterality: values.laterality,
					stature: values.stature,
					state: values.state,
				})
			);
			if (photoPreview) {
				sessionStorage.setItem(storageKey("playerProfilePhoto"), photoPreview);
			}
			sessionStorage.setItem(storageKey("isPlayer"), "true");
			sessionStorage.setItem("playerEmail", userEmail);

			navigate("/player/profile");
		} catch (error) {
			const message = error instanceof Error ? error.message : "No fue posible guardar el perfil.";
			setSubmitError(message);
		}
	}

    return (
        <div className="flex min-h-screen flex-col">

            <div className="flex flex-1">

                <main className="flex-1 bg-background p-8">
                    <div className="mx-auto max-w-3xl space-y-8">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">Volverme jugador</h1>
                            <p className="text-muted-foreground">
                              Completa tu informacion deportiva para participar en el torneo.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8">
                            <div className="space-y-6">
                            <div>
                              <label className="mb-3 block font-medium">Foto de perfil</label>
                              <div className="flex items-center gap-6">
                                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-background">
                                  {photoPreview ? (
                                    <img
                                      src={photoPreview}
                                      alt="Preview"
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-16 w-16 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-medium transition hover:bg-accent">
                                    <Upload className="h-5 w-5" />
                                    <span>Subir foto</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handlePhotoChange}
                                      className="hidden"
                                    />
                                  </label>
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    JPG, PNG. Máximo 5MB
                                  </p>
                                </div>
                              </div>
                            </div>
				<div>
					<label className="mb-2 block font-medium">Posición</label>
					<select
						required
						value={values.position}
						onChange={(e) => handleFieldChange("position", e.target.value)}
						className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
							errors.position
								? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
								: "border-border bg-input-background focus:border-primary"
						}`}
					>
						<option value="">Selecciona tu posición</option>
						<option value="Portero">Portero</option>
						<option value="Defensa Central">Defensa Central</option>
						<option value="Lateral Derecho">Lateral Derecho</option>
						<option value="Lateral Izquierdo">Lateral Izquierdo</option>
						<option value="Mediocampista Defensivo">Mediocampista Defensivo</option>
						<option value="Mediocampista Central">Mediocampista Central</option>
						<option value="Extremo Derecho">Extremo Derecho</option>
						<option value="Extremo Izquierdo">Extremo Izquierdo</option>
						<option value="Delantero Centro">Delantero Centro</option>
					</select>
					{errors.position ? (
						<p className="mt-1 text-sm text-[#EF4444]">{errors.position}</p>
					) : null}
				</div>

				<div>
					<label className="mb-2 block font-medium">Dorsal preferido (0-99)</label>
					<input
						type="number"
						required
						min="0"
						max="99"
						step="1"
						value={values.dorsalNumber}
						onChange={(e) => handleFieldChange("dorsalNumber", Number(e.target.value))}
						className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
							errors.dorsalNumber
								? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
								: "border-border bg-input-background focus:border-primary"
						}`}
						placeholder="8"
					/>
					{errors.dorsalNumber ? (
						<p className="mt-1 text-sm text-[#EF4444]">{errors.dorsalNumber}</p>
					) : (
						<p className="mt-1 text-sm text-muted-foreground">El dorsal debe ser un número entre 0 y 99</p>
					)}
				</div>

				<div>
					<label className="mb-2 block font-medium">Lateralidad</label>
					<select
						required
						value={values.laterality}
						onChange={(e) => handleFieldChange("laterality", e.target.value)}
						className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
							errors.laterality
								? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
								: "border-border bg-input-background focus:border-primary"
						}`}
					>
						<option value="">Selecciona tu lateralidad</option>
						<option value="RIGHT">Derecha</option>
						<option value="LEFT">Izquierda</option>
						<option value="BOTH">Ambidiestra</option>
					</select>
					{errors.laterality ? (
						<p className="mt-1 text-sm text-[#EF4444]">{errors.laterality}</p>
					) : null}
				</div>

				<div>
					<label className="mb-2 block font-medium">Estatura (m)</label>
					<input
						type="number"
						required
						min="1.0"
						max="3.0"
						step="0.01"
						value={values.stature}
						onChange={(e) => handleFieldChange("stature", Number(e.target.value))}
						className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
							errors.stature
								? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
								: "border-border bg-input-background focus:border-primary"
						}`}
						placeholder="1.70"
					/>
					{errors.stature ? (
						<p className="mt-1 text-sm text-[#EF4444]">{errors.stature}</p>
					) : (
						<p className="mt-1 text-sm text-muted-foreground">Entre 1.00 m (100 cm) y 3.00 m (300 cm)</p>
					)}
				</div>

				<div>
					<label className="mb-2 block font-medium">Estado</label>
					<select
						required
						value={values.state}
						onChange={(e) => handleFieldChange("state", e.target.value)}
						className={`w-full rounded-lg border px-4 py-3 focus:outline-none ${
							errors.state
								? "border-[#EF4444] bg-[#EF4444]/5 focus:border-[#EF4444]"
								: "border-border bg-input-background focus:border-primary"
						}`}
					>
						<option value="">Selecciona tu estado</option>
						<option value="ACTIVE">Activo</option>
						<option value="INACTIVE">Inactivo</option>
					</select>
					{errors.state ? (
						<p className="mt-1 text-sm text-[#EF4444]">{errors.state}</p>
					) : null}
				</div>

				{submitError && (
					<div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-700">
						{submitError}
					</div>
				)}

				<div className="flex gap-4 pt-4">
					<button
						type="submit"
						disabled={createProfile.isPending}
						className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
					>
						{createProfile.isPending ? "Guardando..." : "Volverme jugador"}
					</button>
					<button
						type="button"
						onClick={() => navigate("/player/dashboard")}
						className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-semibold transition hover:bg-accent"
					>
						Cancelar
					</button>
				</div>
			</div>
		</form>
	</div>
</main>
</div>
</div>
);
}


