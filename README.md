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

*(Architecture diagram placeholder)*

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

![Staging Cluster Output](docs/staging_cluster_output.png)

**Production Cluster (Cluster B):**
Run `terraform apply` in `infra/cluster-b`.

![Production Cluster Output](docs/prod_cluster_output.png)

### 2. Kubernetes Configuration

After provisioning, configure your local `kubectl` to interact with both clusters.

![Kubeconfig Verification](docs/aws_clusters_to_kubeconfig_and_verification.png)

### 3. ArgoCD Setup

ArgoCD is installed on the Staging cluster (Cluster A) and manages both environments.

**Adding Clusters:**
Register the Production cluster (Cluster B) with ArgoCD.

![Adding Clusters to ArgoCD](docs/ading_clusters_to_argocd.png)

**Application Sync:**
Apply the ArgoCD Project and Application manifests.

![ArgoCD Applications](docs/argocd_applcations.png)

**Staging Application Status:**
![Staging ArgoCD Status](docs/staging_argocd_sync_status.png)

**Production Application Status:**
![Production ArgoCD Status](docs/prod_argocd_sync_status.png)

## Horizontal Pod Autoscaling (HPA)

HPA is configured to automatically scale pods based on CPU utilization (target 50%, min 2, max 10 replicas).

**Staging HPA Status:**
![Staging HPA](docs/staging_hpa_status.png)

**Production HPA Status:**
![Production HPA](docs/prod_hpa_status.png)

## Observability (Kiali & Prometheus)

Kiali provides a visualization of your Service Mesh.

### Staging Environment

**Traffic Graph:**
![Staging Kiali Graph](docs/staging_kiali_traffic_graph.png)

**Applications:**
![Staging Kiali Applications](docs/staging_kiali_applications.png)

**Workloads:**
![Staging Kiali Workloads](docs/staging_kiali_workloads.png)

### Production Environment

**Traffic Graph:**
![Production Kiali Graph](docs/prod_kiali_traffic_graph.png)

**Mesh Overview:**
![Production Kiali Mesh](docs/prod_kiali_mesh.png)

## Environment-Specific Builds

The CI/CD pipeline builds images with different environment configurations based on the branch:
- **Feature Branches**: `NODE_ENV=staging`, deployed to Cluster A.
- **Main Branch**: `NODE_ENV=production`, deployed to Cluster B.

## CI/CD Workflow

The GitHub Actions pipeline automatically builds Docker images, pushes them to GitHub Container Registry (GHCR), and updates the Kubernetes manifests with the new image tags.

![GitHub Actions Workflow](docs/github_actions_cicd.png)

## Verification

You can verify the state of your clusters using `kubectl`.

**Staging Resources:**
![Staging Verification](docs/staging_kubectl_get_pods,svc,endpoints,hpa.png)

**Production Resources:**
![Production Verification](docs/prod_kubectl_get_pods,svc,endpoints,hpa.png)
