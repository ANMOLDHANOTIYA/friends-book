function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-[0.98]",

    secondary:
      "bg-white/5 text-slate-200 ring-1 ring-white/10 hover:bg-white/10",

    danger:
      "bg-red-500/10 text-red-400 ring-1 ring-red-500/20 hover:bg-red-500/20",

    ghost:
      "text-slate-400 hover:bg-white/5 hover:text-white",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;