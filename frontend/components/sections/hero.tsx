"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { Github, CheckCircle, AlertCircle } from "lucide-react";
import { TechStackMarquee } from "@/components/sections/tech-stack";

interface HeroSectionProps {
    initialBackendMessage: string;
    initialEnv: string;
}

export function HeroSection({ initialBackendMessage, initialEnv }: HeroSectionProps) {
    const [backendMessage, setBackendMessage] = useState(initialBackendMessage);
    const [isError, setIsError] = useState(initialBackendMessage.includes("Failed") || initialBackendMessage.includes("Error"));

    // Optional: Client-side revalidation if needed
    // But relying on Server Component prop is cleaner for "Environment-aware" builds

    return (
        <section className="relative flex min-h-screen flex-col pt-24 pb-12 md:pt-32 md:pb-20 text-center overflow-hidden">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 mx-auto max-w-5xl px-4 flex-1 flex flex-col items-center justify-center"
            >
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-blue-400 backdrop-blur-md">
                    <Github className="h-3 w-3 md:h-4 md:w-4" />
                    <a href="https://github.com/HimanM/DevOps-Project-7" target="_blank" className="hover:underline">View on GitHub</a>
                </span>

                <h1 className="mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-3xl sm:text-5xl md:text-7xl font-black text-transparent tracking-tight drop-shadow-2xl leading-tight max-w-4xl">
                    Cloud Native <br className="hidden md:block" /> Infrastructure&nbsp;2.
                </h1>

                <p className="mb-8 md:mb-12 max-w-2xl text-base md:text-xl text-gray-400 leading-relaxed font-light">
                    A comprehensive demonstration of modern DevOps practices, featuring Kubernetes orchestration, Service Mesh traffic management, and GitOps automation.
                    Experience a complete pipeline with isolated <strong>Staging</strong> and <strong>Production</strong> environments, fully automated via <strong>GitHub Actions CI/CD</strong>.
                </p>

                {/* Status Dashboard */}
                <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2 mb-20">
                    <GlassCard className="flex flex-col items-center justify-center p-8 border-t-4 border-t-purple-500">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">Environment</h3>
                        <p className="text-4xl font-mono font-bold text-white">{initialEnv.toUpperCase()}</p>
                    </GlassCard>

                    <GlassCard className={`flex flex-col items-center justify-center p-8 border-t-4 transition-colors ${isError ? "border-t-red-500 bg-red-900/10" : "border-t-green-500"}`}>
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">Backend Status</h3>
                        {isError ? (
                            <div className="flex items-center gap-3 text-red-400">
                                <AlertCircle className="h-8 w-8" />
                                <span className="text-xl font-bold">Offline</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 text-green-400">
                                <CheckCircle className="h-8 w-8" />
                                <span className="text-xl font-bold">{backendMessage}</span>
                            </div>
                        )}
                        <p className="mt-2 text-xs text-gray-600 font-mono truncate max-w-[200px]">{initialBackendMessage}</p>
                    </GlassCard>
                </div>
            </motion.div>

            <TechStackMarquee />
        </section>
    );
}
