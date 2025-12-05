# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Hotel Booking System.

## Namespace

All resources are deployed in the `hotel-booking` namespace for better organization and isolation.

## Deployment Order

Apply manifests in this order:

1. **namespace.yaml** - Creates the hotel-booking namespace
2. **secrets.yaml** - Creates application secrets
3. **mongodb-deployment.yaml** - Deploys MongoDB with persistent storage
4. **backend-deployment.yaml** - Deploys the Node.js backend API
5. **frontend-deployment.yaml** - Deploys the React frontend with LoadBalancer

## Quick Deploy

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy all resources
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Namespace Commands

```bash
# View all resources in namespace
kubectl get all -n hotel-booking

# View pods
kubectl get pods -n hotel-booking

# View services
kubectl get svc -n hotel-booking

# View logs
kubectl logs -f deployment/backend -n hotel-booking

# Describe resources
kubectl describe pod <pod-name> -n hotel-booking

# Execute commands in pod
kubectl exec -it <pod-name> -n hotel-booking -- /bin/sh

# Port forward
kubectl port-forward svc/backend 5000:5000 -n hotel-booking
```

## Resource Details

### namespace.yaml
- Creates the `hotel-booking` namespace
- Labels for organization

### secrets.yaml
- JWT secret for authentication
- Stored as Kubernetes Secret
- **Important**: Change the JWT secret before production deployment

### mongodb-deployment.yaml
- MongoDB 7 StatefulSet (not Deployment)
- VolumeClaimTemplate for automatic PVC creation (5Gi)
- Headless service for stable network identity
- Resource limits: 512Mi memory, 500m CPU
- Accessible at: `mongodb-0.mongodb.hotel-booking.svc.cluster.local:27017`
- Or simply: `mongodb.hotel-booking.svc.cluster.local:27017`

### backend-deployment.yaml
- Node.js Express API
- 2 replicas for high availability
- Resource limits: 512Mi memory, 500m CPU
- Environment variables:
  - MONGODB_URI: Full DNS name with namespace
  - JWT_SECRET: From Kubernetes secret
  - NODE_ENV: production
- ClusterIP service on port 5000

### frontend-deployment.yaml
- React application with Nginx
- 2 replicas for high availability
- Resource limits: 256Mi memory, 200m CPU
- LoadBalancer service on port 80
- Network Load Balancer (NLB) annotation for AWS

## Environment Variables

Backend deployment uses these environment variables:

```yaml
- name: MONGODB_URI
  value: "mongodb://mongodb.hotel-booking.svc.cluster.local:27017/hotel-booking"
- name: JWT_SECRET
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: jwt-secret
- name: NODE_ENV
  value: "production"
```

## Service DNS Names

Within the cluster, services are accessible via:

- MongoDB: `mongodb.hotel-booking.svc.cluster.local:27017`
- Backend: `backend.hotel-booking.svc.cluster.local:5000`
- Frontend: `frontend.hotel-booking.svc.cluster.local:80`

## Resource Limits

### Backend
- Requests: 256Mi memory, 250m CPU
- Limits: 512Mi memory, 500m CPU

### Frontend
- Requests: 128Mi memory, 100m CPU
- Limits: 256Mi memory, 200m CPU

## Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n hotel-booking

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n hotel-booking

# Autoscaling
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10 -n hotel-booking
```

## Updating Deployments

```bash
# Update image
kubectl set image deployment/backend backend=<new-image> -n hotel-booking

# Rolling restart
kubectl rollout restart deployment/backend -n hotel-booking

# Check rollout status
kubectl rollout status deployment/backend -n hotel-booking

# Rollback
kubectl rollout undo deployment/backend -n hotel-booking
```

## Troubleshooting

```bash
# Check pod status
kubectl get pods -n hotel-booking

# View pod logs
kubectl logs <pod-name> -n hotel-booking

# View previous logs (if pod crashed)
kubectl logs <pod-name> --previous -n hotel-booking

# Describe pod for events
kubectl describe pod <pod-name> -n hotel-booking

# Check service endpoints
kubectl get endpoints -n hotel-booking

# Test connectivity
kubectl exec -it <backend-pod> -n hotel-booking -- nc -zv mongodb 27017
```

## Cleanup

```bash
# Delete all resources in namespace
kubectl delete namespace hotel-booking

# Or delete individual resources
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/mongodb-deployment.yaml
kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/namespace.yaml
```

## Security Notes

1. **Change JWT Secret**: Update `secrets.yaml` with a strong secret
2. **Use AWS Secrets Manager**: For production, integrate with AWS Secrets Manager
3. **Network Policies**: Consider adding network policies for pod-to-pod communication
4. **RBAC**: Implement Role-Based Access Control
5. **Pod Security**: Add security contexts and pod security policies

## Monitoring

```bash
# Resource usage
kubectl top pods -n hotel-booking
kubectl top nodes

# Events
kubectl get events -n hotel-booking --sort-by=.metadata.creationTimestamp

# Watch pods
kubectl get pods -n hotel-booking -w
```
