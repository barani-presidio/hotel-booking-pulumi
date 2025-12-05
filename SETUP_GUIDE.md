# Complete Setup Guide

## Step-by-Step Installation

### 1. Prerequisites Installation

#### Install Node.js
```bash
# macOS
brew install node@18

# Verify
node --version  # Should be 18+
npm --version
```

#### Install Docker
```bash
# macOS - Download from https://www.docker.com/products/docker-desktop
# Or use Homebrew
brew install --cask docker

# Verify
docker --version
docker-compose --version
```

#### Install kubectl
```bash
# macOS
brew install kubectl

# Verify
kubectl version --client
```

#### Install AWS CLI
```bash
# macOS
brew install awscli

# Configure
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Verify
aws sts get-caller-identity
```

#### Install Pulumi
```bash
# macOS
brew install pulumi

# Login
pulumi login

# Verify
pulumi version
```

### 2. Project Setup

```bash
# Clone repository
git clone <your-repo-url>
cd hotel-booking-system

# Verify prerequisites
./scripts/verify-setup.sh

# Install dependencies
make install
```

### 3. Local Development Setup

```bash
# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start services
docker-compose up --build

# Access application
# Frontend: http://localhost:3001
# Backend: http://localhost:5002
# MongoDB: localhost:27018
```

### 4. AWS Infrastructure Setup

#### Configure AWS
```bash
# Set your AWS region
export AWS_REGION=us-east-1

# Verify credentials
aws sts get-caller-identity
```

#### Deploy Infrastructure
```bash
# Option 1: Automated
make full-deploy

# Option 2: Step by step
make infra-up      # Create infrastructure
make push          # Build and push images
make deploy        # Deploy to Kubernetes
```

### 5. Verify Deployment

```bash
# Check cluster
kubectl cluster-info

# Check pods
kubectl get pods

# Check services
kubectl get svc

# Get application URL
kubectl get svc frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

### 6. Access Application

```bash
# Get LoadBalancer URL
LB_URL=$(kubectl get svc frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Open in browser
echo "Application URL: http://$LB_URL"
```

## Configuration Details

### Backend Configuration (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/hotel-booking
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=production
```

### Frontend Configuration (frontend/.env)
```env
REACT_APP_API_URL=http://backend:5000/api
```

### Pulumi Configuration
```bash
cd infrastructure

# Set AWS region
pulumi config set aws:region us-east-1

# Set cluster name
pulumi config set clusterName eks-cluster-pulumi

# View configuration
pulumi config
```

## Post-Deployment Tasks

### 1. Update DNS (Optional)
```bash
# Get LoadBalancer URL
kubectl get svc frontend

# Create Route53 record pointing to LoadBalancer
aws route53 change-resource-record-sets --hosted-zone-id <zone-id> ...
```

### 2. Configure SSL/TLS (Optional)
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create certificate
kubectl apply -f k8s/certificate.yaml
```

### 3. Setup Monitoring (Optional)
```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Access Grafana
kubectl port-forward svc/prometheus-grafana 3000:80
```

### 4. Configure Autoscaling
```bash
# Horizontal Pod Autoscaler
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10
kubectl autoscale deployment frontend --cpu-percent=70 --min=2 --max=10

# Cluster Autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
```

## Maintenance

### Update Application
```bash
# Build new images
make push

# Rolling update
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend

# Check rollout status
kubectl rollout status deployment/backend
```

### Backup Database
```bash
# Backup MongoDB
kubectl exec <mongodb-pod> -- mongodump --out=/tmp/backup

# Copy backup
kubectl cp <mongodb-pod>:/tmp/backup ./mongodb-backup
```

### Scale Resources
```bash
# Scale pods
kubectl scale deployment backend --replicas=5

# Scale nodes (update Pulumi config)
cd infrastructure
pulumi config set desiredCapacity 5
pulumi up
```

## Troubleshooting

If you encounter issues, refer to:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- [TESTING.md](TESTING.md) - Testing procedures
- Run: `./scripts/verify-setup.sh` to check prerequisites

## Next Steps

1. Customize the application for your needs
2. Add more features (payment integration, reviews, etc.)
3. Implement CI/CD pipeline (see .github/workflows/deploy.yml)
4. Setup monitoring and alerting
5. Configure backup and disaster recovery
6. Implement security best practices

## Support

For issues and questions:
1. Check documentation in this repository
2. Review AWS EKS documentation
3. Check Pulumi documentation
4. Review Kubernetes documentation
