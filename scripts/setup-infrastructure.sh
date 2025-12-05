#!/bin/bash

# Setup infrastructure using Pulumi

set -e

echo "Setting up infrastructure with Pulumi..."

cd infrastructure

# Install dependencies
npm install

# Initialize Pulumi stack if not exists
pulumi stack select dev || pulumi stack init dev

# Deploy infrastructure
pulumi up --yes

# Export kubeconfig
pulumi stack output kubeconfig > ../kubeconfig-eks-cluster-pulumi.json

# Save cluster details
cat > ../cluster-details.json <<EOF
{
    "cluster": {
        "name": "$(pulumi stack output clusterName)",
        "endpoint": "$(pulumi stack output clusterEndpoint)",
        "version": "1.32",
        "status": "ACTIVE",
        "vpcId": "$(pulumi stack output vpcId)",
        "tags": {
            "createdby": "pulumi",
            "project": "hotel-booking-system"
        }
    },
    "ecr": {
        "backendRepo": "$(pulumi stack output backendRepoUrl)",
        "frontendRepo": "$(pulumi stack output frontendRepoUrl)"
    }
}
EOF

echo "Infrastructure setup complete!"
echo "Cluster name: $(pulumi stack output clusterName)"
echo "Backend ECR: $(pulumi stack output backendRepoUrl)"
echo "Frontend ECR: $(pulumi stack output frontendRepoUrl)"

cd ..
