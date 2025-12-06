"use client";

import {
    FaAws, FaDocker, FaGithub, FaNodeJs, FaReact, FaLinux, FaProjectDiagram
} from "react-icons/fa";
import {
    SiKubernetes, SiTerraform, SiArgo, SiIstio, SiNextdotjs,
    SiPrometheus, SiGnubash, SiTypescript, SiAmazon, SiGithubactions
} from "react-icons/si";
import { cn } from "@/lib/utils";

const techs = [
    { name: "AWS", icon: SiAmazon, color: "text-orange-500" },
    { name: "Amazon EKS", icon: FaAws, color: "text-orange-400" },
    { name: "Terraform", icon: SiTerraform, color: "text-purple-400" },
    { name: "Kubernetes", icon: SiKubernetes, color: "text-blue-500" },
    { name: "ArgoCD", icon: SiArgo, color: "text-orange-400" },
    { name: "Docker", icon: FaDocker, color: "text-blue-400" },
    { name: "Istio", icon: SiIstio, color: "text-blue-300" },
    { name: "Kiali", icon: FaProjectDiagram, color: "text-green-400" },
    { name: "GitHub", icon: FaGithub, color: "text-white" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "text-blue-400" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-white" },
    { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
    { name: "Prometheus", icon: SiPrometheus, color: "text-orange-600" },
    { name: "Bash", icon: SiGnubash, color: "text-gray-400" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
];

export function TechStackMarquee() {
    return (
        <div className="w-full overflow-hidden border-y border-white/5 bg-black/20 py-6 backdrop-blur-sm">
            <div className="relative flex w-full overflow-hidden">
                {/* First Loop */}
                <div className="animate-marquee flex shrink-0 items-center gap-24 px-12">
                    {techs.map((tech, idx) => (
                        <div key={idx} className="flex min-w-[max-content] flex-col items-center gap-3">
                            <tech.icon className={cn("h-10 w-10", tech.color)} />
                            <span className="text-sm font-medium text-gray-400">{tech.name}</span>
                        </div>
                    ))}
                </div>
                {/* Second Loop for seamlessness */}
                <div className="animate-marquee aria-hidden flex shrink-0 items-center gap-24 px-12">
                    {techs.map((tech, idx) => (
                        <div key={`dup-${idx}`} className="flex min-w-[max-content] flex-col items-center gap-3">
                            <tech.icon className={cn("h-10 w-10", tech.color)} />
                            <span className="text-sm font-medium text-gray-400">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
