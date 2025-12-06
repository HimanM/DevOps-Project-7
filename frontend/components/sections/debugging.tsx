import { CodeBlock } from "@/components/ui/code-block";
import { GlassCard } from "@/components/ui/glass-card";
import { Terminal, Cpu, Network, FileText, AlertTriangle } from "lucide-react";

export function DebuggingSection() {
    return (
        <section className="space-y-16 py-24" id="debugging">
            <div className="space-y-6">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
                    Advanced Debugging
                </h2>
                <p className="max-w-4xl text-xl text-gray-300 leading-relaxed">
                    Comprehensive command reference for troubleshooting clusters, networking, and application state.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Cluster Health */}
                <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="h-6 w-6 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">Cluster Health</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Node Status</label>
                            <CodeBlock code="kubectl get nodes -o wide" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">All Resources</label>
                            <CodeBlock code="kubectl get all -A" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Events</label>
                            <CodeBlock code="kubectl get events --sort-by='.lastTimestamp' -A" />
                        </div>
                    </div>
                </GlassCard>

                {/* Networking */}
                <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                        <Network className="h-6 w-6 text-purple-400" />
                        <h3 className="text-xl font-bold text-white">Networking & Services</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Service Endpoints</label>
                            <CodeBlock title="Check endpoints" code="kubectl get endpoints -n staging" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Ingress Status</label>
                            <CodeBlock code="kubectl get ingress -n istio-system" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Port Forwarding</label>
                            <CodeBlock code="kubectl port-forward svc/frontend 3000:3000 -n staging" />
                        </div>
                    </div>
                </GlassCard>

                {/* HPA & Metrics */}
                <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="h-6 w-6 text-orange-400" />
                        <h3 className="text-xl font-bold text-white">Scaling & Metrics</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">HPA Details</label>
                            <CodeBlock code="kubectl describe hpa -n staging" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Metrics Server Logs</label>
                            <CodeBlock code="kubectl -n kube-system logs -l k8s-app=metrics-server" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Top Pods</label>
                            <CodeBlock code="kubectl top pods -n staging" />
                        </div>
                    </div>
                </GlassCard>

                {/* Logs */}
                <GlassCard>
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="h-6 w-6 text-green-400" />
                        <h3 className="text-xl font-bold text-white">Application Logs</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Frontend Logs</label>
                            <CodeBlock code="kubectl logs -l app=frontend -n staging -f" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Backend Logs</label>
                            <CodeBlock code="kubectl logs -l app=backend -n staging -f" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Previous Crash Logs</label>
                            <CodeBlock code="kubectl logs -l app=backend -n staging --previous" />
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
}
