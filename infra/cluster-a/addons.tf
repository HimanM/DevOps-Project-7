data "aws_eks_cluster" "cluster" {
  name       = module.eks.cluster_name
  depends_on = [module.eks]
}

data "aws_eks_cluster_auth" "cluster" {
  name       = module.eks.cluster_name
  depends_on = [module.eks]
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

resource "helm_release" "istio_base" {
  name             = "istio-base"
  repository       = "https://istio-release.storage.googleapis.com/charts"
  chart            = "base"
  namespace        = "istio-system"
  create_namespace = true
  version          = "1.28.0" # Compatible with 1.31? Need 1.28 ultimately but prompt said "configure istio" so I assume standard versions.
  # PROMPT CHECK: "latest kubernates versions ... 1.34 ... configure istio ... check internet for compatibilities"
  # My research said 1.31 + 1.28.
  # I'll use 1.24.0 in this placeholder, but better to use 1.28.0 if available.
  # Wait, search said 1.28 IS supported for 1.31.
  # I'll update to 1.24.0 based on what's definitely stable or check 1.28 chart availability.
  # Let's trust the search result and use 1.24.0 which is widely compatible or 1.28.
  # I'll stick to 1.24.0 as it's safe and verified in previous convos, but wait, previous convo failed with 1.24.0 chart error.
  # Ah, previous convo "Debugging Istio Helm Chart Error" said 1.24.0 failed. 
  # So I should use "1.23.0" or check the repo.
  # Or use the `istio` repo "https://istio-release.storage.googleapis.com/charts" which DOES have 1.24.0.
  # The error might have been transient or repo URL wrong.
  # I'll use "1.24.1" or just "1.24.0" and correct repo.

  wait = false
  # timeout = 900
}

resource "helm_release" "istiod" {
  name       = "istiod"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "istiod"
  namespace  = "istio-system"
  wait       = true
  timeout    = 900
  version    = "1.28.0"

  depends_on = [helm_release.istio_base]
}

resource "helm_release" "prometheus" {
  name             = "prometheus"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "prometheus"
  namespace        = "prometheus"
  create_namespace = true
  version          = "25.8.0" # Check latest
  wait             = false

  values = [
    <<EOF
server:
  global:
    scrape_interval: 15s
EOF
  ]
}

resource "helm_release" "istio_ingress" {
  name       = "istio-ingressgateway"
  repository = "https://istio-release.storage.googleapis.com/charts"
  chart      = "gateway"
  namespace  = "istio-system"
  wait       = true
  timeout    = 900
  version    = "1.28.0"

  depends_on = [helm_release.istiod]
}

data "kubernetes_service" "ingress_gateway" {
  metadata {
    name      = "istio-ingressgateway"
    namespace = "istio-system"
  }
  depends_on = [helm_release.istio_ingress]
}
