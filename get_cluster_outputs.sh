#!/bin/bash

# Function to get LB URL
get_lb_url() {
    kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
}

echo "========================================================"
echo " CLUSTER A (STAGING) OUTPUTS"
echo "========================================================"
cd infra/cluster-a
CLUSTER_NAME=$(terraform output -raw cluster_name)
REGION=$(terraform output -raw region)

echo "Cluster Name: $CLUSTER_NAME"
echo "Region: $REGION"

# Ensure context is active
aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION --alias staging > /dev/null
echo "Switched to context: staging"

# Get LB URL
LB_URL=$(get_lb_url)
echo "--------------------------------------------------------"
echo "Load Balancer URL: http://$LB_URL"
echo "--------------------------------------------------------"

echo ""
echo "========================================================"
echo " CLUSTER B (PRODUCTION) OUTPUTS"
echo "========================================================"
cd ../cluster-b
CLUSTER_NAME=$(terraform output -raw cluster_name)
REGION=$(terraform output -raw region)

echo "Cluster Name: $CLUSTER_NAME"
echo "Region: $REGION"

# Ensure context is active
aws eks update-kubeconfig --name $CLUSTER_NAME --region $REGION --alias production > /dev/null
echo "Switched to context: production"

# Get LB URL
LB_URL=$(get_lb_url)
echo "--------------------------------------------------------"
echo "Load Balancer URL: http://$LB_URL"
echo "--------------------------------------------------------"
