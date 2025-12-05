#!/bin/bash

# Complete deployment pipeline

set -e

echo "=== Hotel Booking System - Full Deployment ==="

# Step 1: Setup infrastructure
echo "Step 1: Setting up infrastructure..."
./scripts/setup-infrastructure.sh

# Step 2: Build and push Docker images
echo "Step 2: Building and pushing Docker images..."
./scripts/build-and-push.sh

# Step 3: Deploy to Kubernetes
echo "Step 3: Deploying to Kubernetes..."
./scripts/deploy-k8s.sh

echo "=== Deployment Complete ==="
echo "Your application is now running on AWS EKS!"
