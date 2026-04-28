import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import type { LoginRequest } from "../types/LoginRequest";
import { loginRequestSchema } from "../types/authSchemas";

type LoginFormErrors = Partial<Record<"email" | "password", string>>;

const initialValues: LoginRequest = {
	email: "",
	password: "",
	rememberMe: true,
};

function validateLogin(values: LoginRequest): LoginFormErrors {
	const parsedResult = loginRequestSchema.safeParse(values);

	if (parsedResult.success) {
		return {};
	}

	const fieldErrors = parsedResult.error.flatten().fieldErrors;
	return {
		email: fieldErrors.email?.[0],
		password: fieldErrors.password?.[0],
	};
}

export function LoginForm() {
	const [values, setValues] = useState<LoginRequest>(initialValues);
	const [errors, setErrors] = useState<LoginFormErrors>({});
	const { errorMessage, isPending, isSuccess, loggedUserName, login, resetState } = useLogin();

	function handleFieldChange(field: keyof LoginRequest, value: string | boolean) {
		setValues((currentValues) => ({
			...currentValues,
			[field]: value,
		}));

		if (field !== "rememberMe") {
			setErrors((currentErrors) => {
				if (!currentErrors[field]) {
					return currentErrors;
				}

				const nextErrors = { ...currentErrors };
				delete nextErrors[field];
				return nextErrors;
			});
		}

		if (errorMessage || isSuccess) {
			resetState();
		}
	}

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		const validationErrors = validateLogin(values);

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setErrors({});
		const parsedCredentials = loginRequestSchema.parse(values);
		await login(parsedCredentials);
	}

	return (
		<div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
			<div className="space-y-3">
				<p className="text-sm font-semibold uppercase tracking-[0.28em] text-rose-700">Acceso seguro</p>
				<h2 className="text-3xl font-bold text-slate-950">Iniciar sesión</h2>
				<p className="text-sm leading-6 text-slate-600">
					Usa tus credenciales para entrar al panel correspondiente dentro del torneo.
				</p>
			</div>

			<form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700" htmlFor="email">
						Correo electrónico
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						placeholder="nombre@escuelaing.edu.co"
						value={values.email}
						onChange={(event) => handleFieldChange("email", event.target.value)}
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
					/>
					{errors.email ? <p className="text-sm text-rose-700">{errors.email}</p> : null}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700" htmlFor="password">
						Contraseña
					</label>
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						placeholder="********"
						value={values.password}
						onChange={(event) => handleFieldChange("password", event.target.value)}
						className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
					/>
					{errors.password ? <p className="text-sm text-rose-700">{errors.password}</p> : null}
				</div>

				<div className="flex items-center justify-between gap-3 text-sm text-slate-600">
					<label className="inline-flex items-center gap-3">
						<input
							type="checkbox"
							checked={Boolean(values.rememberMe)}
							onChange={(event) => handleFieldChange("rememberMe", event.target.checked)}
							className="h-4 w-4 rounded border-slate-300 text-rose-700 focus:ring-rose-200"
						/>
						<span>Recordar sesión</span>
					</label>
					<button type="button" className="font-medium text-sky-700 transition hover:text-sky-900">
						Recuperar acceso
					</button>
				</div>

				{errorMessage ? (
					<div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
						{errorMessage}
					</div>
				) : null}

				{isSuccess ? (
					<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
						Sesión iniciada correctamente{loggedUserName ? ` para ${loggedUserName}` : ""}.
					</div>
				) : null}

				<button
					type="submit"
					disabled={isPending}
					className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
				>
					{isPending ? "Validando credenciales..." : "Entrar a TechUp Cup"}
				</button>
			</form>

			<div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
				Registro y recuperación de contraseña quedarán conectados en el siguiente paso del feature auth.
			</div>
		</div>
	);
}