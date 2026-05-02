import { useState } from "react";
import Navbar from "../../../shared/components/shared/Navbar";
import Sidebar from "../../../shared/components/shared/Sidebar";
import { Home, Users, UserPlus, CreditCard, LayoutList, Trophy, BarChart3, Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import Badge from "../../../shared/components/shared/Badge";

const captainSidebar = [
  {
    items: [
      { label: "Inicio", path: "/captain/dashboard", icon: Home },
      { label: "Mi Equipo", path: "/captain/manage", icon: Users },
      { label: "Buscar Jugadores", path: "/captain/search-players", icon: UserPlus },
      { label: "Pagos", path: "/captain/payment", icon: CreditCard },
      { label: "Alineación", path: "/captain/lineup", icon: LayoutList },
      { label: "Torneo", path: "/tournament-info", icon: Trophy },
      { label: "Estadísticas", path: "/stats", icon: BarChart3 },
    ],
  },
];

export default function UploadPayment() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const paymentHistory = [
    {
      id: 1,
      date: "08/04/2025",
      amount: "$80.000 COP",
      status: "review" as const,
      file: "comprobante_080425.jpg",
    },
    {
      id: 2,
      date: "25/03/2025",
      amount: "$80.000 COP",
      status: "rejected" as const,
      file: "comprobante_250325.pdf",
      reason: "El comprobante está incompleto. Falta el número de transacción.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      
      <div className="flex flex-1">
        
        <main className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Gestión de pagos</h1>
              <p className="text-muted-foreground">Sube el comprobante de pago de tu equipo</p>
            </div>

            {/* Estado actual */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Estado del pago</h2>
                <Badge variant="review" size="lg">
                  En revisión
                </Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Costo total</p>
                  <p className="text-3xl font-bold">$80.000 COP</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Método de pago</p>
                  <p className="text-lg font-semibold">Nequi o efectivo</p>
                </div>
              </div>
              <div className="mt-6 rounded-lg border border-border bg-accent/5 p-4">
                <p className="text-sm">
                  <strong>Instrucciones de pago:</strong> Realiza la transferencia a Nequi 300-123-4567 a nombre
                  de Coordinación Deportiva ECI, o entrega el efectivo en la coordinación. Luego sube el
                  comprobante aquí.
                </p>
              </div>
            </div>

            {/* Subir comprobante */}
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-6 text-xl font-bold">Subir nuevo comprobante</h2>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-border bg-accent/5 p-12 text-center transition hover:border-primary hover:bg-accent/10"
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-semibold">
                    {uploadedFile ? uploadedFile.name : "Arrastra tu comprobante aquí"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    O haz clic para seleccionar · Máximo 10MB · JPG, PNG o PDF
                  </p>
                </label>
              </div>

              {filePreview && (
                <div className="mb-6 rounded-lg border border-border p-4">
                  <p className="mb-3 text-sm font-semibold">Vista previa:</p>
                  <img src={filePreview} alt="Preview" className="max-h-96 rounded-lg" />
                </div>
              )}

              {uploadedFile && (
                <button className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90">
                  Enviar comprobante
                </button>
              )}
            </div>

            {/* Historial */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-bold">Historial de comprobantes</h2>
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-start gap-4 rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-bold">{payment.file}</p>
                        <Badge variant={payment.status}>
                          {payment.status === "review"
                            ? "En revisión"
                            : payment.status === "rejected"
                            ? "Rechazado"
                            : "Aprobado"}
                        </Badge>
                      </div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        {payment.date} · {payment.amount}
                      </p>
                      {payment.reason && (
                        <div className="mt-3 rounded-lg bg-destructive/10 p-3">
                          <div className="flex items-start gap-2">
                            <XCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                            <div>
                              <p className="text-sm font-semibold text-destructive">Motivo del rechazo:</p>
                              <p className="text-sm text-destructive">{payment.reason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
