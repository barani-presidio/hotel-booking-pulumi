#!/bin/bash

# Deploy application to Kubernetes

set -e

# Get AWS account ID and region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region)

if [ -z "$AWS_REGION" ]; then
    AWS_REGION="us-east-1"
fi

echo "Deploying to Kubernetes..."

# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Create namespace first
echo "Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Replace placeholders in deployment files
echo "Preparing deployment files..."
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/backend-deployment.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/backend-deployment.yaml
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/frontend-deployment.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/frontend-deployment.yaml

# Apply Kubernetes manifests in order
echo "Applying secrets..."
kubectl apply -f k8s/secrets.yaml

echo "Deploying MongoDB StatefulSet..."
kubectl apply -f k8s/mongodb-deployment.yaml

echo "Waiting for MongoDB StatefulSet to be ready..."
kubectl rollout status statefulset/mongodb -n hotel-booking --timeout=300s

echo "Deploying backend..."
kubectl apply -f k8s/backend-deployment.yaml

echo "Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

echo "Deployment complete!"
echo ""
echo "Checking deployment status..."
kubectl get pods -n hotel-booking
echo ""
echo "Getting service URL..."
kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
echo ""
