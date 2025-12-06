# DevOps Project 7 Setup Instructions

This reference guide covers the setup for creating two EKS clusters (Staging & Production), configuring Istio/Prometheus, and deploying a GitOps automation pipeline with ArgoCD and GitHub Actions.

## Prerequisites

- **AWS CLI** configured with appropriate permissions.
- **Terraform** installed (>= 1.0).
- **Kubectl** installed.
- **ArgoCD CLI** installed.
- **GitHub Account** and Repository with actions enabled.

## 1. Infrastructure Provisioning (Terraform)

We have two cluster configurations: `infra/cluster-a` (Staging/Management) and `infra/cluster-b` (Production).

### Step 1: Deploy Cluster A (Staging)

```bash
cd infra/cluster-a
terraform init
terraform apply --auto-approve
```

This acts as our Management Cluster (running ArgoCD) and Staging Environment.
- **EKS Version**: 1.34
- **Addons**: Istio 1.28.0, Prometheus.

### Step 2: Deploy Cluster B (Production)

```bash
cd ../cluster-b
terraform init
terraform apply --auto-approve
```

This acts as our Production Environment.
- **EKS Version**: 1.34
- **Addons**: Istio 1.28.0, Prometheus.

### Step 3: Configure Kubectl Contexts

Once Terraform finishes, update your local kubeconfig to access both clusters:

```bash
aws eks update-kubeconfig --region us-east-1 --name cluster-a-staging --alias staging
aws eks update-kubeconfig --region us-east-1 --name cluster-b-prod --alias production
```

## 2. ArgoCD Setup

We will install ArgoCD on **Cluster A (Staging)** and configure it to manage both clusters.

### Step 1: Install ArgoCD

```bash
kubectl config use-context staging
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Step 2: Access ArgoCD UI

Port-forward the ArgoCD server to access the UI (keep this terminal open):

```bash
kubectl port-forward svc/argocd-server -n argocd 8081:443
```

- **URL**: `https://localhost:8081`
- **Username**: `admin`
- **Password**: Get the initial secret:
  ```bash
  kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
  ```

### Step 3: Register Clusters to ArgoCD

1. **Login to ArgoCD via CLI**:
   ```bash
   argocd login localhost:8081 --username admin --password <password> --insecure
   ```

2. **Add Cluster B (Production)**:
   Since ArgoCD is running on Cluster A, it knows about Cluster A (as `https://kubernetes.default.svc`). We need to tell it about Cluster B.
   ```bash
   argocd cluster add production
   ```
   *Note: Ensure your current kubectl context is set correctly or use `--kubeconfig` if needed. This command installs a ServiceAccount in Cluster B that ArgoCD uses for access.*

### Step 4: Configure Projects and Apps

1. **Update Repository URL**:
   Open these files and replace `https://github.com/REPLACE_ME_WITH_YOUR_REPO_URL` with your actual GitHub Repository URL:
   - `argocd/apps/cluster-a-app.yaml`
   - `argocd/apps/cluster-b-app.yaml`

2. **Apply Configurations**:
   ```bash
   kubectl config use-context staging
   kubectl apply -f argocd/namespaces/cluster-a-argocd-namespace.yaml
   kubectl apply -f argocd/namespaces/cluster-b-argocd-namespace.yaml # (If managed by Argo/kubectl)
   
   # Or better yet, allow ArgoCD to create the namespaces as defined in the Apps.
   
   kubectl apply -f argocd/projects/project-cluster-a.yaml
   kubectl apply -f argocd/projects/project-cluster-b.yaml
   
   kubectl apply -f argocd/apps/cluster-a-app.yaml
   kubectl apply -f argocd/apps/cluster-b-app.yaml
   ```

## 3. GitHub Actions (CI/CD)

The workflow is located in `.github/workflows/deploy.yml`.

1. Go to your GitHub Repository -> **Settings** -> **Actions** -> **General**.
2. Ensure **"Read and write permissions"** is selected under "Workflow permissions".
3. Push changes to the `backend/` or `frontend/` directories.
4. The workflow will:
   - Build and Tag Docker images.
   - Push to GHCR.
   - Update `deployment.yaml` in `kubernetes/` with the new image tags.
   - Commit the changes back to the repo.
   - ArgoCD will detect the changes and sync the clusters.

## 4. Verification & External Access

### Check Ingress / LoadBalancer

Terraform outputs the external hostname of the Istio Ingress Gateway (ALB).

```bash
cd infra/cluster-a && terraform output load_balancer_hostname
cd infra/cluster-b && terraform output load_balancer_hostname
```

You can use these hostnames to access your application in Staging and Production respectively.

- **Staging URL**: `http://<staging-load-balancer-hostname>`
- **Production URL**: `http://<production-load-balancer-hostname>`
