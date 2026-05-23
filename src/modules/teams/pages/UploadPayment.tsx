import {
	CheckCircle,
	FileText,
	Image as ImageIcon,
	Info,
	Trash2,
	Upload,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import Badge from "../../../shared/components/shared/Badge";
import {
	useCancelRegistration,
	useCreateRegistration,
	useGetRegistrations,
} from "../../registrations/hooks/useRegistrations";

// Dummy IDs for the demo, replace with real ones from auth/context later
const DUMMY_TEAM_ID = "team-123";
const DUMMY_CAPTAIN_ID = "cap-456";
const DUMMY_TOURNAMENT_ID = "tour-789";

export default function UploadPayment() {
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [filePreview, setFilePreview] = useState<string>("");
	const [isDragging, setIsDragging] = useState(false);

	const { data: registrations, isLoading } = useGetRegistrations({
		teamId: DUMMY_TEAM_ID,
	});
	const { mutate: createRegistration, isPending: isCreating } =
		useCreateRegistration();
	const { mutate: cancelRegistration, isPending: isCanceling } =
		useCancelRegistration();

	// Find the active or latest registration for this team
	const currentRegistration = useMemo(() => {
		if (!registrations || registrations.length === 0) return null;
		return [...registrations].sort(
			(a, b) =>
				new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
		)[0];
	}, [registrations]);

	const handleFile = (file: File) => {
		setUploadedFile(file);
		if (file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFilePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setFilePreview("");
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) handleFile(file);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const clearFile = () => {
		setUploadedFile(null);
		setFilePreview("");
	};

	const handleSubmit = () => {
		if (!uploadedFile) return;

		// For demo purposes, we will generate a dummy URL or use the Data URL
		const dummyProofUrl =
			filePreview ||
			`https://dummy-bucket.s3.amazonaws.com/proofs/${uploadedFile.name}`;

		createRegistration({
			tournamentId: DUMMY_TOURNAMENT_ID,
			teamId: DUMMY_TEAM_ID,
			capitanId: DUMMY_CAPTAIN_ID,
			paymentProofURL: dummyProofUrl,
		});

		clearFile();
	};

	const handleCancel = () => {
		if (currentRegistration && currentRegistration.status === "UNDER_REVIEW") {
			if (
				window.confirm("¿Estás seguro de que deseas cancelar la inscripción?")
			) {
				cancelRegistration({
					id: currentRegistration.id,
					captainId: DUMMY_CAPTAIN_ID,
				});
			}
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "UNDER_REVIEW":
				return (
					<Badge variant="review" size="lg" className="animate-pulse">
						En revisión
					</Badge>
				);
			case "APPROVED":
				return (
					<Badge variant="finished" size="lg">
						Aprobado
					</Badge>
				);
			case "REJECTED":
				return (
					<Badge variant="rejected" size="lg">
						Rechazado
					</Badge>
				);
			case "CANCELLED":
				return (
					<Badge variant="rejected" size="lg">
						Cancelado
					</Badge>
				);
			default:
				return <Badge size="lg">{status}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
			{/* Decorative background blobs */}
			<div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[128px]"></div>
			<div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-secondary/10 blur-[128px]"></div>

			<div className="flex flex-1 relative z-10">
				<main className="flex-1 p-8">
					<div className="mx-auto max-w-4xl space-y-10">
						{/* Header Section */}
						<div className="text-center md:text-left">
							<h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground">
								Inscripción y Pago
							</h1>
							<p className="text-lg text-muted-foreground">
								Sube el comprobante de pago de tu equipo para oficializar la
								inscripción al torneo.
							</p>
						</div>

						{/* Current Registration Status */}
						{currentRegistration ? (
							<div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl">
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

								<div className="relative z-10">
									<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-6">
										<h2 className="text-2xl font-bold tracking-tight">
											Estado de tu inscripción
										</h2>
										{getStatusBadge(currentRegistration.status)}
									</div>

									<div className="grid gap-8 md:grid-cols-2">
										<div className="flex flex-col rounded-2xl bg-muted/30 p-5">
											<p className="mb-1 text-sm font-medium text-muted-foreground">
												Fecha de envío
											</p>
											<p className="text-lg font-semibold">
												{new Date(
													currentRegistration.submittedAt,
												).toLocaleDateString(undefined, {
													weekday: "long",
													year: "numeric",
													month: "long",
													day: "numeric",
												})}
											</p>
										</div>
										<div className="flex flex-col rounded-2xl bg-muted/30 p-5">
											<p className="mb-1 text-sm font-medium text-muted-foreground">
												Documento subido
											</p>
											<a
												href={currentRegistration.paymentProofURL}
												target="_blank"
												rel="noreferrer"
												className="group/link flex w-fit items-center gap-2 text-lg font-semibold text-primary transition-colors hover:text-primary/80"
											>
												<FileText className="h-5 w-5 transition-transform group-hover/link:-translate-y-1" />
												Ver comprobante adjunto
											</a>
										</div>
									</div>

									{currentRegistration.status === "UNDER_REVIEW" && (
										<div className="mt-8 flex justify-end pt-2">
											<button
												onClick={handleCancel}
												disabled={isCanceling}
												className="flex items-center gap-2 rounded-xl border-2 border-destructive/20 bg-destructive/5 px-6 py-3 font-semibold text-destructive transition-all hover:border-destructive/40 hover:bg-destructive/10 disabled:opacity-50"
											>
												<Trash2 className="h-5 w-5" />
												{isCanceling ? "Cancelando..." : "Cancelar inscripción"}
											</button>
										</div>
									)}

									{currentRegistration.status === "APPROVED" && (
										<div className="mt-8 rounded-2xl border-2 border-green-500/20 bg-gradient-to-r from-green-500/10 to-transparent p-6 shadow-sm">
											<div className="flex items-start gap-4">
												<div className="rounded-full bg-green-500/20 p-2 text-green-600 dark:text-green-400">
													<CheckCircle className="h-6 w-6" />
												</div>
												<div>
													<p className="text-lg font-bold text-green-800 dark:text-green-300">
														¡Inscripción aprobada exitosamente!
													</p>
													<p className="mt-1 text-green-700 dark:text-green-400">
														Tu equipo ya forma parte oficial del torneo.
														Prepárense para competir.
													</p>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="grid gap-8 md:grid-cols-2">
								{/* Instructions Card */}
								<div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl">
									<div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
									<div className="relative z-10">
										<h2 className="mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight">
											<Info className="h-6 w-6 text-secondary" />
											Instrucciones
										</h2>

										<div className="space-y-6">
											<div>
												<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
													Costo de Inscripción
												</p>
												<p className="mt-1 text-4xl font-extrabold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
													$80.000{" "}
													<span className="text-2xl font-semibold text-muted-foreground">
														COP
													</span>
												</p>
											</div>

											<div className="h-px w-full bg-border/50"></div>

											<div>
												<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
													Métodos aceptados
												</p>
												<p className="mt-1 text-lg font-semibold text-foreground">
													Transferencia Nequi o Efectivo
												</p>
											</div>

											<div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
												<p className="text-sm leading-relaxed text-foreground/80">
													Realiza la transferencia a{" "}
													<strong>Nequi 300-123-4567</strong> a nombre de{" "}
													<strong>Coordinación Deportiva ECI</strong>, o entrega
													el efectivo presencialmente en la coordinación. Una
													vez hecho, sube una foto o PDF del recibo.
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Upload Card */}
								{(!currentRegistration ||
									["REJECTED", "CANCELLED"].includes(
										currentRegistration.status,
									)) && (
									<div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/60 p-8 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl">
										<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
										<div className="relative z-10 flex h-full flex-col">
											<h2 className="mb-6 text-2xl font-bold tracking-tight">
												Cargar Comprobante
											</h2>

											{!uploadedFile ? (
												<div
													onDrop={handleDrop}
													onDragOver={handleDragOver}
													onDragLeave={handleDragLeave}
													className={`relative flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
														isDragging
															? "border-primary bg-primary/10 scale-[1.02]"
															: "border-border bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
													}`}
												>
													<input
														type="file"
														accept="image/*,.pdf"
														onChange={handleFileChange}
														className="hidden"
														id="file-upload"
													/>
													<label
														htmlFor="file-upload"
														className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-8 text-center"
													>
														<div
															className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 ${isDragging ? "scale-110 text-primary" : "text-muted-foreground"}`}
														>
															<Upload className="h-8 w-8" />
														</div>
														<p className="mb-2 text-lg font-semibold text-foreground">
															Arrastra tu archivo aquí
														</p>
														<p className="text-sm text-muted-foreground">
															o haz clic para explorar en tu dispositivo
														</p>
														<div className="mt-4 flex gap-2 text-xs font-medium text-muted-foreground/80">
															<span className="rounded-md bg-background px-2 py-1 shadow-sm">
																PDF
															</span>
															<span className="rounded-md bg-background px-2 py-1 shadow-sm">
																JPG
															</span>
															<span className="rounded-md bg-background px-2 py-1 shadow-sm">
																PNG
															</span>
															<span className="rounded-md bg-background px-2 py-1 shadow-sm">
																Max 10MB
															</span>
														</div>
													</label>
												</div>
											) : (
												<div className="flex flex-1 flex-col justify-between">
													<div className="space-y-4">
														{/* PDF Preview */}
														{!filePreview && (
															<div className="flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
																<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm text-red-500">
																	<FileText className="h-8 w-8" />
																</div>
																<div className="flex-1 min-w-0">
																	<p className="truncate text-sm font-bold text-foreground">
																		{uploadedFile.name}
																	</p>
																	<p className="text-xs font-medium text-muted-foreground">
																		{(uploadedFile.size / 1024 / 1024).toFixed(
																			2,
																		)}{" "}
																		MB • Documento PDF
																	</p>
																</div>
																<button
																	onClick={clearFile}
																	className="shrink-0 rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
																	title="Remover archivo"
																>
																	<XCircle className="h-6 w-6" />
																</button>
															</div>
														)}

														{/* Image Preview */}
														{filePreview && (
															<div className="relative group/preview overflow-hidden rounded-2xl border border-border shadow-sm">
																<div className="absolute top-2 right-2 z-10 flex gap-2">
																	<span className="rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
																		{(uploadedFile.size / 1024 / 1024).toFixed(
																			2,
																		)}{" "}
																		MB
																	</span>
																</div>
																<img
																	src={filePreview}
																	alt="Preview"
																	className="h-48 w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
																/>
																<div className="absolute inset-0 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover/preview:opacity-100 flex items-center justify-center">
																	<button
																		onClick={clearFile}
																		className="flex items-center gap-2 rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
																	>
																		<Trash2 className="h-4 w-4" /> Eliminar
																		imagen
																	</button>
																</div>
																<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
																	<p className="truncate text-sm font-semibold text-white flex items-center gap-2">
																		<ImageIcon className="h-4 w-4" />{" "}
																		{uploadedFile.name}
																	</p>
																</div>
															</div>
														)}
													</div>

													<div className="mt-6 pt-6 border-t border-border/50">
														<button
															onClick={handleSubmit}
															disabled={isCreating}
															className="group/btn relative w-full overflow-hidden rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
														>
															<div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0"></div>
															<span className="relative flex items-center justify-center gap-2">
																{isCreating ? (
																	<>
																		<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
																		Enviando comprobante...
																	</>
																) : (
																	<>
																		<CheckCircle className="h-5 w-5" />
																		Confirmar y Enviar Inscripción
																	</>
																)}
															</span>
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
						)}

						{/* History Section (Optional) */}
						{registrations && registrations.length > 1 && (
							<div className="mt-12 rounded-3xl border border-border/50 bg-card/40 p-8 backdrop-blur-xl">
								<h2 className="mb-6 text-xl font-bold tracking-tight">
									Historial de intentos de inscripción
								</h2>
								<div className="grid gap-4 sm:grid-cols-2">
									{registrations.slice(1).map((payment) => (
										<div
											key={payment.id}
											className="flex items-start gap-4 rounded-2xl border border-border/50 bg-background/50 p-5 transition-colors hover:bg-muted/30"
										>
											<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
												<FileText className="h-5 w-5" />
											</div>
											<div className="flex-1 min-w-0">
												<div className="mb-1 flex flex-wrap items-center justify-between gap-2">
													<p className="font-bold text-foreground">
														Solicitud de Inscripción
													</p>
													{getStatusBadge(payment.status)}
												</div>
												<p className="text-sm font-medium text-muted-foreground">
													{new Date(payment.submittedAt).toLocaleDateString(
														undefined,
														{
															year: "numeric",
															month: "short",
															day: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
