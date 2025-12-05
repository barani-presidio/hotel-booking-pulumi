# Quick Start Guide

## Prerequisites Check

```bash
# Check if all required tools are installed
node --version    # Should be 18+
docker --version
kubectl version --client
pulumi version
aws --version
```

## 1. Local Development (5 minutes)

```bash
# Clone and setup
git clone <your-repo>
cd hotel-booking-system

# Start with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:5002/api
# MongoDB: localhost:27018
```

## 2. AWS Deployment (15-20 minutes)

```bash
# Configure AWS credentials
aws configure

# Run full deployment
make full-deploy

# Or step by step:
make install        # Install dependencies
make infra-up       # Create AWS infrastructure
make push           # Build and push images to ECR
make deploy         # Deploy to Kubernetes
```

## 3. Verify Deployment

```bash
# Check pods
kubectl get pods

# Get application URL
kubectl get svc frontend

# View logs
kubectl logs -l app=backend
```

## 4. Test the Application

1. Open the LoadBalancer URL in your browser
2. Register a new user
3. Browse available hotels
4. Make a test booking

## Common Commands

```bash
# View cluster info
kubectl cluster-info

# Scale application
kubectl scale deployment backend --replicas=3

# Update application
make push && kubectl rollout restart deployment/backend

# View logs
kubectl logs -f deployment/backend

# Cleanup
make infra-down
```
