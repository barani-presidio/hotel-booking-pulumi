# Kubernetes Namespace Guide

## Overview

The Hotel Booking System uses a dedicated Kubernetes namespace called `hotel-booking` for better resource organization, isolation, and management.

## Why Use a Namespace?

1. **Organization**: Groups all related resources together
2. **Isolation**: Separates resources from other applications
3. **Resource Quotas**: Can set limits per namespace
4. **Access Control**: RBAC policies can be applied per namespace
5. **Easy Cleanup**: Delete entire namespace to remove all resources

## Namespace Details

**Name**: `hotel-booking`

**Labels**:
- `name: hotel-booking`
- `app: hotel-booking-system`

## Resources in Namespace

All application resources are deployed in the `hotel-booking` namespace:

### Deployments
- `mongodb` - MongoDB database (StatefulSet - 1 replica)
- `backend` - Node.js API (Deployment - 2 replicas)
- `frontend` - React application (Deployment - 2 replicas)

### Services
- `mongodb` - ClusterIP service (port 27017)
- `backend` - ClusterIP service (port 5000)
- `frontend` - LoadBalancer service (port 80)

### Storage
- `mongodb-storage-mongodb-0` - PersistentVolumeClaim (5Gi, auto-created by StatefulSet)

### Secrets
- `app-secrets` - JWT secret and other sensitive data

## Service DNS Names

Within the cluster, services use fully qualified domain names (FQDN):

```
<service-name>.<namespace>.svc.cluster.local
```

### Examples:
- MongoDB: `mongodb.hotel-booking.svc.cluster.local:27017`
- Backend: `backend.hotel-booking.svc.cluster.local:5000`
- Frontend: `frontend.hotel-booking.svc.cluster.local:80`

## Creating the Namespace

### Method 1: Using kubectl
```bash
kubectl apply -f k8s/namespace.yaml
```

### Method 2: Using Pulumi
The namespace is automatically created when running:
```bash
cd infrastructure
pulumi up
```

### Method 3: Manual creation
```bash
kubectl create namespace hotel-booking
kubectl label namespace hotel-booking app=hotel-booking-system
```

## Working with the Namespace

### View Namespace
```bash
kubectl get namespace hotel-booking
kubectl describe namespace hotel-booking
```

### View All Resources
```bash
kubectl get all -n hotel-booking
```

### View Specific Resources
```bash
kubectl get pods -n hotel-booking
kubectl get services -n hotel-booking
kubectl get deployments -n hotel-booking
kubectl get pvc -n hotel-booking
kubectl get secrets -n hotel-booking
```

### View Logs
```bash
kubectl logs -f deployment/backend -n hotel-booking
kubectl logs -f deployment/frontend -n hotel-booking
kubectl logs -f deployment/mongodb -n hotel-booking
```

### Execute Commands
```bash
kubectl exec -it <pod-name> -n hotel-booking -- /bin/sh
```

### Port Forwarding
```bash
kubectl port-forward svc/backend 5000:5000 -n hotel-booking
kubectl port-forward svc/frontend 8080:80 -n hotel-booking
```

## Deployment Commands

### Deploy All Resources
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

### Update Deployments
```bash
kubectl rollout restart deployment/backend -n hotel-booking
kubectl rollout restart deployment/frontend -n hotel-booking
```

### Scale Deployments
```bash
kubectl scale deployment backend --replicas=3 -n hotel-booking
kubectl scale deployment frontend --replicas=3 -n hotel-booking
```

## Monitoring

### Resource Usage
```bash
kubectl top pods -n hotel-booking
kubectl top nodes
```

### Events
```bash
kubectl get events -n hotel-booking --sort-by=.metadata.creationTimestamp
```

### Watch Resources
```bash
kubectl get pods -n hotel-booking -w
```

## Cleanup

### Delete All Resources in Namespace
```bash
kubectl delete namespace hotel-booking
```

This will delete:
- All deployments
- All services
- All pods
- All PVCs
- All secrets
- The namespace itself

### Delete Individual Resources
```bash
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/mongodb-deployment.yaml
kubectl delete -f k8s/secrets.yaml
```

## Resource Quotas (Optional)

You can set resource quotas for the namespace:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: hotel-booking-quota
  namespace: hotel-booking
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    persistentvolumeclaims: "5"
```

Apply with:
```bash
kubectl apply -f resource-quota.yaml
```

## Network Policies (Optional)

Restrict network traffic within the namespace:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: hotel-booking-network-policy
  namespace: hotel-booking
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: hotel-booking
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: hotel-booking
```

## RBAC (Optional)

Create role-based access control for the namespace:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: hotel-booking-admin
  namespace: hotel-booking
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: hotel-booking-admin-binding
  namespace: hotel-booking
subjects:
- kind: User
  name: admin@example.com
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: hotel-booking-admin
  apiGroup: rbac.authorization.k8s.io
```

## Best Practices

1. **Always specify namespace** in kubectl commands using `-n hotel-booking`
2. **Use labels** for better organization and selection
3. **Set resource limits** on all containers
4. **Use secrets** for sensitive data
5. **Implement RBAC** for access control
6. **Monitor resource usage** regularly
7. **Use network policies** for security
8. **Document namespace usage** for team members

## Troubleshooting

### Namespace stuck in Terminating state
```bash
kubectl get namespace hotel-booking -o json > namespace.json
# Edit namespace.json and remove finalizers
kubectl replace --raw "/api/v1/namespaces/hotel-booking/finalize" -f namespace.json
```

### View namespace resource usage
```bash
kubectl describe namespace hotel-booking
```

### Check for resource quotas
```bash
kubectl get resourcequota -n hotel-booking
```

### View network policies
```bash
kubectl get networkpolicies -n hotel-booking
```

## Integration with Pulumi

The namespace is automatically created by Pulumi infrastructure code:

```javascript
const namespace = new k8s.core.v1.Namespace("hotel-booking", {
    metadata: { name: "hotel-booking" },
}, { provider: k8sProvider });
```

All subsequent resources reference this namespace:

```javascript
metadata: {
    name: "mongodb",
    namespace: namespace.metadata.name,
}
```

## Summary

The `hotel-booking` namespace provides:
- ✅ Resource organization
- ✅ Isolation from other applications
- ✅ Easy management and cleanup
- ✅ Foundation for RBAC and quotas
- ✅ Clear service DNS naming
- ✅ Better monitoring and troubleshooting

All kubectl commands should include `-n hotel-booking` to work with the application resources.
