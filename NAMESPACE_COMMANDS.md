# Kubernetes Namespace Quick Reference

## Essential Commands

All commands use the `hotel-booking` namespace.

### View Resources
```bash
# All resources
kubectl get all -n hotel-booking

# Pods
kubectl get pods -n hotel-booking

# Services
kubectl get svc -n hotel-booking

# Deployments
kubectl get deployments -n hotel-booking

# Secrets
kubectl get secrets -n hotel-booking

# PVCs
kubectl get pvc -n hotel-booking
```

### Logs
```bash
# Backend logs
kubectl logs -f deployment/backend -n hotel-booking

# Frontend logs
kubectl logs -f deployment/frontend -n hotel-booking

# MongoDB logs
kubectl logs -f deployment/mongodb -n hotel-booking

# Specific pod
kubectl logs <pod-name> -n hotel-booking

# Previous logs (if crashed)
kubectl logs <pod-name> --previous -n hotel-booking
```

### Describe Resources
```bash
# Pod details
kubectl describe pod <pod-name> -n hotel-booking

# Service details
kubectl describe svc frontend -n hotel-booking

# Deployment details
kubectl describe deployment backend -n hotel-booking
```

### Execute Commands
```bash
# Shell access
kubectl exec -it <pod-name> -n hotel-booking -- /bin/sh

# Run command
kubectl exec <pod-name> -n hotel-booking -- curl localhost:5000/health

# MongoDB shell (StatefulSet pod)
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh
```

### Port Forwarding
```bash
# Backend
kubectl port-forward svc/backend 5000:5000 -n hotel-booking

# Frontend
kubectl port-forward svc/frontend 8080:80 -n hotel-booking

# MongoDB
kubectl port-forward svc/mongodb 27017:27017 -n hotel-booking
```

### Scaling
```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n hotel-booking

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n hotel-booking

# Autoscale
kubectl autoscale deployment backend --cpu-percent=70 --min=2 --max=10 -n hotel-booking
```

### Updates
```bash
# Rolling restart
kubectl rollout restart deployment/backend -n hotel-booking
kubectl rollout restart deployment/frontend -n hotel-booking

# Check rollout status
kubectl rollout status deployment/backend -n hotel-booking

# Rollback
kubectl rollout undo deployment/backend -n hotel-booking

# Update image
kubectl set image deployment/backend backend=<new-image> -n hotel-booking
```

### Monitoring
```bash
# Resource usage
kubectl top pods -n hotel-booking
kubectl top nodes

# Events
kubectl get events -n hotel-booking --sort-by=.metadata.creationTimestamp

# Watch pods
kubectl get pods -n hotel-booking -w
```

### Troubleshooting
```bash
# Check pod status
kubectl get pods -n hotel-booking

# View pod events
kubectl describe pod <pod-name> -n hotel-booking

# Check service endpoints
kubectl get endpoints -n hotel-booking

# Test connectivity
kubectl exec -it <backend-pod> -n hotel-booking -- nc -zv mongodb 27017

# View logs with tail
kubectl logs --tail=100 -f deployment/backend -n hotel-booking
```

### Cleanup
```bash
# Delete namespace (removes all resources)
kubectl delete namespace hotel-booking

# Delete specific deployment
kubectl delete deployment backend -n hotel-booking

# Delete all resources from manifests
kubectl delete -f k8s/
```

## Service DNS Names

Within the cluster:
- MongoDB: `mongodb.hotel-booking.svc.cluster.local:27017`
- Backend: `backend.hotel-booking.svc.cluster.local:5000`
- Frontend: `frontend.hotel-booking.svc.cluster.local:80`

## Get LoadBalancer URL
```bash
kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Set Default Namespace (Optional)
```bash
# Set context to use hotel-booking namespace by default
kubectl config set-context --current --namespace=hotel-booking

# Now you can omit -n hotel-booking from commands
kubectl get pods
kubectl get svc
```

## Useful Aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kn='kubectl -n hotel-booking'
alias kgp='kubectl get pods -n hotel-booking'
alias kgs='kubectl get svc -n hotel-booking'
alias kl='kubectl logs -f -n hotel-booking'
alias kd='kubectl describe -n hotel-booking'
```

## Quick Deploy
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

## Quick Status Check
```bash
kubectl get all -n hotel-booking && \
kubectl get pvc -n hotel-booking && \
kubectl get secrets -n hotel-booking
```
