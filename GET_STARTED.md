# 🚀 Get Started in 3 Steps

## Prerequisites Check ✓

Run this command to verify you have everything installed:

```bash
./scripts/verify-setup.sh
```

You need:
- ✓ Node.js 18+
- ✓ Docker
- ✓ kubectl
- ✓ AWS CLI (configured)
- ✓ Pulumi CLI

## Quick Start Options

### Option 1: Local Development (5 minutes) 🏠

Perfect for testing and development:

```bash
# Start everything with Docker Compose
docker-compose up --build

# Access the app
open http://localhost:3001
```

**What you get:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5002
- MongoDB: localhost:27018

### Option 2: AWS Deployment (20 minutes) ☁️

Deploy to production on AWS EKS:

```bash
# One command deployment
make full-deploy
```

**What happens:**
1. Creates AWS VPC, EKS cluster, ECR repositories
2. Builds Docker images
3. Pushes images to ECR
4. Deploys to Kubernetes
5. Configures LoadBalancer

**Get your app URL:**
```bash
kubectl get svc frontend
```

### Option 3: Step-by-Step (30 minutes) 📚

For learning and customization:

```bash
# 1. Install dependencies
make install

# 2. Create infrastructure
make infra-up

# 3. Build and push images
make push

# 4. Deploy to Kubernetes
make deploy
```

## What's Included? 📦

### Application Features
- ✅ User registration and login
- ✅ Browse hotels
- ✅ View hotel details
- ✅ Book hotels
- ✅ Responsive design

### Technical Stack
- **Frontend**: React + Material-UI
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Infrastructure**: AWS EKS + ECR
- **IaC**: Pulumi
- **Containers**: Docker + Kubernetes

## Project Structure 📁

```
hotel-booking-system/
├── backend/           # Node.js API
├── frontend/          # React app
├── infrastructure/    # Pulumi IaC
├── k8s/              # Kubernetes manifests
├── scripts/          # Deployment scripts
└── docker-compose.yml # Local development
```

## Common Commands 🛠️

```bash
# Local development
make local              # Start with Docker Compose

# AWS deployment
make full-deploy        # Complete deployment
make infra-up          # Create infrastructure only
make push              # Build and push images
make deploy            # Deploy to Kubernetes

# Maintenance
make clean             # Clean local resources
make infra-down        # Destroy AWS infrastructure

# Help
make help              # Show all commands
```

## Testing Your Deployment ✅

### Local Testing
```bash
# Check health
curl http://localhost:5002/health

# Get hotels
curl http://localhost:5002/api/hotels
```

### Kubernetes Testing
```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# View logs
kubectl logs -f deployment/backend
```

## Next Steps 🎯

1. **Customize the app**: Edit code in `backend/` and `frontend/`
2. **Add features**: Implement payment, reviews, ratings
3. **Setup CI/CD**: Use `.github/workflows/deploy.yml`
4. **Monitor**: Add Prometheus and Grafana
5. **Secure**: Configure SSL/TLS certificates

## Documentation 📖

- [README.md](README.md) - Project overview
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [TESTING.md](TESTING.md) - Testing guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

## Need Help? 🆘

1. Run `./scripts/verify-setup.sh` to check prerequisites
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
3. Review logs: `kubectl logs <pod-name>`
4. Check AWS Console for infrastructure status

## Cost Estimate 💰

**AWS Resources (Monthly):**
- EKS Cluster: ~$73
- EC2 Instances (t3.medium x2): ~$60
- Load Balancer: ~$20
- ECR Storage: ~$1
- **Total: ~$154/month**

**Free Tier:** Some services may be covered by AWS Free Tier

## Cleanup 🧹

When you're done:

```bash
# Delete Kubernetes resources
kubectl delete -f k8s/

# Destroy AWS infrastructure
make infra-down
```

---

**Ready to start?** Choose your option above and let's build! 🚀
