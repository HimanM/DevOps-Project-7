import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300",
                hoverEffect && "hover:border-blue-500/30 hover:bg-white/10 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
                className
            )}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
