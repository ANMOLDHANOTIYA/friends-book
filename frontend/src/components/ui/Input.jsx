function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <input
        className={`
          w-full rounded-xl border border-white/10
          bg-white/5 px-4 py-3
          text-sm text-white
          placeholder:text-slate-500
          outline-none
          transition
          focus:border-indigo-500/60
          focus:ring-2 focus:ring-indigo-500/20
          ${error ? "border-red-500/60" : ""}
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;