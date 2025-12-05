# Deployment Checklist

Use this checklist to ensure successful deployment of the Hotel Booking System.

## Pre-Deployment Checklist

### Prerequisites ✓
- [ ] Node.js 18+ installed
- [ ] Docker installed and running
- [ ] kubectl installed
- [ ] AWS CLI installed and configured
- [ ] Pulumi CLI installed
- [ ] AWS account with appropriate permissions
- [ ] Git repository cloned

### Verification
```bash
./scripts/verify-setup.sh
```

### AWS Configuration ✓
- [ ] AWS credentials configured (`aws configure`)
- [ ] AWS region set (default: us-east-1)
- [ ] IAM permissions verified
- [ ] AWS account ID noted

```bash
aws sts get-caller-identity
aws configure get region
```

### Project Setup ✓
- [ ] Dependencies installed (`make install`)
- [ ] Environment files created
  - [ ] `backend/.env` from `backend/.env.example`
  - [ ] `frontend/.env` from `frontend/.env.example`
- [ ] Scripts are executable (`chmod +x scripts/*.sh`)

## Local Development Checklist

### Docker Compose Testing ✓
- [ ] Docker daemon is running
- [ ] `docker-compose up --build` executed successfully
- [ ] Frontend accessible at http://localhost:3001
- [ ] Backend API accessible at http://localhost:5002
- [ ] MongoDB accessible at localhost:27018
- [ ] Health check passes: `curl http://localhost:5002/health`

### Application Testing ✓
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can view hotel list
- [ ] Can view hotel details
- [ ] Can create booking
- [ ] No console errors in browser

## AWS Infrastructure Deployment

### Pulumi Setup ✓
- [ ] Pulumi logged in (`pulumi login`)
- [ ] Stack initialized (`pulumi stack init dev`)
- [ ] AWS region configured
- [ ] Review Pulumi preview (`pulumi preview`)

### Infrastructure Creation ✓
```bash
cd infrastructure
pulumi up
```

- [ ] VPC created successfully
- [ ] EKS cluster created (eks-cluster-pulumi)
- [ ] ECR repositories created
  - [ ] hotel-backend repository
  - [ ] hotel-frontend repository
- [ ] Kubeconfig exported
- [ ] Cluster details saved to `cluster-details.json`

### Verification
```bash
aws eks describe-cluster --name eks-cluster-pulumi
aws ecr describe-repositories
```

## Container Image Deployment

### Build and Push ✓
```bash
./scripts/build-and-push.sh
```

- [ ] Backend image built successfully
- [ ] Frontend image built successfully
- [ ] ECR login successful
- [ ] Backend image pushed to ECR
- [ ] Frontend image pushed to ECR

### Verification
```bash
aws ecr describe-images --repository-name hotel-backend
aws ecr describe-images --repository-name hotel-frontend
```

## Kubernetes Deployment

### Cluster Access ✓
```bash
aws eks update-kubeconfig --name eks-cluster-pulumi
```

- [ ] Kubeconfig updated
- [ ] Can access cluster: `kubectl cluster-info`
- [ ] Nodes are ready: `kubectl get nodes`

### Deploy Application ✓
```bash
./scripts/deploy-k8s.sh
```

- [ ] Secrets created
- [ ] MongoDB deployed
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] All pods running: `kubectl get pods`
- [ ] All services created: `kubectl get svc`

### Pod Status ✓
```bash
kubectl get pods
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
mongodb-xxx                 1/1     Running   0          5m
backend-xxx                 1/1     Running   0          3m
backend-yyy                 1/1     Running   0          3m
frontend-xxx                1/1     Running   0          2m
frontend-yyy                1/1     Running   0          2m
```

- [ ] All pods in "Running" status
- [ ] No pods in "CrashLoopBackOff"
- [ ] No pods in "ImagePullBackOff"

### Service Status ✓
```bash
kubectl get svc
```

- [ ] mongodb service (ClusterIP)
- [ ] backend service (ClusterIP)
- [ ] frontend service (LoadBalancer)
- [ ] LoadBalancer has external IP/hostname

## Post-Deployment Verification

### Application Access ✓
```bash
LB_URL=$(kubectl get svc frontend -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "Application URL: http://$LB_URL"
```

- [ ] LoadBalancer URL obtained
- [ ] Can access frontend (may take 5-10 minutes for DNS)
- [ ] Frontend loads without errors
- [ ] Can navigate between pages

### API Testing ✓
```bash
curl http://$LB_URL/api/health
```

- [ ] Health endpoint responds
- [ ] Can register user via API
- [ ] Can login via API
- [ ] Can fetch hotels via API

### Database Testing ✓
```bash
kubectl exec -it <mongodb-pod> -- mongosh
```

- [ ] Can connect to MongoDB
- [ ] Database "hotel-booking" exists
- [ ] Collections created (users, hotels, bookings)

### Logs Check ✓
```bash
kubectl logs -l app=backend
kubectl logs -l app=frontend
kubectl logs -l app=mongodb
```

- [ ] No critical errors in backend logs
- [ ] No critical errors in frontend logs
- [ ] MongoDB started successfully

## Security Checklist

### Secrets ✓
- [ ] JWT secret changed from default
- [ ] Secrets stored in Kubernetes secrets
- [ ] No secrets in code or logs
- [ ] Environment variables properly set

### Network ✓
- [ ] VPC properly configured
- [ ] Security groups configured
- [ ] Only necessary ports exposed
- [ ] LoadBalancer accessible

### Access Control ✓
- [ ] IAM roles properly configured
- [ ] Service accounts created
- [ ] RBAC policies in place

## Performance Checklist

### Scaling ✓
- [ ] Backend replicas: 2
- [ ] Frontend replicas: 2
- [ ] Resource limits set
- [ ] Resource requests set

### Monitoring ✓
```bash
kubectl top nodes
kubectl top pods
```

- [ ] Node resource usage acceptable
- [ ] Pod resource usage acceptable
- [ ] No memory leaks detected

## Documentation Checklist

### Files Created ✓
- [ ] cluster-details.json updated
- [ ] Kubeconfig saved
- [ ] Deployment notes documented
- [ ] Access URLs documented

### Team Communication ✓
- [ ] Deployment completed notification sent
- [ ] Access URLs shared
- [ ] Credentials shared securely
- [ ] Documentation links shared

## Rollback Plan

### If Deployment Fails ✓
```bash
# Rollback Kubernetes
kubectl rollout undo deployment/backend
kubectl rollout undo deployment/frontend

# Or destroy and redeploy
kubectl delete -f k8s/
cd infrastructure && pulumi destroy
```

- [ ] Rollback procedure documented
- [ ] Backup of previous version available
- [ ] Team notified of rollback

## Final Verification

### Complete System Test ✓
1. [ ] Open application in browser
2. [ ] Register new user
3. [ ] Login successfully
4. [ ] Browse hotels
5. [ ] View hotel details
6. [ ] Create booking
7. [ ] Verify booking in database
8. [ ] Logout and login again
9. [ ] Check all pages load correctly
10. [ ] No errors in browser console

### Performance Test ✓
```bash
ab -n 100 -c 10 http://$LB_URL/
```

- [ ] Response time acceptable
- [ ] No errors under load
- [ ] All requests successful

### Documentation ✓
- [ ] README.md reviewed
- [ ] DEPLOYMENT.md followed
- [ ] TROUBLESHOOTING.md available
- [ ] Team trained on access

## Post-Deployment Tasks

### Monitoring Setup (Optional) ✓
- [ ] Prometheus installed
- [ ] Grafana configured
- [ ] Alerts configured
- [ ] Dashboards created

### Backup Setup (Optional) ✓
- [ ] MongoDB backup configured
- [ ] Backup schedule set
- [ ] Restore procedure tested

### SSL/TLS Setup (Optional) ✓
- [ ] Certificate obtained
- [ ] Ingress configured
- [ ] HTTPS enabled
- [ ] HTTP to HTTPS redirect

### Custom Domain (Optional) ✓
- [ ] Domain purchased
- [ ] Route53 configured
- [ ] DNS records created
- [ ] Domain accessible

## Sign-Off

- [ ] All checklist items completed
- [ ] Application accessible and functional
- [ ] Team notified
- [ ] Documentation updated
- [ ] Deployment successful ✅

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Cluster Name**: eks-cluster-pulumi
**Application URL**: _______________
**Notes**: _______________
