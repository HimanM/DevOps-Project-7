#!/bin/bash

# ==========================================
# COLORS & STYLING
# ==========================================
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

# ==========================================
# HELPER FUNCTIONS
# ==========================================

# Spinner animation
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    
    # Hide cursor
    tput civis
    
    while kill -0 "$pid" 2>/dev/null; do
        local temp=${spinstr#?}
        printf " [${CYAN}%c${NC}]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
    
    # Restore cursor
    tput cnorm
}

# Fetch LB URL using kubectl
get_lb_url() {
    kubectl get svc -n istio-system istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null
}

process_cluster() {
    local folder=$1
    local title=$2
    local context_alias=$3
    
    echo -e "\n${BOLD}${BLUE}========================================================${NC}"
    echo -e "${BOLD}${BLUE} $title${NC}"
    echo -e "${BOLD}${BLUE}========================================================${NC}"
    
    pushd "$folder" > /dev/null || exit

    # 1. Get Terraform Outputs
    echo -ne "${YELLOW}Reading Terraform outputs...${NC}"
    (
        terraform output -raw cluster_name > /tmp/cluster_name_${context_alias} 2>/dev/null
        terraform output -raw region > /tmp/region_${context_alias} 2>/dev/null
    ) &
    spinner $!
    
    if [ -s "/tmp/cluster_name_${context_alias}" ]; then
        echo -e "${GREEN} Done${NC}"
    else
        echo -e "${RED} Failed${NC}"
        popd > /dev/null
        return
    fi

    CLUSTER_NAME=$(cat /tmp/cluster_name_${context_alias})
    REGION=$(cat /tmp/region_${context_alias})

    echo -e "${BOLD}Cluster Name:${NC} ${CYAN}$CLUSTER_NAME${NC}"
    echo -e "${BOLD}Region:${NC}       ${CYAN}$REGION${NC}"

    # 2. Update Kubeconfig
    echo -ne "${YELLOW}Updating kubeconfig...${NC}"
    (aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$REGION" --alias "$context_alias" > /dev/null 2>&1) &
    spinner $!
    echo -e "${GREEN} Done${NC} (Switched to: ${BOLD}$context_alias${NC})"

    # 3. Get Load Balancer URL
    echo -ne "${YELLOW}Fetching Load Balancer URL...${NC}"
    (get_lb_url > /tmp/lb_${context_alias}) &
    spinner $!
    echo -e "${GREEN} Done${NC}"
    
    LB_URL=$(cat /tmp/lb_${context_alias})
    
    echo -e "${BOLD}--------------------------------------------------------${NC}"
    if [ -n "$LB_URL" ]; then
        echo -e "${BOLD}Load Balancer URL:${NC} ${GREEN}http://$LB_URL${NC}"
    else
        echo -e "${BOLD}Load Balancer URL:${NC} ${RED}Not available (Pending?)${NC}"
    fi
    echo -e "${BOLD}--------------------------------------------------------${NC}"
    
    popd > /dev/null
}

# ==========================================
# MAIN EXECUTION
# ==========================================

# Clean temp files on exit
trap 'rm -f /tmp/cluster_name_* /tmp/region_* /tmp/lb_*; tput cnorm' EXIT

process_cluster "infra/cluster-a" "CLUSTER A (STAGING)" "staging"
process_cluster "infra/cluster-b" "CLUSTER B (PRODUCTION)" "production"
