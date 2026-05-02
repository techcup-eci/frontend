interface BadgeProps {
  children: React.ReactNode;
  variant?: "pending" | "review" | "approved" | "rejected" | "active" | "draft" | "progress" | "finished" | "info" | "warning" | "success" | "error";
  size?: "sm" | "md" | "lg";
}

export default function Badge({ children, variant = "info", size = "md" }: BadgeProps) {
  const variantStyles = {
    pending: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20",
    review: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20",
    approved: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20",
    rejected: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    active: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20",
    draft: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20",
    progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    finished: "bg-[#0D0D0D]/10 text-[#0D0D0D] border-[#0D0D0D]/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    warning: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20",
    success: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20",
    error: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}
