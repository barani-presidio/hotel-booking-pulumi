# Troubleshooting Guide

## Common Issues and Solutions

### 1. Pulumi Deployment Failures

**Issue**: `pulumi up` fails with authentication error

**Solution**:
```bash
# Login to Pulumi
pulumi login

# Or use local backend
pulumi login --local

# Verify AWS credentials
aws sts get-caller-identity
```

**Issue**: EKS cluster creation timeout

**Solution**:
```bash
# Increase timeout in Pulumi config
pulumi config set aws:region us-east-1
pulumi config set eks:timeout 30m

# Or manually check CloudFormation
aws cloudformation describe-stacks --region us-east-1
```

### 2. Docker Build Issues

**Issue**: Docker build fails with "no space left on device"

**Solution**:
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

**Issue**: Cannot connect to Docker daemon

**Solution**:
```bash
# Start Docker service
sudo systemctl start docker

# Or on Mac
open -a Docker
```

### 3. ECR Push Failures

**Issue**: "no basic auth credentials"

**Solution**:
```bash
# Re-authenticate with ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com
```

**Issue**: Repository does not exist

**Solution**:
```bash
# Create ECR repositories
aws ecr create-repository --repository-name hotel-backend
aws ecr create-repository --repository-name hotel-frontend
```

### 4. Kubernetes Deployment Issues

**Issue**: Pods stuck in "ImagePullBackOff"

**Solution**:
```bash
# Check image name and tag
kubectl describe pod <pod-name>

# Verify ECR repository
aws ecr describe-images --repository-name hotel-backend

# Check service account permissions
kubectl get serviceaccount
```

**Issue**: Pods in "CrashLoopBackOff"

**Solution**:
```bash
# Check logs
kubectl logs <pod-name>

# Check previous logs
kubectl logs <pod-name> --previous

# Describe pod for events
kubectl describe pod <pod-name>
```

**Issue**: MongoDB connection refused

**Solution**:
```bash
# Check MongoDB service
kubectl get svc mongodb

# Test connectivity from backend pod
kubectl exec -it <backend-pod> -- nc -zv mongodb 27017

# Check MongoDB logs
kubectl logs <mongodb-pod>
```

### 5. LoadBalancer Issues

**Issue**: LoadBalancer stuck in "Pending"

**Solution**:
```bash
# Check service events
kubectl describe svc frontend

# Verify AWS Load Balancer Controller
kubectl get pods -n kube-system | grep aws-load-balancer

# Check security groups
aws ec2 describe-security-groups
```

**Issue**: Cannot access LoadBalancer URL

**Solution**:
```bash
# Wait for DNS propagation (5-10 minutes)
# Check LoadBalancer status
aws elb describe-load-balancers

# Verify security group rules
kubectl get svc frontend -o yaml
```

### 6. Application Issues

**Issue**: Backend API returns 500 errors

**Solution**:
```bash
# Check backend logs
kubectl logs -f deployment/backend

# Verify environment variables
kubectl exec <backend-pod> -- env | grep MONGODB

# Test MongoDB connection
kubectl exec -it <mongodb-pod> -- mongosh
```

**Issue**: Frontend cannot connect to backend

**Solution**:
```bash
# Check nginx configuration
kubectl exec <frontend-pod> -- cat /etc/nginx/conf.d/default.conf

# Verify backend service
kubectl get svc backend

# Check CORS settings in backend
```

### 7. Performance Issues

**Issue**: Slow response times

**Solution**:
```bash
# Scale deployments
kubectl scale deployment backend --replicas=3
kubectl scale deployment frontend --replicas=3

# Check resource usage
kubectl top pods
kubectl top nodes

# Add resource limits
kubectl set resources deployment backend --limits=cpu=500m,memory=512Mi
```

### 8. Cleanup Issues

**Issue**: `pulumi destroy` fails

**Solution**:
```bash
# Force destroy
pulumi destroy --force

# Manually delete resources
aws eks delete-cluster --name eks-cluster-pulumi
aws ecr delete-repository --repository-name hotel-backend --force
aws ecr delete-repository --repository-name hotel-frontend --force
```

## Debugging Commands

```bash
# Get all resources
kubectl get all

# Check cluster info
kubectl cluster-info

# View events
kubectl get events --sort-by=.metadata.creationTimestamp

# Check node status
kubectl get nodes
kubectl describe node <node-name>

# Port forward for local testing
kubectl port-forward svc/backend 5000:5000
kubectl port-forward svc/frontend 8080:80

# Execute commands in pod
kubectl exec -it <pod-name> -- /bin/sh

# Copy files from pod
kubectl cp <pod-name>:/path/to/file ./local-file
```

## Getting Help

1. Check logs: `kubectl logs <pod-name>`
2. Describe resource: `kubectl describe <resource-type> <resource-name>`
3. Check events: `kubectl get events`
4. Review documentation: See DEPLOYMENT.md
5. Verify prerequisites: `./scripts/verify-setup.sh`
