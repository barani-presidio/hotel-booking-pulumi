# Deployment Guide - Hotel Booking System

## Prerequisites

1. **AWS CLI** - Configured with appropriate credentials
   ```bash
   aws configure
   ```

2. **Docker** - For building container images
   ```bash
   docker --version
   ```

3. **kubectl** - Kubernetes command-line tool
   ```bash
   kubectl version --client
   ```

4. **Pulumi CLI** - Infrastructure as Code tool
   ```bash
   pulumi version
   ```

5. **Node.js 18+** - For running the application
   ```bash
   node --version
   ```

## Deployment Steps

### Option 1: Full Automated Deployment

Run the complete deployment script:

```bash
chmod +x scripts/*.sh
./scripts/full-deploy.sh
```

This will:
1. Create AWS infrastructure (VPC, EKS, ECR)
2. Build and push Docker images to ECR
3. Deploy application to Kubernetes

### Option 2: Step-by-Step Deployment

#### Step 1: Setup Infrastructure with Pulumi

```bash
cd infrastructure
npm install
pulumi login
pulumi stack init dev
pulumi up
cd ..
```

This creates:
- VPC with public/private subnets
- EKS cluster named `eks-cluster-pulumi`
- ECR repositories for backend and frontend
- MongoDB deployment in Kubernetes

#### Step 2: Build and Push Docker Images

```bash
# Get AWS credentials
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=$(aws configure get region)

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push backend
cd backend
docker build -t hotel-backend:latest .
docker tag hotel-backend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-backend:latest

# Build and push frontend
cd ../frontend
docker build -t hotel-frontend:latest .
docker tag hotel-frontend:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/hotel-frontend:latest
```

#### Step 3: Deploy to Kubernetes

```bash
# Update kubeconfig
aws eks update-kubeconfig --name eks-cluster-pulumi --region $AWS_REGION

# Create namespace
kubectl apply -f k8s/namespace.yaml

# Update image references in K8s manifests
sed -i "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/*.yaml
sed -i "s/\${AWS_REGION}/$AWS_REGION/g" k8s/*.yaml

# Apply Kubernetes manifests
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check deployment status
kubectl get pods -n hotel-booking
kubectl get services -n hotel-booking
```

#### Step 4: Access the Application

Get the LoadBalancer URL:

```bash
kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

Wait a few minutes for the LoadBalancer to be provisioned, then access the application at the provided URL.

All resources are deployed in the `hotel-booking` namespace for better organization and isolation.

## Local Development

### Using Docker Compose

```bash
# Create .env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend: http://localhost:5002
```

### Without Docker

```bash
# Start MongoDB
docker run -d -p 27017:27017 mongo:7

# Start backend
cd backend
npm install
npm start

# Start frontend (in another terminal)
cd frontend
npm install
npm start
```

## Monitoring and Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n hotel-booking
kubectl describe pod <pod-name> -n hotel-booking
kubectl logs <pod-name> -n hotel-booking
```

### Check Services
```bash
kubectl get svc -n hotel-booking
kubectl describe svc frontend -n hotel-booking
```

### Access MongoDB
```bash
kubectl exec -it <mongodb-pod-name> -n hotel-booking -- mongosh
```

### Scale Deployments
```bash
kubectl scale deployment backend --replicas=3 -n hotel-booking
kubectl scale deployment frontend --replicas=3 -n hotel-booking
```

### View All Resources in Namespace
```bash
kubectl get all -n hotel-booking
```

## Cleanup

### Delete Kubernetes Resources
```bash
# Delete all resources in namespace
kubectl delete namespace hotel-booking

# Or delete individual resources
kubectl delete -f k8s/
```

### Destroy Infrastructure
```bash
cd infrastructure
pulumi destroy
```

## Cluster Details

The cluster configuration is stored in `cluster-details.json` with the following structure:

```json
{
    "cluster": {
        "name": "eks-cluster-pulumi",
        "version": "1.34",
        "status": "ACTIVE"
    }
}
```

## Security Notes

1. **Change JWT Secret**: Update the JWT secret in `k8s/secrets.yaml` before production deployment
2. **Use AWS Secrets Manager**: For production, integrate with AWS Secrets Manager
3. **Enable HTTPS**: Configure SSL/TLS certificates for the LoadBalancer
4. **Network Policies**: Implement Kubernetes network policies for pod-to-pod communication
5. **IAM Roles**: Use IRSA (IAM Roles for Service Accounts) for AWS service access

## Cost Optimization

- Use spot instances for worker nodes
- Enable cluster autoscaler
- Set resource limits on pods
- Use ECR lifecycle policies to clean old images
