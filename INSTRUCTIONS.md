# DevOps Project 7 Setup Instructions

This reference guide covers the setup for creating two EKS clusters (Staging & Production), configuring Istio/Prometheus, and deploying a GitOps automation pipeline with ArgoCD and GitHub Actions.

## Prerequisites

- AWS CLI configured with appropriate permissions.
- Terraform installed (>= 1.0).
- Kubectl installed.
- Github Account and Repository with actions enabled.

## 1. Infrastructure Provisioning (Terraform)

We have two cluster configurations: `infra/cluster-a` (Staging) and `infra/cluster-b` (Production).

### Deploy Cluster A (Staging)

```bash
cd infra/cluster-a
terraform init
terraform apply -auto-approve
```

This will create:
- VPC
- EKS Cluster `cluster-a-staging` (K8s 1.31)
- Node Group
- Helm releases for Istio (Base, Istiod, Ingress Gateway) and Prometheus.

### Deploy Cluster B (Production)

```bash
cd infra/cluster-b
terraform init
terraform apply -auto-approve
```

This will create:
- VPC
- EKS Cluster `cluster-b-prod` (K8s 1.31)
- Node Group
- Helm releases for Istio and Prometheus.

### Configure Kubectl

After Terraform completes, update your kubeconfig:

```bash
aws eks update-kubeconfig --region us-west-2 --name cluster-a-staging --alias staging
aws eks update-kubeconfig --region us-west-2 --name cluster-b-prod --alias production
```

## 2. ArgoCD Setup

You need to install ArgoCD on one of the clusters (or a management cluster). Assuming you use Cluster A for management:

```bash
kubectl config use-context staging
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Login to ArgoCD (Port forward):
```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
# Login with admin / initial secret (check argocd docs)
```

### Apply ArgoCD Projects and Apps

1. **Update Repository URL**:
   Edit `argocd/apps/cluster-a-app.yaml` and `argocd/apps/cluster-b-app.yaml`.
   Replace `https://github.com/USER/REPO` with your actual GitHub Repository URL.

2. **Apply Configurations**:
   ```bash
   kubectl apply -f argocd/projects/project-cluster-a.yaml
   kubectl apply -f argocd/projects/project-cluster-b.yaml
   kubectl apply -f argocd/apps/cluster-a-app.yaml
   kubectl apply -f argocd/apps/cluster-b-app.yaml
   ```

ArgoCD will now sync the applications from `kubernetes/cluster-a` and `kubernetes/cluster-b` folders to the respective clusters.
*Note:* You might need to add your Cluster B context to ArgoCD if it's external, or if running inside Cluster A, ensure Cluster A can reach Cluster B (VPC peering or public endpoint). If relying on public endpoint, you need to register the cluster in ArgoCD:
`argocd cluster add production` (using CLI).

## 3. GitHub Actions (CI/CD)

The workflow is defined in `.github/workflows/deploy.yml`.

1. Go to your GitHub Repository -> Settings -> Actions -> General.
2. Ensure "Read and write permissions" is selected under "Workflow permissions" so the action can commit back to the repo.
3. Push changes to `backend/` or `frontend/` folders.
4. The workflow will:
   - Build Docker images.
   - Push to GHCR (GitHub Container Registry).
   - Update `kubernetes/cluster-a/app/kustomization.yaml` and `cluster-b` with the new image tags.
   - Commit the changes.

## 4. Verification

- **ArgoCD**: Check the UI (localhost:8081) to see apps Syncing.
- **ALB Endpoint**: Check the `Ingress` resource status in `istio-system` or `staging` namespace to get the ALB address.
  ```bash
  kubectl get ingress -n istio-system
  ```
  (Note: AWS Load Balancer Controller must be installed on the cluster. The Terraform setup installs Istio, but you may need to ensure the ALB Controller is installed if not included in the standard EKS blueprints. Our setup provided assumes you might install this separately or via Terraform addon if listed).
