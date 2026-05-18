import { InputHTMLAttributes } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	success?: boolean;
	helperText?: string;
}

export function FormInput({ label, error, success, helperText, id, ...props }: FormInputProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="text-sm font-medium text-slate-700">
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition pr-10 focus:ring-4 focus:bg-white
						${error 
							? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-100" 
							: success 
								? "border-emerald-300 bg-emerald-50 focus:border-emerald-400 focus:ring-emerald-100"
								: "border-slate-200 bg-slate-50 focus:border-sky-400 focus:ring-sky-100"
						}`}
					{...props}
				/>
				{error && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<XCircle className="h-5 w-5 text-rose-500" />
					</div>
				)}
				{success && !error && (
					<div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
						<CheckCircle2 className="h-5 w-5 text-emerald-500" />
					</div>
				)}
			</div>
			{error ? (
				<p className="text-sm text-rose-600">{error}</p>
			) : helperText ? (
				<p className="text-sm text-slate-500">{helperText}</p>
			) : null}
		</div>
	);
}
