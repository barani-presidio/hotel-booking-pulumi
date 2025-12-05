# Testing Guide

## Prerequisites Verification

```bash
./scripts/verify-setup.sh
```

## Local Testing

### 1. Test with Docker Compose

```bash
# Start services
docker-compose up --build

# In another terminal, test the API
curl http://localhost:5002/health

# Test hotel endpoint
curl http://localhost:5002/api/hotels

# Access frontend
open http://localhost:3001
```

### 2. Test Backend API

```bash
# Health check
curl http://localhost:5002/health

# Register user
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get hotels
curl http://localhost:5002/api/hotels
```

## Kubernetes Testing

### 1. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n hotel-booking

# Check services
kubectl get svc -n hotel-booking

# Check deployments
kubectl get deployments -n hotel-booking

# View all resources in namespace
kubectl get all -n hotel-booking
```

### 2. Test Pod Connectivity

```bash
# Test backend pod
kubectl exec -it $(kubectl get pod -l app=backend -n hotel-booking -o jsonpath='{.items[0].metadata.name}') -n hotel-booking -- curl localhost:5000/health

# Test MongoDB connection (StatefulSet pod)
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh --eval "db.version()"
```

### 3. Test LoadBalancer

```bash
# Get LoadBalancer URL
LB_URL=$(kubectl get svc frontend -n hotel-booking -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Test frontend
curl http://$LB_URL

# Test backend through frontend proxy
curl http://$LB_URL/api/health
```

## Integration Testing

### 1. End-to-End User Flow

1. Open application in browser
2. Register new user
3. Login with credentials
4. Browse hotels
5. View hotel details
6. Create a booking
7. Verify booking in database

### 2. Database Testing

```bash
# Connect to MongoDB pod (StatefulSet)
kubectl exec -it mongodb-0 -n hotel-booking -- mongosh

# In MongoDB shell
use hotel-booking
db.hotels.find()
db.users.find()
db.bookings.find()
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test backend API
ab -n 1000 -c 10 http://localhost:5002/api/hotels

# Test frontend
ab -n 1000 -c 10 http://localhost:3001/
```

## Troubleshooting

### Common Issues

1. **Pods not starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

2. **Service not accessible**
   ```bash
   kubectl get svc
   kubectl describe svc <service-name>
   ```

3. **Image pull errors**
   ```bash
   # Check ECR login
   aws ecr get-login-password --region us-east-1
   
   # Verify image exists
   aws ecr describe-images --repository-name hotel-backend
   ```

4. **MongoDB connection issues**
   ```bash
   # Check MongoDB service
   kubectl get svc mongodb
   
   # Test connection from backend pod
   kubectl exec -it <backend-pod> -- nc -zv mongodb 27017
   ```
