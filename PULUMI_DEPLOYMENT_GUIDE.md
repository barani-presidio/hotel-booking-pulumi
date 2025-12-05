# Complete Pulumi Deployment Guide - AWS ECR & EKS

This guide walks you through deploying the entire Hotel Booking System to AWS ECR and EKS using Pulumi.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Step 1: Deploy Infrastructure with Pulumi](#step-1-deploy-infrastructure-with-pulumi)
4. [Step 2: Build and Push Docker Images to ECR](#step-2-build-and-push-docker-images-to-ecr)
5. [Step 3: Deploy Application to EKS](#step-3-deploy-application-to-eks)
6. [Step 4: Verify Deployment](#step-4-verify-deployment)
7. [Access Your Application](#access-your-application)
8. [Troubleshooting](#troubleshooting)
9. [Cleanup](#cleanup)

---

## Prerequisites

Before starting, ensure you have the following installed and configured:

### 1. Install Required Tools

```bash
# Node.js 18+ (for running the application)
node --version  # Should be v18 or higher

# Docker (for building images)
docker --version

# kubectl (for Kubernetes management)
kubectl version --client

# AWS CLI (for AWS operations)
aws --version

# Pulumi CLI (for infrastructure deployment)
pulumi version
```

**Install Pulumi if not installed:**
```bash
# macOS
brew install pulumi

# Linux
curl -fsSL https://get.pulumi.com | sh

# Windows
choco install pulumi
```

### 2. Configure AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Enter your:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Default output format (json)

# Verify AWS credentials
aws sts get-caller-identity
```

**Required AWS Permissions:**
- EC2 (VPC, Subnets, Security Groups)
- EKS (Create/Manage Clusters)
- ECR (Create Repositories, Push Images)
- IAM (Create Roles and Policies)
- Auto Scaling (for EKS node groups)

### 3. Verify Prerequisites Script

Run the verification script:

```bash
chmod +x scripts/verify-setup.sh
./scripts/verify-setup.sh
```

---

## Initial Setup

### 1. Clone/Navigate to Project Directory

```bash
cd /Users/barani.ramakrishnan/Projects/Kubernetes/pulumi
```

### 2. Set AWS Region (Optional)

If you want to use a specific region:

```bash
export AWS_REGION=us-east-1
aws configure set region $AWS_REGION
```

---

## Step 1: Deploy Infrastructure with Pulumi

This step creates:
- ✅ VPC with public/private subnets
- ✅ EKS cluster (`eks-cluster-pulumi`)
- ✅ ECR repositories (`hotel-backend`, `hotel-frontend`)
- ✅ MongoDB StatefulSet in Kubernetes
- ✅ Kubernetes namespace (`hotel-booking`)
- ✅ Application secrets

### Option A: Automated Script (Recommended)

```bash
chmod +x scripts/setup-infrastructure.sh
./scripts/setup-infrastructure.sh
```

### Option B: Manual Step-by-Step

#### 1.1 Navigate to Infrastructure Directory

```bash
cd infrastructure
```

#### 1.2 Install Dependencies

```bash
npm install
```

This installs:
- `@pulumi/pulumi`
- `@pulumi/aws`
- `@pulumi/awsx`
- `@pulumi/eks`
- `@pulumi/kubernetes`

#### 1.3 Login to Pulumi

```bash
# Login to Pulumi (choose your backend)
pulumi login

# Options:
# - file:// (local file backend)
# - s3:// (AWS S3 backend)
# - https://app.pulumi.com (Pulumi Cloud - recommended)
```

#### 1.4 Initialize Pulumi Stack

```bash
# Create a new stack (or select existing)
pulumi stack init dev

# Or select existing stack
pulumi stack select dev
```

#### 1.5 Configure Stack (Optional)

```bash
# Set AWS region
pulumi config set aws:region us-east-1

# View configuration
pulumi config
```

#### 1.6 Preview Infrastructure Changes

```bash
# Preview what will be created
pulumi preview
```

**Expected Output:**
- VPC creation
- EKS cluster creation
- ECR repositories creation
- Kubernetes resources (MongoDB, Namespace, Secrets)

#### 1.7 Deploy Infrastructure

```bash
# Deploy infrastructure (takes 15-20 minutes)
pulumi up

# Type 'yes' when prompted, or use --yes flag
pulumi up --yes
```

**⏱️ This takes approximately 15-20 minutes** as it creates:
- VPC and networking components
- EKS cluster with node groups
- ECR repositories

**Expected Output:**
```
Updating (dev):
     Type                              Name                              Status
 +   pulumi:pulumi:Stack               hotel-booking-infrastructure-dev  created
 +   ├─ awsx:ec2:Vpc                   hotel-booking-vpc                 created
 +   ├─ aws:ecr:Repository             hotel-backend                     created
 +   ├─ aws:ecr:Repository             hotel-frontend                    created
 +   ├─ eks:Cluster                    eks-cluster-pulumi                created
 +   ├─ kubernetes:core:v1:Namespace    hotel-booking                     created
 +   ├─ kubernetes:core:v1:Secret      app-secrets                       created
 +   └─ ... (MongoDB StatefulSet and Service)

Outputs:
    clusterName      : "eks-cluster-pulumi"
    clusterEndpoint  : "https://xxx.xxx.xxx.xxx"
    backendRepoUrl   : "123456789012.dkr.ecr.us-east-1.amazonaws.com/hotel-backend"
    frontendRepoUrl  : "123456789012.dkr.ecr.us-east-1.amazonaws.com/hotel-frontend"
    kubeconfig       : "[kubeconfig content]"
```

#### 1.8 Save Cluster Configuration

```bash
# Export kubeconfig
pulumi stack output kubeconfig > ../kubeconfig-eks-cluster-pulumi.json

# Save cluster details
cat > ../cluster-details.json <<EOF
{
    "cluster": {
        "name": "$(pulumi stack output clusterName)",
        "endpoint": "$(pulumi stack output clusterEndpoint)",
        "version": "1.34"
    },
    "ecr": {
        "backendRepo": "$(pulumi stack output backendRepoUrl)",
        "frontendRepo": "$(pulumi stack output frontendRepoUrl)"
    }
}
EOF

cd ..
```

#### 1.9 Configure kubectl

```bash
# Get AWS account ID and region
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

# Update kubeconfig to connect to EKS cluster
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Verify connection
kubectl get nodes
```

**Expected Output:**
```
NAME                          STATUS   ROLES    AGE   VERSION
ip-10-0-1-xxx.ec2.internal   Ready    <none>   5m    v1.34.x
ip-10-0-2-xxx.ec2.internal   Ready    <none>   5m    v1.34.x
```

---

## Step 2: Build and Push Docker Images to ECR

This step:
- ✅ Builds Docker images for backend and frontend
- ✅ Tags images with ECR repository URLs
- ✅ Pushes images to ECR

### Option A: Automated Script (Recommended)

```bash
chmod +x scripts/build-and-push.sh
./scripts/build-and-push.sh
```

### Option B: Manual Step-by-Step

#### 2.1 Get AWS Account and Region

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

echo "AWS Account ID: $AWS_ACCOUNT_ID"
echo "AWS Region: $AWS_REGION"
```

#### 2.2 Login to ECR

```bash
# Get ECR login token
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

**Expected Output:**
```
Login Succeeded
```

#### 2.3 Build and Push Backend Image

```bash
# Build backend image
cd backend
docker build -t hotel-backend:latest .

# Tag for ECR
docker tag hotel-backend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest

cd ..
```

#### 2.4 Build and Push Frontend Image

```bash
# Build frontend image
cd frontend
docker build -t hotel-frontend:latest .

# Tag for ECR
docker tag hotel-frontend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest

# Push to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest

cd ..
```

#### 2.5 Verify Images in ECR

```bash
# List backend images
aws ecr describe-images \
  --repository-name hotel-backend \
  --region $AWS_REGION

# List frontend images
aws ecr describe-images \
  --repository-name hotel-frontend \
  --region $AWS_REGION
```

**Expected Output:**
```json
{
    "imageDetails": [
        {
            "registryId": "123456789012",
            "repositoryName": "hotel-backend",
            "imageTags": ["latest"],
            "imagePushedAt": "2024-01-20T10:30:00Z",
            "imageSizeInBytes": 123456789
        }
    ]
}
```

---

## Step 3: Deploy Application to EKS

This step deploys:
- ✅ Backend deployment (2 replicas)
- ✅ Frontend deployment (2 replicas)
- ✅ Kubernetes services (ClusterIP for backend, LoadBalancer for frontend)

### Option A: Automated Script (Recommended)

```bash
chmod +x scripts/deploy-k8s.sh
./scripts/deploy-k8s.sh
```

### Option B: Manual Step-by-Step

#### 3.1 Set Environment Variables

```bash
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)
```

#### 3.2 Update kubeconfig

```bash
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION
```

#### 3.3 Create Namespace (if not created by Pulumi)

```bash
kubectl apply -f k8s/namespace.yaml
```

#### 3.4 Update Kubernetes Manifests with ECR URLs

The deployment files use placeholders `${AWS_ACCOUNT_ID}` and `${AWS_REGION}`. Update them:

**For macOS/Linux:**
```bash
# Update backend deployment
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/backend-deployment.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/backend-deployment.yaml

# Update frontend deployment
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/frontend-deployment.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/frontend-deployment.yaml
```

**For Windows (PowerShell):**
```powershell
# Update backend deployment
(Get-Content k8s/backend-deployment.yaml) -replace '\$\{AWS_ACCOUNT_ID\}', $env:AWS_ACCOUNT_ID | Set-Content k8s/backend-deployment.yaml
(Get-Content k8s/backend-deployment.yaml) -replace '\$\{AWS_REGION\}', $env:AWS_REGION | Set-Content k8s/backend-deployment.yaml

# Update frontend deployment
(Get-Content k8s/frontend-deployment.yaml) -replace '\$\{AWS_ACCOUNT_ID\}', $env:AWS_ACCOUNT_ID | Set-Content k8s/frontend-deployment.yaml
(Get-Content k8s/frontend-deployment.yaml) -replace '\$\{AWS_REGION\}', $env:AWS_REGION | Set-Content k8s/frontend-deployment.yaml
```

**Verify the changes:**
```bash
# Check backend image URL
grep "image:" k8s/backend-deployment.yaml

# Should show:
# image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/hotel-backend:latest
```

#### 3.5 Apply Kubernetes Manifests

```bash
# Apply secrets (if not already created by Pulumi)
kubectl apply -f k8s/secrets.yaml

# Deploy MongoDB (if not already deployed by Pulumi)
kubectl apply -f k8s/mongodb-deployment.yaml

# Wait for MongoDB to be ready
kubectl rollout status statefulset/mongodb -n hotel-booking --timeout=300s

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
```

#### 3.6 Verify Deployments

```bash
# Check all pods
kubectl get pods -n hotel-booking

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
# backend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
# frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
# frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
# mongodb-0                    1/1     Running   0          5m

# Check services
kubectl get svc -n hotel-booking

# Expected output:
# NAME       TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
# backend    ClusterIP      10.100.x.x      <none>          5000/TCP       2m
# frontend   LoadBalancer   10.100.x.x      xxx.elb...      80:xxxxx/TCP   1m
# mongodb    ClusterIP      None            <none>          27017/TCP      5m
```

---

## Step 4: Verify Deployment

### 4.1 Check Pod Status

```bash
# Get all resources
kubectl get all -n hotel-booking

# Check pod logs
kubectl logs -l app=backend -n hotel-booking --tail=50
kubectl logs -l app=frontend -n hotel-booking --tail=50
kubectl logs -l app=mongodb -n hotel-booking --tail=50
```

### 4.2 Test Backend API

```bash
# Port-forward backend service
kubectl port-forward svc/backend 5000:5000 -n hotel-booking

# In another terminal, test the API
curl http://localhost:5000/health

# Expected output:
# {"status":"healthy","timestamp":"2024-01-20T10:30:00.000Z"}
```

### 4.3 Check MongoDB Connection

```bash
# Connect to MongoDB pod
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh

# In MongoDB shell:
# use hotel-booking
# show collections
# exit
```

---

## Access Your Application

### Get LoadBalancer URL

```bash
# Get the LoadBalancer hostname
kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'

# Or get full service details
kubectl get svc frontend -n hotel-booking
```

**Note:** It may take 2-5 minutes for the LoadBalancer to be provisioned and DNS to propagate.

### Access the Application

Once the LoadBalancer is ready:

```bash
# Get the URL
LB_URL=$(kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://$LB_URL"

# Open in browser (macOS)
open http://$LB_URL

# Or test with curl
curl http://$LB_URL
```

### Test API Endpoints

```bash
# Health check
curl http://$LB_URL/api/health

# Get hotels
curl http://$LB_URL/api/hotels

# Register user
curl -X POST http://$LB_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting

### Issue: Pulumi deployment fails

**Solution:**
```bash
# Check Pulumi logs
pulumi stack --show-urns

# Check AWS console for resource creation status
# Verify IAM permissions

# Retry deployment
pulumi up --yes
```

### Issue: Cannot push to ECR

**Solution:**
```bash
# Re-login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Verify repository exists
aws ecr describe-repositories --region $AWS_REGION
```

### Issue: Pods not starting

**Solution:**
```bash
# Check pod status
kubectl describe pod <pod-name> -n hotel-booking

# Check events
kubectl get events -n hotel-booking --sort-by='.lastTimestamp'

# Check logs
kubectl logs <pod-name> -n hotel-booking

# Common issues:
# - Image pull errors: Check ECR image URL and permissions
# - Resource limits: Check pod resource requests/limits
# - MongoDB connection: Verify MongoDB service is running
```

### Issue: LoadBalancer not getting external IP

**Solution:**
```bash
# Check LoadBalancer status
kubectl describe svc frontend -n hotel-booking

# Check AWS console for LoadBalancer creation
# Wait 5-10 minutes for provisioning

# Verify security groups allow traffic
```

### Issue: Cannot connect to EKS cluster

**Solution:**
```bash
# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Verify cluster exists
aws eks describe-cluster --name eks-cluster-pulumi --region $AWS_REGION

# Check IAM permissions
aws sts get-caller-identity
```

---

## Cleanup

### Delete Kubernetes Resources

```bash
# Delete all resources in namespace
kubectl delete namespace hotel-booking

# Or delete individual resources
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/mongodb-deployment.yaml
kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/namespace.yaml
```

### Delete Docker Images from ECR

```bash
# Delete backend images
aws ecr batch-delete-image \
  --repository-name hotel-backend \
  --image-ids imageTag=latest \
  --region $AWS_REGION

# Delete frontend images
aws ecr batch-delete-image \
  --repository-name hotel-frontend \
  --image-ids imageTag=latest \
  --region $AWS_REGION

# Delete repositories (optional)
aws ecr delete-repository \
  --repository-name hotel-backend \
  --force \
  --region $AWS_REGION

aws ecr delete-repository \
  --repository-name hotel-frontend \
  --force \
  --region $AWS_REGION
```

### Destroy Pulumi Infrastructure

```bash
cd infrastructure

# Preview destruction
pulumi destroy --yes

# Confirm destruction (this deletes ALL resources)
# Type 'yes' when prompted

cd ..
```

**⚠️ Warning:** This will delete:
- EKS cluster
- VPC and all networking components
- ECR repositories (if not deleted separately)
- All Kubernetes resources

---

## Quick Reference Commands

### Infrastructure Management

```bash
# Deploy infrastructure
cd infrastructure && pulumi up --yes && cd ..

# View infrastructure outputs
cd infrastructure && pulumi stack output && cd ..

# Destroy infrastructure
cd infrastructure && pulumi destroy --yes && cd ..
```

### Docker & ECR

```bash
# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push (automated)
./scripts/build-and-push.sh
```

### Kubernetes

```bash
# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Deploy to Kubernetes
./scripts/deploy-k8s.sh

# Check status
kubectl get all -n hotel-booking

# View logs
kubectl logs -l app=backend -n hotel-booking -f
```

### Full Deployment

```bash
# Complete deployment (all steps)
./scripts/full-deploy.sh

# Or using Makefile
make full-deploy
```

---

## Cost Estimation

**Monthly AWS Costs (Approximate):**

- **EKS Cluster**: ~$73/month (control plane)
- **EC2 Instances** (t3.medium x2): ~$60/month
- **Load Balancer** (Network Load Balancer): ~$20/month
- **ECR Storage**: ~$1/month (for images)
- **Data Transfer**: Variable
- **Total**: ~$154/month

**Note:** Costs vary by region and usage. Some services may be covered by AWS Free Tier for new accounts.

---

## Next Steps

1. **Set up CI/CD**: Automate deployments with GitHub Actions
2. **Configure SSL/TLS**: Add HTTPS with AWS Certificate Manager
3. **Set up monitoring**: Add Prometheus and Grafana
4. **Implement autoscaling**: Configure HPA (Horizontal Pod Autoscaler)
5. **Add backup**: Set up MongoDB backups
6. **Security hardening**: Implement network policies, RBAC, and secrets management

---

## Additional Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [AWS EKS Documentation](https://docs.aws.amazon.com/eks/)
- [AWS ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

---

**Need Help?** Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file or review logs with `kubectl logs`.

