import { useId } from "react";
import { AlertCircle } from "lucide-react";

export default function AuthFormField({
    label,
    icon,
    type = "text",
    value,
    onChange,
    placeholder,
    error,
    right,
    extraLabel,
    isDark,
    id,
    name,
    autoComplete,
    inputMode,
    required = true,
}) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label htmlFor={inputId} className={`text-xs font-semibold ${isDark ? "text-zinc-300" : "text-zinc-700"}`}>
                    {label}
                </label>
                {extraLabel}
            </div>
            <div className={`group flex min-h-12 items-center gap-3 rounded-xl border px-3.5 transition-[border-color,box-shadow,background-color] focus-within:ring-4 ${
                error
                    ? isDark
                        ? "border-red-500/60 bg-red-500/[0.05] focus-within:ring-red-500/10"
                        : "border-red-300 bg-red-50/40 focus-within:ring-red-500/10"
                    : isDark
                        ? "border-white/10 bg-white/[0.035] hover:border-white/15 focus-within:border-red-500/60 focus-within:ring-red-500/10"
                        : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 focus-within:border-red-400 focus-within:ring-red-500/10"
            }`}>
                <span className={`shrink-0 transition-colors group-focus-within:text-red-500 ${isDark ? "text-zinc-500" : "text-zinc-400"}`}>{icon}</span>
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    className={`h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none ${isDark
                        ? "text-zinc-100 placeholder:text-zinc-600"
                        : "text-zinc-950 placeholder:text-zinc-400"
                    }`}
                />
                {right}
            </div>
            {error && (
                <div id={errorId} role="alert" className="flex items-center gap-1.5 px-0.5">
                    <AlertCircle className={`size-3.5 shrink-0 ${isDark ? "text-red-400" : "text-red-600"}`} aria-hidden="true" />
                    <p className={`text-[11px] ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
                </div>
            )}
        </div>
    );
}
