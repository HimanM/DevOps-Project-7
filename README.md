# DevOps Project 7: End-to-End GitOps with EKS, ArgoCD, and GitHub Actions

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Prerequisites](#prerequisites)
3.  [Architecture](#architecture)
4.  [Repository Structure](#repository-structure)
5.  [Setup Instructions](#setup-instructions)
    *   [1. Infrastructure Provisioning](#1-infrastructure-provisioning)
    *   [2. Kubernetes Configuration](#2-kubernetes-configuration)
    *   [3. ArgoCD Setup](#3-argocd-setup)
6.  [Horizontal Pod Autoscaling (HPA)](#horizontal-pod-autoscaling)
7.  [Observability (Kiali & Prometheus)](#observability)
8.  [Environment-Specific Builds](#environment-specific-builds)
9.  [CI/CD Workflow](#cicd-workflow)
10. [Verification](#verification)

---

## Project Overview

This project demonstrates a comprehensive DevOps solution for deploying microservices (Node.js Backend and Next.js Frontend) to Amazon Elastic Kubernetes Service (EKS). It leverages Terraform for Infrastructure as Code (IaC), ArgoCD for GitOps-style continuous delivery, and GitHub Actions for continuous integration.

Key technologies:
*   **AWS EKS (Kubernetes 1.34)**: Managed Kubernetes clusters for Staging and Production.
*   **Terraform**: Automated infrastructure provisioning.
*   **Istio & Prometheus**: Service mesh and monitoring stack.
*   **ArgoCD**: Declarative GitOps deployment tool.
*   **GitHub Actions**: CI/CD pipeline for building and tagging images.
*   **Amazon Linux 2023**: Optimized Node OS.

## Prerequisites

*   AWS CLI configured with Administrator access.
*   Terraform installed (v1.0+).
*   Kubectl installed.
*   ArgoCD CLI installed.
*   GitHub Repository with "Read and write permissions" enabled for Workflows.

## Architecture

![Placeholder: Architecture Diagram. Please insert a diagram illustrating the flow from Developer -> GitHub -> GitHub Actions -> GHCR -> ArgoCD -> EKS Staging/Production.]

## Repository Structure

*   `backend/`: Node.js Express source code.
*   `frontend/`: Next.js source code.
*   `infra/`: Terraform configuration for Cluster A (Staging) and Cluster B (Production).
*   `kubernetes/`: Kubernetes manifests (Deployment, Service, Ingress) managed by Kustomize.
*   `argocd/`: ArgoCD Project and Application definitions.
*   `.github/workflows/`: CI/CD pipeline definition.

## Setup Instructions

### 1. Infrastructure Provisioning

We use Terraform to provision two separate EKS clusters.

**Staging Cluster (Cluster A):**
Run `terraform apply` in `infra/cluster-a`.

![Placeholder: Terraform Output. Please take a screenshot of the terminal showing the successful 'Apply complete' message and the output variables for Cluster A.]

**Production Cluster (Cluster B):**
Run `terraform apply` in `infra/cluster-b`.

![Placeholder: Terraform Output. Please take a screenshot of the terminal showing the successful 'Apply complete' message and the output variables for Cluster B.]

### 2. Kubernetes Configuration

After provisioning, configure your local `kubectl` to interact with both clusters.

![Placeholder: Kubectl Context Verification. Please take a screenshot of the terminal running 'kubectl config get-contexts' or 'kubectl get nodes' to verify connectivity to both clusters.]

### 3. ArgoCD Setup

ArgoCD is installed on the Staging cluster (Cluster A) and manages both environments.

**Installation & Login:**
Execute the installation commands and login via the CLI.

![Placeholder: ArgoCD Login. Please take a screenshot of the ArgoCD login page or the CLI login success message.]

**Cluster Registration:**
Register the Production cluster (Cluster B) with ArgoCD.

![Placeholder: ArgoCD Cluster List. Please take a screenshot of the terminal output or ArgoCD UI 'Settings > Clusters' page showing both the local and production clusters connected.]

**Application Sync:**
Apply the ArgoCD Project and Application manifests.

![Placeholder: ArgoCD Applications. Please take a screenshot of the ArgoCD Dashboard showing the Staging and Production applications in a 'Synced' and 'Healthy' state.]

### 6. Horizontal Pod Autoscaling (HPA)

HPA is configured to automatically scale pods based on CPU utilization (target 50%, min 2, max 10 replicas).

**Verify HPA:**
```bash
kubectl get hpa -n staging
# or
kubectl get hpa -n production
```

### 7. Observability (Kiali & Prometheus)

Kiali provides a visualization of your Service Mesh.

**Access Kiali:**
```bash
kubectl -n istio-system port-forward svc/kiali 20001:20001
# Open http://localhost:20001
```

**Access Prometheus:**
```bash
kubectl -n prometheus port-forward svc/prometheus-server 9090:80
# Open http://localhost:9090
```

### 8. Environment-Specific Builds

The CI/CD pipeline builds images with different environment configurations based on the branch:
- **Feature Branches**: `NODE_ENV=staging`, deployed to Cluster A.
- **Main Branch**: `NODE_ENV=production`, deployed to Cluster B.

## CI/CD Workflow

The GitHub Actions pipeline automatically builds Docker images, pushes them to GitHub Container Registry (GHCR), and updates the Kubernetes manifests with the new image tags.

![Placeholder: GitHub Actions Run. Please take a screenshot of the GitHub Actions 'Actions' tab showing a successful workflow run.]

![Placeholder: Link to Image Registry. Please take a screenshot of the GitHub Packages/Container Registry page showing the uploaded backend and frontend images with SHA tags.]

## Verification

Once deployed, the application is accessible via the Load Balancer URL provided by the Terraform output.

**Frontend Interface:**
Access the frontend URL in your browser. It should retrieve data from the backend service.

![Placeholder: Application UI. Please take a screenshot of the running Frontend application in the browser, explicitly showing the 'Hello from Backend!' message displayed on the page.]
