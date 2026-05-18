import { SelectHTMLAttributes, ReactNode } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label: string;
	error?: string;
	success?: boolean;
	helperText?: string;
	children: ReactNode;
}

export function FormSelect({ label, error, success, helperText, id, children, ...props }: FormSelectProps) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="text-sm font-medium text-slate-700">
				{label}
			</label>
			<div className="relative">
				<select
					id={id}
					className={`w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:bg-white appearance-none
						${error 
							? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-rose-100" 
							: success 
								? "border-emerald-300 bg-emerald-50 focus:border-emerald-400 focus:ring-emerald-100"
								: "border-slate-200 bg-slate-50 focus:border-sky-400 focus:ring-sky-100"
						}`}
					{...props}
				>
					{children}
				</select>
				{error && (
					<div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
						<XCircle className="h-5 w-5 text-rose-500" />
					</div>
				)}
				{success && !error && (
					<div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
						<CheckCircle2 className="h-5 w-5 text-emerald-500" />
					</div>
				)}
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
					<svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
					</svg>
				</div>
			</div>
			{error ? (
				<p className="text-sm text-rose-600">{error}</p>
			) : helperText ? (
				<p className="text-sm text-slate-500">{helperText}</p>
			) : null}
		</div>
	);
}
