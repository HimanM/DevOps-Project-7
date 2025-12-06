import { CodeBlock } from "@/components/ui/code-block";
import { GlassCard } from "@/components/ui/glass-card";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { Activity, Eye, Network, Search } from "lucide-react";

export function ObservabilitySection() {
    return (
        <section className="space-y-16 py-24 pb-40" id="observability">
            <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    Observability & Scaling
                </h2>
                <p className="max-w-4xl text-base md:text-xl text-gray-300 leading-relaxed">
                    Ensuring reliability with <strong>Horizontal Pod Autoscaling (HPA)</strong> for load management
                    and <strong>Kiali</strong> for deep visibility into the Istio Service Mesh.
                </p>
            </div>

            {/* HPA Section */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="rounded-full bg-green-500/10 p-3">
                        <Activity className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">Horizontal Pod Autoscaling</h3>
                        <p className="text-sm md:text-base text-gray-400">Automatic scaling based on CPU utilization (Target: 50%)</p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <GlassCard>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg md:text-xl font-bold text-blue-300">Staging Environment</h4>
                            <span className="text-xs font-mono text-gray-500">Min: 2 | Max: 10</span>
                        </div>
                        <ZoomableImage src="/docs/staging_hpa_status.png" alt="Staging HPA" />
                        <div className="mt-6 space-y-4">
                            <CodeBlock title="Check Staging HPA" code="kubectl get hpa -n staging --watch" />
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg md:text-xl font-bold text-purple-300">Production Environment</h4>
                            <span className="text-xs font-mono text-gray-500">Min: 2 | Max: 10</span>
                        </div>
                        <ZoomableImage src="/docs/prod_hpa_status.png" alt="Production HPA" />
                        <div className="mt-6 space-y-4">
                            <CodeBlock title="Check Production HPA" code="kubectl get hpa -n production --watch" />
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Kiali Section */}
            <div className="space-y-8 pt-12 border-t border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="rounded-full bg-orange-500/10 p-3">
                        <Eye className="h-6 w-6 md:h-8 md:w-8 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">Service Mesh Visualization (Kiali)</h3>
                        <p className="text-sm md:text-base text-gray-400">Deep dive into traffic topology and mesh health.</p>
                    </div>
                </div>

                <GlassCard className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-6">
                            <div className="prose prose-invert max-w-none text-gray-300">
                                <p>
                                    Kiali provides a powerful dashboard to visualize the Istio Service Mesh.
                                    It connects to Prometheus to gather metrics and topology data.
                                    Below are the different views available in the Kiali dashboard for both Staging and Production.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h5 className="font-semibold text-orange-300 flex items-center gap-2">
                                    <Network className="h-4 w-4" />
                                    Access the Dashboard
                                </h5>
                                <CodeBlock
                                    title="Port Forward Kiali"
                                    code="kubectl -n istio-system port-forward svc/kiali 20001:20001"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto snap-x gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide">
                        {/* Traffic Graphs */}
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staging Traffic Graph</p>
                            <ZoomableImage src="/docs/staging_kiali_traffic_graph.png" alt="Staging Graph" />
                        </div>
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Traffic Graph</p>
                            <ZoomableImage src="/docs/prod_kiali_traffic_graph.png" alt="Prod Graph" />
                        </div>

                        {/* Applications View */}
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staging Applications</p>
                            <ZoomableImage src="/docs/staging_kiali_applications.png" alt="Staging Apps" />
                        </div>
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Applications</p>
                            <ZoomableImage src="/docs/prod_kiali_applications.png" alt="Prod Apps" />
                        </div>

                        {/* Mesh & Workloads */}
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staging Mesh</p>
                            <ZoomableImage src="/docs/staging_kiali_mesh.png" alt="Staging Mesh" />
                        </div>
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Mesh</p>
                            <ZoomableImage src="/docs/prod_kiali_mesh.png" alt="Prod Mesh" />
                        </div>

                        {/* Overview & Services (Extra Views) */}
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staging Overview</p>
                            <ZoomableImage src="/docs/staging_kiali_overview.png" alt="Staging Overview" />
                        </div>
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Production Overview</p>
                            <ZoomableImage src="/docs/prod_kiali_overview.png" alt="Prod Overview" />
                        </div>
                        <div className="min-w-[85vw] md:min-w-0 snap-center space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Staging Services</p>
                            <ZoomableImage src="/docs/staging_kiali_services.png" alt="Staging Services" />
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
}
