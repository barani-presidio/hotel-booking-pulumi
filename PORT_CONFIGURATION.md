# Port Configuration

## Local Development Ports

To avoid conflicts with other services, the application uses the following ports:

### Docker Compose (Local Development)

| Service  | Internal Port | External Port | Access URL |
|----------|--------------|---------------|------------|
| Frontend | 80           | 3001          | http://localhost:3001 |
| Backend  | 5000         | 5002          | http://localhost:5002 |
| MongoDB  | 27017        | 27018         | localhost:27018 |

### Port Mapping Explanation

**Frontend:**
- Container runs Nginx on port 80
- Mapped to host port 3001
- Access: `http://localhost:3001`

**Backend:**
- Container runs Node.js on port 5000
- Mapped to host port 5002
- Access: `http://localhost:5002`
- API: `http://localhost:5002/api`

**MongoDB:**
- Container runs on port 27017
- Mapped to host port 27018
- Access: `localhost:27018`

## Kubernetes Ports

In Kubernetes, services use standard ports:

| Service  | Port  | Type        | Access |
|----------|-------|-------------|--------|
| Frontend | 80    | LoadBalancer| Via LoadBalancer URL |
| Backend  | 5000  | ClusterIP   | Internal only |
| MongoDB  | 27017 | ClusterIP   | Internal only |

### Kubernetes Service DNS

- Frontend: `frontend.hotel-booking.svc.cluster.local:80`
- Backend: `backend.hotel-booking.svc.cluster.local:5000`
- MongoDB: `mongodb.hotel-booking.svc.cluster.local:27017`

## Environment Variables

### Backend (.env)
```env
PORT=5000  # Internal container port
MONGODB_URI=mongodb://mongodb:27017/hotel-booking
```

### Frontend (.env)
```env
# For local development
REACT_APP_API_URL=http://localhost:5002/api

# For production (Kubernetes)
REACT_APP_API_URL=http://backend:5000/api
```

## Docker Compose Configuration

```yaml
backend:
  ports:
    - "5001:5000"  # host:container

frontend:
  ports:
    - "3001:80"    # host:container
```

## Why Different Ports?

**Local Development (3001, 5001):**
- Avoids conflicts with other services
- Ports 3000 and 5000 commonly used by other apps
- Easy to run multiple projects simultaneously

**Kubernetes (80, 5000):**
- Standard ports for production
- LoadBalancer handles external access
- Internal services use standard ports

## Testing Ports

### Local Development
```bash
# Test backend
curl http://localhost:5001/health

# Test frontend
curl http://localhost:3001

# Test MongoDB
mongosh mongodb://localhost:27018
```

### Kubernetes
```bash
# Test backend (from within cluster)
kubectl exec -it <backend-pod> -n hotel-booking -- curl localhost:5000/health

# Test frontend (via LoadBalancer)
curl http://<loadbalancer-url>
```

## Port Forwarding

If you need to access Kubernetes services locally:

```bash
# Forward backend
kubectl port-forward svc/backend 5001:5000 -n hotel-booking

# Forward frontend
kubectl port-forward svc/frontend 3001:80 -n hotel-booking

# Forward MongoDB
kubectl port-forward svc/mongodb 27017:27017 -n hotel-booking
```

## Changing Ports

### Local Development

Edit `docker-compose.yml`:
```yaml
backend:
  ports:
    - "YOUR_PORT:5000"

frontend:
  ports:
    - "YOUR_PORT:80"
```

Update `.env` files accordingly.

### Kubernetes

Edit service definitions in `k8s/` directory:
```yaml
spec:
  ports:
  - port: YOUR_PORT
    targetPort: CONTAINER_PORT
```

## Common Issues

### Port Already in Use

**Error:** `bind: address already in use`

**Solution:**
```bash
# Find process using port
lsof -i :3001
lsof -i :5001

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Cannot Connect to Backend

**Check:**
1. Backend is running: `docker ps`
2. Port is correct: `5001` not `5000`
3. URL is correct: `http://localhost:5001/api`

### Frontend Cannot Reach Backend

**Check:**
1. REACT_APP_API_URL in `.env`
2. Should be `http://localhost:5001/api`
3. Restart frontend after changing `.env`

## Summary

- **Local Frontend**: http://localhost:3001
- **Local Backend**: http://localhost:5001
- **Local MongoDB**: localhost:27018
- **Kubernetes**: Standard ports via LoadBalancer
