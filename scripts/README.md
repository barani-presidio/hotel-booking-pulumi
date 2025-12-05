# Deployment Scripts

This directory contains automated deployment scripts for the Hotel Booking System.

## Scripts Overview

### 1. verify-setup.sh
**Purpose**: Verify all prerequisites are installed

**Usage**:
```bash
./scripts/verify-setup.sh
```

**Checks**:
- Node.js version
- Docker installation
- kubectl installation
- AWS CLI installation
- Pulumi CLI installation
- AWS credentials configuration

**When to use**: Before any deployment

---

### 2. setup-infrastructure.sh
**Purpose**: Create AWS infrastructure using Pulumi

**Usage**:
```bash
./scripts/setup-infrastructure.sh
```

**What it does**:
1. Installs Pulumi dependencies
2. Initializes Pulumi stack
3. Creates VPC
4. Creates EKS cluster
5. Creates ECR repositories
6. Exports kubeconfig
7. Saves cluster details

**Duration**: ~15 minutes

**Prerequisites**:
- AWS CLI configured
- Pulumi CLI installed

**Outputs**:
- `kubeconfig-eks-cluster-pulumi.json`
- `cluster-details.json`

---

### 3. build-and-push.sh
**Purpose**: Build Docker images and push to ECR

**Usage**:
```bash
./scripts/build-and-push.sh
```

**What it does**:
1. Gets AWS account ID and region
2. Logs into ECR
3. Builds backend Docker image
4. Pushes backend to ECR
5. Builds frontend Docker image
6. Pushes frontend to ECR

**Duration**: ~5-10 minutes

**Prerequisites**:
- Docker running
- AWS CLI configured
- ECR repositories created

**Environment Variables**:
- `AWS_ACCOUNT_ID` (auto-detected)
- `AWS_REGION` (auto-detected or defaults to us-east-1)

---

### 4. deploy-k8s.sh
**Purpose**: Deploy application to Kubernetes

**Usage**:
```bash
./scripts/deploy-k8s.sh
```

**What it does**:
1. Updates kubeconfig
2. Applies Kubernetes secrets
3. Deploys MongoDB
4. Deploys backend
5. Deploys frontend
6. Shows LoadBalancer URL

**Duration**: ~5 minutes

**Prerequisites**:
- EKS cluster created
- Docker images in ECR
- kubectl installed

**Outputs**:
- LoadBalancer hostname

---

### 5. full-deploy.sh
**Purpose**: Complete end-to-end deployment

**Usage**:
```bash
./scripts/full-deploy.sh
```

**What it does**:
1. Runs setup-infrastructure.sh
2. Runs build-and-push.sh
3. Runs deploy-k8s.sh

**Duration**: ~20-25 minutes

**Prerequisites**:
- All tools installed
- AWS credentials configured

**This is the recommended script for first-time deployment**

---

## Usage Examples

### First Time Deployment
```bash
# 1. Verify prerequisites
./scripts/verify-setup.sh

# 2. Run full deployment
./scripts/full-deploy.sh
```

### Update Application
```bash
# Build and push new images
./scripts/build-and-push.sh

# Restart deployments
kubectl rollout restart deployment/backend
kubectl rollout restart deployment/frontend
```

### Rebuild Infrastructure
```bash
# Destroy existing
cd infrastructure && pulumi destroy

# Create new
./scripts/setup-infrastructure.sh
```

### Deploy Only
```bash
# If infrastructure and images already exist
./scripts/deploy-k8s.sh
```

## Environment Variables

All scripts use these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| AWS_ACCOUNT_ID | AWS account ID | Auto-detected |
| AWS_REGION | AWS region | us-east-1 |
| CLUSTER_NAME | EKS cluster name | eks-cluster-pulumi |

## Error Handling

All scripts:
- Use `set -e` to exit on error
- Provide descriptive error messages
- Can be safely re-run

## Troubleshooting

### Script Permission Denied
```bash
chmod +x scripts/*.sh
```

### AWS Credentials Not Found
```bash
aws configure
```

### Docker Not Running
```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

### Pulumi Login Required
```bash
pulumi login
```

### ECR Login Failed
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
```

## Script Dependencies

```
verify-setup.sh (no dependencies)
    ↓
setup-infrastructure.sh
    ↓
build-and-push.sh
    ↓
deploy-k8s.sh
```

Or use `full-deploy.sh` which runs all in sequence.

## Logs and Output

Scripts output to stdout. To save logs:

```bash
./scripts/full-deploy.sh 2>&1 | tee deployment.log
```

## Cleanup

To remove all resources:

```bash
# Delete Kubernetes resources
kubectl delete -f k8s/

# Destroy infrastructure
cd infrastructure
pulumi destroy
```

## Best Practices

1. Always run `verify-setup.sh` first
2. Use `full-deploy.sh` for initial deployment
3. Save deployment logs
4. Test locally with Docker Compose before AWS deployment
5. Review Pulumi preview before applying changes
6. Keep scripts executable: `chmod +x scripts/*.sh`

## Support

For issues with scripts:
1. Check script output for error messages
2. Verify prerequisites with `verify-setup.sh`
3. Review [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
4. Check AWS CloudFormation console for infrastructure issues
5. Check kubectl logs for deployment issues
