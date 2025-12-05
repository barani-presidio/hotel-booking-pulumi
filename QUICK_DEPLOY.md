# 🚀 Quick Deploy Guide - AWS ECR & EKS with Pulumi

## One-Command Deployment

```bash
# Complete deployment (infrastructure + build + deploy)
make full-deploy
```

This single command will:
1. ✅ Create AWS infrastructure (VPC, EKS, ECR)
2. ✅ Build Docker images
3. ✅ Push images to ECR
4. ✅ Deploy to Kubernetes

---

## Prerequisites Check

```bash
# Verify all tools are installed
./scripts/verify-setup.sh

# Required:
# ✓ Node.js 18+
# ✓ Docker
# ✓ kubectl
# ✓ AWS CLI (configured)
# ✓ Pulumi CLI
```

---

## Step-by-Step Deployment

### Step 1: Create Infrastructure (15-20 min)

```bash
# Option A: Using Makefile
make infra-up

# Option B: Using script
./scripts/setup-infrastructure.sh

# Option C: Manual
cd infrastructure
npm install
pulumi login
pulumi stack init dev
pulumi up --yes
cd ..
```

**What gets created:**
- VPC with subnets
- EKS cluster (`eks-cluster-pulumi`)
- ECR repositories (`hotel-backend`, `hotel-frontend`)
- MongoDB StatefulSet
- Kubernetes namespace (`hotel-booking`)

### Step 2: Build & Push Images (5-10 min)

```bash
# Option A: Using Makefile
make push

# Option B: Using script
./scripts/build-and-push.sh

# Option C: Manual
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push
docker build -t hotel-backend:latest ./backend
docker tag hotel-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest

docker build -t hotel-frontend:latest ./frontend
docker tag hotel-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest
```

### Step 3: Deploy to Kubernetes (5 min)

```bash
# Option A: Using Makefile
make deploy

# Option B: Using script
./scripts/deploy-k8s.sh

# Option C: Manual
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Update image URLs in manifests
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/*.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/*.yaml

# Deploy
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

---

## Verify Deployment

```bash
# Check all resources
kubectl get all -n hotel-booking

# Check pods
kubectl get pods -n hotel-booking

# Check services
kubectl get svc -n hotel-booking

# View logs
kubectl logs -l app=backend -n hotel-booking -f
```

---

## Access Your Application

```bash
# Get LoadBalancer URL
LB_URL=$(kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://$LB_URL"

# Open in browser (macOS)
open http://$LB_URL

# Test API
curl http://$LB_URL/api/health
```

**Note:** LoadBalancer provisioning takes 2-5 minutes.

---

## Useful Commands

### Infrastructure

```bash
# View infrastructure outputs
cd infrastructure && pulumi stack output && cd ..

# View cluster details
cat cluster-details.json

# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $(aws configure get region)
```

### Kubernetes

```bash
# Scale deployments
kubectl scale deployment backend --replicas=3 -n hotel-booking
kubectl scale deployment frontend --replicas=3 -n hotel-booking

# Port forward for testing
kubectl port-forward svc/backend 5000:5000 -n hotel-booking
kubectl port-forward svc/mongodb 27017:27017 -n hotel-booking

# View pod details
kubectl describe pod <pod-name> -n hotel-booking

# Execute commands in pod
kubectl exec -it <pod-name> -n hotel-booking -- /bin/sh
```

### Docker & ECR

```bash
# List ECR repositories
aws ecr describe-repositories --region $(aws configure get region)

# List images in repository
aws ecr describe-images --repository-name hotel-backend --region $(aws configure get region)
aws ecr describe-images --repository-name hotel-frontend --region $(aws configure get region)
```

---

## Troubleshooting

### Pods not starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n hotel-booking

# Check logs
kubectl logs <pod-name> -n hotel-booking

# Check events
kubectl get events -n hotel-booking --sort-by='.lastTimestamp'
```

### Cannot connect to cluster

```bash
# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $(aws configure get region)

# Verify cluster exists
aws eks describe-cluster --name eks-cluster-pulumi --region $(aws configure get region)
```

### Image pull errors

```bash
# Re-login to ECR
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Verify image exists
aws ecr describe-images --repository-name hotel-backend --region $AWS_REGION
```

---

## Cleanup

```bash
# Delete Kubernetes resources
kubectl delete namespace hotel-booking

# Delete ECR images
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

aws ecr batch-delete-image \
  --repository-name hotel-backend \
  --image-ids imageTag=latest \
  --region $AWS_REGION

aws ecr batch-delete-image \
  --repository-name hotel-frontend \
  --image-ids imageTag=latest \
  --region $AWS_REGION

# Destroy infrastructure
cd infrastructure
pulumi destroy --yes
cd ..
```

---

## Cost Estimate

**Monthly AWS Costs:**
- EKS Cluster: ~$73
- EC2 Instances (t3.medium x2): ~$60
- Load Balancer: ~$20
- ECR Storage: ~$1
- **Total: ~$154/month**

---

## Next Steps

1. ✅ **Set up CI/CD** - Automate deployments
2. ✅ **Add SSL/TLS** - Configure HTTPS
3. ✅ **Set up monitoring** - Add Prometheus/Grafana
4. ✅ **Implement autoscaling** - Configure HPA
5. ✅ **Add backups** - MongoDB backup strategy

---

## Documentation

- 📖 [Complete Deployment Guide](PULUMI_DEPLOYMENT_GUIDE.md) - Detailed step-by-step
- 📖 [API Documentation](API_DOCUMENTATION.md) - Backend API reference
- 📖 [Testing Guide](TESTING.md) - How to test your deployment
- 📖 [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions

---

**Ready to deploy?** Run `make full-deploy` and grab a coffee ☕ (takes ~30 minutes)

