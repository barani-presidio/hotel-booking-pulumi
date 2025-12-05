# MongoDB StatefulSet Update

## Summary

MongoDB has been changed from a **Deployment** to a **StatefulSet** for better database management.

## What Changed

### Before (Deployment)
```yaml
kind: Deployment
- Random pod names (mongodb-xyz123)
- Separate PVC definition
- Regular ClusterIP service
- No guaranteed ordering
```

### After (StatefulSet)
```yaml
kind: StatefulSet
- Predictable pod name (mongodb-0)
- VolumeClaimTemplate (auto PVC)
- Headless service (clusterIP: None)
- Ordered deployment/scaling
```

## Key Benefits

1. **Stable Identity**: Pod always named `mongodb-0`
2. **Persistent Storage**: Automatic PVC creation per pod
3. **Ordered Operations**: Predictable startup/shutdown
4. **Stable Network**: DNS name remains consistent
5. **Scalability**: Easy to add replicas (mongodb-1, mongodb-2)

## Updated Files

1. ✅ `k8s/mongodb-deployment.yaml` - Changed to StatefulSet
2. ✅ `infrastructure/index.js` - Updated Pulumi code
3. ✅ `scripts/deploy-k8s.sh` - Updated wait command
4. ✅ `k8s/README.md` - Updated documentation
5. ✅ `NAMESPACE_GUIDE.md` - Updated resource list
6. ✅ `TESTING.md` - Updated test commands
7. ✅ `NAMESPACE_COMMANDS.md` - Updated commands

## New Features

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Environment Variables
```yaml
env:
- name: MONGO_INITDB_DATABASE
  value: hotel-booking
```

### Headless Service
```yaml
clusterIP: None  # Enables direct pod DNS
```

## DNS Names

### Pod DNS
- Full: `mongodb-0.mongodb.hotel-booking.svc.cluster.local`
- Short: `mongodb-0.mongodb`

### Service DNS
- Full: `mongodb.hotel-booking.svc.cluster.local`
- Short: `mongodb`

Both work! The backend uses the service DNS.

## Commands

### View StatefulSet
```bash
kubectl get statefulset -n hotel-booking
kubectl describe statefulset mongodb -n hotel-booking
```

### View Pod
```bash
kubectl get pod mongodb-0 -n hotel-booking
kubectl logs mongodb-0 -n hotel-booking
```

### View PVC
```bash
kubectl get pvc -n hotel-booking
# Shows: mongodb-storage-mongodb-0
```

### Connect to MongoDB
```bash
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh
```

### Scale (if needed)
```bash
kubectl scale statefulset mongodb --replicas=3 -n hotel-booking
# Creates: mongodb-0, mongodb-1, mongodb-2
```

## Deployment

The deployment script automatically handles StatefulSet:

```bash
./scripts/deploy-k8s.sh
```

It will:
1. Create namespace
2. Apply secrets
3. Deploy MongoDB StatefulSet
4. Wait for StatefulSet to be ready
5. Deploy backend
6. Deploy frontend

## Rollback

If you need to rollback:

```bash
# Delete StatefulSet
kubectl delete statefulset mongodb -n hotel-booking

# Delete PVC (optional, will lose data)
kubectl delete pvc mongodb-storage-mongodb-0 -n hotel-booking

# Redeploy
kubectl apply -f k8s/mongodb-deployment.yaml
```

## Migration Notes

- No data migration needed for new deployments
- For existing deployments, backup data before switching
- PVC name changes from `mongodb-pvc` to `mongodb-storage-mongodb-0`

## Why This Matters

StatefulSet is the **recommended** way to run databases in Kubernetes:
- ✅ Better for stateful applications
- ✅ Proper for production databases
- ✅ Enables replica sets (future)
- ✅ Stable network identity
- ✅ Ordered operations

## Future Enhancements

With StatefulSet, you can now:
1. Add MongoDB replica set (3 nodes)
2. Enable automatic failover
3. Configure sharding
4. Use MongoDB Operator

## Documentation

See also:
- `STATEFULSET_GUIDE.md` - Detailed StatefulSet guide
- `k8s/README.md` - Kubernetes manifests
- `NAMESPACE_GUIDE.md` - Namespace usage
