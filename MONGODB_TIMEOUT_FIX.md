# MongoDB StatefulSet Timeout Fix

## Problem
MongoDB StatefulSet times out waiting to become Ready:
```
'mongodb' timed out waiting to be Ready
0 out of 1 replicas succeeded readiness checks
```

## Root Causes
1. **Missing startup probe** - MongoDB takes time to initialize, Kubernetes doesn't know when it's ready
2. **Insufficient memory** - MongoDB needs more memory to start properly
3. **Storage issues** - PVC might not be binding

## Solutions Applied

### 1. Added Startup Probe
Allows MongoDB up to 5 minutes to start before readiness checks begin:
```yaml
startupProbe:
  tcpSocket:
    port: 27017
  initialDelaySeconds: 10
  periodSeconds: 10
  failureThreshold: 30  # 5 minutes total
```

### 2. Increased Memory Limits
- Requests: 256Mi → 512Mi
- Limits: 512Mi → 1Gi

### 3. Optimized Probe Timing
- Startup probe: Checks every 10s, allows 30 failures (5 min)
- Readiness probe: Starts after startup succeeds
- Liveness probe: Checks every 10s after 30s initial delay

## Deployment Steps

### Option 1: Redeploy with Pulumi
```bash
cd infrastructure
pulumi up --yes
```

### Option 2: Deploy MongoDB Separately First
If Pulumi still times out, deploy MongoDB manually first:

```bash
# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Wait for it to be ready (with longer timeout)
kubectl wait --for=condition=ready pod/mongodb-0 -n hotel-booking --timeout=600s

# Then continue with Pulumi for other resources
cd infrastructure
pulumi up --yes
```

### Option 3: Skip MongoDB in Pulumi
If you want to manage MongoDB separately:

1. Comment out MongoDB StatefulSet in `infrastructure/index.js`
2. Deploy MongoDB manually: `kubectl apply -f k8s/mongodb-deployment.yaml`
3. Deploy rest with Pulumi

## Verification

### Check Pod Status
```bash
kubectl get pods -n hotel-booking -l app=mongodb
kubectl describe pod mongodb-0 -n hotel-booking
```

### Check Pod Logs
```bash
kubectl logs mongodb-0 -n hotel-booking
```

### Check PVC Status
```bash
kubectl get pvc -n hotel-booking
# Should show: mongodb-storage-mongodb-0 - Bound
```

### Check Events
```bash
kubectl get events -n hotel-booking --sort-by='.lastTimestamp' | grep mongodb
```

## Common Issues

### Issue: Pod in Pending State
**Cause**: PVC not binding or insufficient resources
**Fix**:
```bash
# Check PVC
kubectl get pvc -n hotel-booking
kubectl describe pvc mongodb-storage-mongodb-0 -n hotel-booking

# Check storage class
kubectl get storageclass

# Check node resources
kubectl top nodes
```

### Issue: Pod in CrashLoopBackOff
**Cause**: MongoDB crashing, check logs
**Fix**:
```bash
kubectl logs mongodb-0 -n hotel-booking --previous
# Look for OOMKilled, permission errors, etc.
```

### Issue: Readiness Probe Failing
**Cause**: MongoDB not accepting connections
**Fix**:
```bash
# Check if MongoDB is actually running
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh --eval "db.version()"

# Check network
kubectl exec -it mongodb-0 -n hotel-booking -- netstat -tlnp | grep 27017
```

### Issue: Storage Class Not Found
**Cause**: EKS might not have default storage class
**Fix**: Add storage class to PVC:
```yaml
spec:
  storageClassName: gp3  # or gp2, standard
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 5Gi
```

## Manual Recovery

If StatefulSet is stuck:

```bash
# Delete StatefulSet (keeps PVC)
kubectl delete statefulset mongodb -n hotel-booking

# Check and fix any issues
kubectl get pvc -n hotel-booking
kubectl get events -n hotel-booking

# Redeploy
kubectl apply -f k8s/mongodb-deployment.yaml

# Monitor
kubectl get pods -n hotel-booking -w
```

## Expected Behavior

After applying fixes:
1. Pod starts (Pending → ContainerCreating → Running)
2. Startup probe runs (up to 5 minutes)
3. Readiness probe succeeds
4. Pod marked as Ready
5. StatefulSet shows 1/1 Ready

## Time Estimates

- Pod creation: ~30 seconds
- MongoDB startup: 1-3 minutes (first time)
- Startup probe: Up to 5 minutes
- Total: 2-8 minutes typically

## Prevention

For future deployments:
1. Always include startup probes for databases
2. Set appropriate resource limits
3. Use StatefulSet for stateful applications
4. Monitor pod events during deployment

