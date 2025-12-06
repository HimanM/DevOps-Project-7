import { CodeBlock } from "@/components/ui/code-block";
import { GlassCard } from "@/components/ui/glass-card";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { Server, ShieldCheck, Globe } from "lucide-react";

export function InfrastructureSection() {
    return (
        <section className="space-y-16 py-24" id="infrastructure">
            <div className="space-y-6">
                <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Infrastructure as Code
                </h2>
                <p className="max-w-4xl text-base md:text-xl text-gray-300 leading-relaxed">
                    Two highly available EKS clusters are provisioned using <strong>Terraform</strong>.
                    The infrastructure is modular, utilizing the <code className="bg-white/10 px-1 py-0.5 rounded text-sm">terraform-aws-modules/eks/aws</code> blueprints.
                    Each environment is completely isolated and defined in <code className="bg-white/10 px-1 py-0.5 rounded text-sm">infra/cluster-a</code> (Staging) and <code className="bg-white/10 px-1 py-0.5 rounded text-sm">infra/cluster-b</code> (Production).
                </p>
            </div>

            <div className="grid gap-8 md:gap-12 xl:grid-cols-2">
                {/* Staging Cluster */}
                <GlassCard className="space-y-8 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Server className="h-6 w-6 text-blue-400" />
                                <h3 className="text-2xl md:text-3xl font-bold text-white">Staging Cluster</h3>
                            </div>
                            <p className="text-sm font-mono text-blue-400">infra/cluster-a</p>
                        </div>
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-blue-300 border border-blue-500/20">
                            Cluster A
                        </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-gray-400 text-sm md:text-base">
                        <p>
                            Host for our <strong>ArgoCD Control Plane</strong>. This cluster manages itself AND the production cluster.
                            It runs specific versions of addons to ensure compatibility.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>EKS Version:</strong> 1.34</li>
                            <li><strong>Istio:</strong> v1.28.0 (Service Mesh)</li>
                            <li><strong>Kiali:</strong> v1.89.0 (Observability)</li>
                            <li><strong>Prometheus:</strong> v25.8.0 (Metrics)</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500">Provisioning Commands</h4>
                        <CodeBlock
                            title="Deploy Staging"
                            code={`cd infra/cluster-a
terraform init
terraform apply --auto-approve`}
                        />
                        <CodeBlock
                            title="Configure Kubeconfig"
                            code={`aws eks update-kubeconfig --region us-west-2 --name cluster-a-staging --alias staging`}
                        />
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Terraform Output</h4>
                        <ZoomableImage
                            src="/docs/staging_cluster_output.png"
                            alt="Terraform Staging Output"
                            className="border-blue-500/20 shadow-lg"
                        />
                    </div>
                </GlassCard>

                {/* Production Cluster */}
                <GlassCard className="space-y-8 border-l-4 border-l-purple-500">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-purple-400" />
                                <h3 className="text-2xl md:text-3xl font-bold text-white">Production Cluster</h3>
                            </div>
                            <p className="text-sm font-mono text-purple-400">infra/cluster-b</p>
                        </div>
                        <span className="rounded-full bg-purple-500/10 px-3 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-medium text-purple-300 border border-purple-500/20">
                            Cluster B
                        </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-gray-400">
                        <p>
                            The <strong>Production Environment</strong> is strictly for workload execution.
                            It does not run CI/CD tools, maximizing resources for the application.
                            Managed remotely by ArgoCD from Cluster A via a Service Account.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Region:</strong> us-west-2</li>
                            <li><strong>High Availability:</strong> Multi-AZ deployment</li>
                            <li><strong>Ingress:</strong> AWS Network Load Balancer (NLB)</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Provisioning Commands</h4>
                        <CodeBlock
                            title="Deploy Production"
                            code={`cd infra/cluster-b
terraform init
terraform apply --auto-approve`}
                        />
                        <CodeBlock
                            title="Configure Kubeconfig"
                            code={`aws eks update-kubeconfig --region us-west-2 --name cluster-b-prod --alias production`}
                        />
                    </div>

                    <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Terraform Output</h4>
                        <ZoomableImage
                            src="/docs/prod_cluster_output.png"
                            alt="Terraform Production Output"
                            className="border-purple-500/20 shadow-lg h-48 md:h-auto object-cover object-top md:object-contain w-full"
                        />
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <Server className="h-6 w-6 text-green-400" />
                            <h3 className="text-2xl font-bold text-white">Post-Provisioning: Get URLs</h3>
                        </div>
                        <p className="text-gray-400 text-sm md:text-base">
                            A helper script <code className="text-green-400">get_cluster_outputs.sh</code> is available to automatically retrieve the Load Balancer URLs for both Staging and Production services.
                        </p>
                        <CodeBlock
                            title="Retrieve Outputs"
                            code={`chmod +x get_cluster_outputs.sh
./get_cluster_outputs.sh`}
                        />
                    </div>
                    <div className="flex-1 md:max-w-lg">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Script Output</h4>
                        <ZoomableImage
                            src="/docs/get_cluster_outputs_bash.png"
                            alt="Cluster Outputs Script"
                            className="border-green-500/20 shadow-lg"
                        />
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="bg-gradient-to-r from-gray-900 to-gray-800 border-white/5">
                <div className="flex flex-col md:flex-row items-center gap-8 p-4">
                    <Globe className="h-12 w-12 text-gray-400 hidden md:block" />
                    <div className="space-y-4 flex-1">
                        <h3 className="text-xl font-bold text-white">Verify Cluster Access</h3>
                        <p className="text-gray-400">
                            After provisioning, verify that you can connect to both contexts properly.
                            This is crucial for the next steps involving ArgoCD configuration.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2">
                        <CodeBlock
                            title="Check Nodes"
                            code={`kubectl config use-context staging
kubectl get nodes

kubectl config use-context production
kubectl get nodes`}
                        />
                    </div>
                </div>
            </GlassCard>
        </section>
    );
}
