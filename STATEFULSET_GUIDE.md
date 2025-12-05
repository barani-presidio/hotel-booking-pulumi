# StatefulSet vs Deployment for MongoDB

## Why StatefulSet?

MongoDB is now deployed as a **StatefulSet** instead of a Deployment. Here's why:

### Key Differences

**StatefulSet Benefits:**
1. **Stable Network Identity** - Each pod gets a predictable name (mongodb-0)
2. **Ordered Deployment** - Pods are created/deleted in order
3. **Persistent Storage** - Each pod gets its own PVC automatically
4. **Stable Hostname** - DNS name remains consistent across restarts

**Deployment Limitations:**
- Random pod names
- No guaranteed ordering
- Shared PVC (not ideal for databases)
- Network identity changes on restart

## MongoDB StatefulSet Configuration

### Pod Naming
- Pod name: `mongodb-0`
- Full DNS: `mongodb-0.mongodb.hotel-booking.svc.cluster.local`
- Service DNS: `mongodb.hotel-booking.svc.cluster.local`

### Storage
- Automatic PVC creation via volumeClaimTemplates
- PVC name: `mongodb-storage-mongodb-0`
- Size: 5Gi
- Access mode: ReadWriteOnce

### Service
- Headless service (clusterIP: None)
- Provides stable network identity
- DNS resolves to pod IPs directly

## Commands

### View StatefulSet
```bash
kubectl get statefulset -n hotel-booking
kubectl describe statefulset mongodb -n hotel-booking
```

### View Pods
```bash
kubectl get pods -n hotel-booking
# Shows: mongodb-0
```

### View PVCs
```bash
kubectl get pvc -n hotel-booking
# Shows: mongodb-storage-mongodb-0
```

### Scale StatefulSet
```bash
kubectl scale statefulset mongodb --replicas=3 -n hotel-booking
# Creates: mongodb-0, mongodb-1, mongodb-2
```

### Delete StatefulSet
```bash
# Delete StatefulSet but keep PVCs
kubectl delete statefulset mongodb -n hotel-booking

# Delete StatefulSet and PVCs
kubectl delete statefulset mongodb -n hotel-booking
kubectl delete pvc mongodb-storage-mongodb-0 -n hotel-booking
```

## Best Practices

1. ✅ Use StatefulSet for databases
2. ✅ Use headless service
3. ✅ Set resource limits
4. ✅ Use volumeClaimTemplates
5. ✅ Enable persistent storage
