import { LoginForm } from "../components/LoginForm";

const roleCards = [
	{
		title: "Capitanes",
		description:
			"Administra tu plantilla, convoca jugadores y mantén al día la información del equipo.",
	},
	{
		title: "Organizadores",
		description:
			"Publica cruces, controla estados del torneo y supervisa el calendario completo.",
	},
	{
		title: "Árbitros",
		description:
			"Consulta encuentros asignados y reporta resultados con trazabilidad.",
	},
];

export function LoginPage() {
	return (
		<main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_30px_100px_rgba(15,23,42,0.18)] backdrop-blur sm:grid-cols-[1.1fr_0.9fr]">
				<section className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#7f1d1d_0%,#991b1b_30%,#0f172a_100%)] p-8 text-white sm:p-10 lg:p-12">
					<div className="absolute inset-0 opacity-40">
						<div className="absolute left-[-10%] top-[-8%] h-40 w-40 rounded-full bg-sky-300 blur-3xl" />
						<div className="absolute bottom-[12%] right-[-5%] h-48 w-48 rounded-full bg-orange-200 blur-3xl" />
					</div>

					<div className="relative space-y-6">
						<div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium tracking-[0.18em] uppercase">
							<span className="h-2 w-2 rounded-full bg-sky-300" />
							TechUp Cup
						</div>

						<div className="space-y-4">
							<p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
								Plataforma oficial
							</p>
							<h1 className="max-w-xl text-4xl font-bold leading-tight text-balance sm:text-5xl">
								Controla el torneo desde un acceso centralizado y claro.
							</h1>
							<p className="max-w-lg text-base leading-7 text-slate-200 sm:text-lg">
								Inicia sesión para administrar tu experiencia dentro de TechUp
								Cup según tu rol en la competencia.
							</p>
						</div>
					</div>

					<div className="relative grid gap-4 md:grid-cols-3 md:gap-3">
						{roleCards.map((roleCard) => (
							<article
								key={roleCard.title}
								className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lg shadow-black/10 backdrop-blur-sm"
							>
								<h2 className="text-lg font-semibold">{roleCard.title}</h2>
								<p className="mt-2 text-sm leading-6 text-slate-200">
									{roleCard.description}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="flex items-center justify-center bg-white/70 p-6 sm:p-8 lg:p-10">
					<div className="w-full max-w-md">
						<LoginForm />
					</div>
				</section>
			</div>
		</main>
	);
}
