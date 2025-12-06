import { CodeBlock } from "@/components/ui/code-block";
import { GlassCard } from "@/components/ui/glass-card";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { GitBranch, RefreshCw, Settings, LayoutDashboard } from "lucide-react";

export function CicdSection() {
    return (
        <section className="space-y-16 py-24" id="cicd">
            <div className="space-y-6">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                    CI/CD & GitOps Pipeline
                </h2>
                <p className="max-w-4xl text-xl text-gray-300 leading-relaxed">
                    A fully automated workflow from code commit to production deployment.
                </p>
            </div>

            {/* GitHub Actions */}
            <GlassCard className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <GitBranch className="h-10 w-10 text-green-400" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">1. Continuous Integration (GitHub Actions)</h3>
                        <p className="text-gray-400">Build, Tag, and Push</p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-6 text-gray-300">
                        <p>
                            GitHub Actions builds optimized Docker images for the frontend and backend.
                        </p>
                        <ZoomableImage src="/docs/github_actions_cicd.png" alt="GitHub Actions Workflow" className="shadow-2xl" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">Manifest Update</p>
                        <ZoomableImage src="/docs/apply_manifests_to_clusters.png" alt="Manifest Apply" />
                    </div>
                </div>
            </GlassCard>

            {/* ArgoCD */}
            <GlassCard className="space-y-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <RefreshCw className="h-10 w-10 text-teal-400" />
                    <div>
                        <h3 className="text-2xl font-bold text-white">2. Continuous Deployment (ArgoCD)</h3>
                        <p className="text-gray-400">Declarative GitOps Sync</p>
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">

                    {/* Steps Column */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Settings className="h-5 w-5 text-gray-400" />
                                Installation & Setup
                            </h4>
                            <CodeBlock
                                title="Install ArgoCD"
                                code={`kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`}
                            />
                            <CodeBlock
                                title="Login & Add Cluster"
                                code={`argocd login localhost:8081 --username admin --insecure
argocd cluster add production`}
                            />
                        </div>
                    </div>

                    {/* Visuals Column */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Adding Production Cluster</p>
                            <ZoomableImage src="/docs/ading_clusters_to_argocd.png" alt="ArgoCD Cluster Setup" />
                        </div>
                    </div>
                </div>

                {/* Sync Status Section */}
                <div className="space-y-6 pt-8 border-t border-white/5">
                    <h4 className="font-bold text-gray-300 text-lg">Application Details</h4>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-blue-400 uppercase">Staging Application</p>
                            <ZoomableImage src="/docs/staging_argocd_applcation.png" alt="Staging App Detail" />
                            <ZoomableImage src="/docs/staging_argocd_sync_status.png" alt="Staging Sync Status" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-purple-400 uppercase">Production Application</p>
                            <ZoomableImage src="/docs/prod_argocd_applcation.png" alt="Production App Detail" />
                            <ZoomableImage src="/docs/prod_argocd_sync_status.png" alt="Production Sync Status" />
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <p className="text-xs font-bold text-gray-500 uppercase">Global Dashboard</p>
                        <ZoomableImage src="/docs/argocd_applcations.png" alt="ArgoCD Dashboard" />
                    </div>
                </div>
            </GlassCard>
        </section>
    );
}
