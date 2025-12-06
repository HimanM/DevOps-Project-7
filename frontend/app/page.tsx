import { HeroSection } from "@/components/sections/hero";
import { InfrastructureSection } from "@/components/sections/infrastructure";
import { CicdSection } from "@/components/sections/cicd";
import { ObservabilitySection } from "@/components/sections/observability";
import { DebuggingSection } from "@/components/sections/debugging";

// This allows the build to be dynamic (force-dynamic) to check env vars at runtime
export const dynamic = 'force-dynamic';

export default async function Home() {

  // Server-side logic to fetch backend
  const backendUrl = process.env.BACKEND_URL || "http://backend:8080";
  let backendMessage = "Backend Connected";

  try {
    const res = await fetch(backendUrl, {
      cache: "no-store",
      next: { revalidate: 0 }
    });
    if (res.ok) {
      backendMessage = await res.text();
    } else {
      backendMessage = `Error: ${res.status}`;
    }
  } catch (error) {
    backendMessage = "Failed to connect to backend.";
  }

  const env = process.env.APP_ENV || process.env.NODE_ENV || "development";

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">

      {/* Navigation / Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="font-bold tracking-tight text-gray-200">
              DevOps<span className="text-blue-500">Project7</span>
            </span>
          </div>
          <div className="hidden gap-8 text-sm font-medium text-gray-400 sm:flex">
            <a href="#infrastructure" className="hover:text-white transition-colors">Infrastructure</a>
            <a href="#cicd" className="hover:text-white transition-colors">CI/CD</a>
            <a href="#observability" className="hover:text-white transition-colors">Observability</a>
            <a href="#debugging" className="hover:text-white transition-colors">Debugging</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection initialBackendMessage={backendMessage} initialEnv={env} />

        <div className="relative mx-auto max-w-7xl px-6">
          <InfrastructureSection />
          <CicdSection />
          <ObservabilitySection />
          <DebuggingSection />
        </div>

        <footer className="mt-20 border-t border-white/5 bg-black py-12 text-center text-sm text-gray-600">
          <p className="mb-4">Designed & Architected by HimanM.</p>
          <p className="font-mono text-xs text-gray-700">Powered by AWS EKS & ArgoCD</p>
        </footer>
      </main>
    </div>
  );
}
