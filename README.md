# Hotel Booking System - MERN Stack

A production-ready hotel booking application built with MongoDB, Express, React, and Node.js, containerized with Docker and deployed to AWS EKS using Pulumi Infrastructure as Code.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication
- **Hotel Management**: Browse, search, and view hotel details
- **Booking System**: Complete booking workflow with date selection
- **Responsive Design**: Material-UI components for modern UX
- **RESTful API**: Well-structured backend API
- **Microservices Architecture**: Containerized services
- **Cloud-Native**: Kubernetes orchestration on AWS EKS
- **Infrastructure as Code**: Pulumi for reproducible infrastructure

## 🏗️ Architecture 

- **Frontend**: React 18 + Material-UI + Axios
- **Backend**: Node.js + Express.js + JWT
- **Database**: MongoDB 7
- **Containerization**: Docker
- **Orchestration**: Kubernetes (AWS EKS)
- **Container Registry**: AWS ECR
- **Infrastructure**: Pulumi (TypeScript/JavaScript)
- **Cloud Provider**: AWS (EKS, ECR, VPC)

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- kubectl
- AWS CLI (configured with credentials)
- Pulumi CLI
- AWS Account with appropriate permissions

## 🎯 Quick Start

**👉 New here? Start with [GET_STARTED.md](GET_STARTED.md) for a guided setup!**

### Local Development (Docker Compose)

```bash
# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend: http://localhost:5002/api
```

### AWS Deployment (One Command)

```bash
# Verify prerequisites first
./scripts/verify-setup.sh

# Complete deployment pipeline
make full-deploy
```

This will:
1. Create AWS infrastructure (VPC, EKS cluster, ECR repositories)
2. Build and push Docker images to ECR
3. Deploy application to Kubernetes
4. Configure LoadBalancer for external access

## 📚 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Architecture Overview](ARCHITECTURE.md) - System design and components
- [Project Structure](PROJECT_STRUCTURE.md) - File organization

## 🛠️ Available Commands

```bash
make help           # Show all available commands
make install        # Install all dependencies
make local          # Run locally with Docker Compose
make build          # Build Docker images
make push           # Push images to ECR
make infra-up       # Create AWS infrastructure
make deploy         # Deploy to Kubernetes
make full-deploy    # Complete deployment pipeline
make infra-down     # Destroy infrastructure
make clean          # Clean up local resources
```

## 🔧 Configuration

The cluster is configured in `cluster-details.json`:

```json
{
    "cluster": {
        "name": "eks-cluster-pulumi",
        "version": "1.34",
        "status": "ACTIVE"
    }
}
```

## 📦 Project Structure

```
├── backend/          # Node.js Express API
├── frontend/         # React application
├── infrastructure/   # Pulumi IaC code
├── k8s/             # Kubernetes manifests
├── scripts/         # Deployment scripts
└── docker-compose.yml
```

## 🔐 Security

- JWT-based authentication
- Kubernetes secrets for sensitive data
- ECR image scanning enabled
- VPC isolation for EKS cluster
- HTTPS ready (configure SSL/TLS)

## 📊 Monitoring

```bash
# Check pod status
kubectl get pods

# View logs
kubectl logs -f deployment/backend

# Check services
kubectl get svc

# Scale deployments
kubectl scale deployment backend --replicas=3
```

## 🧹 Cleanup

```bash
# Delete Kubernetes resources
kubectl delete -f k8s/

# Destroy AWS infrastructure
cd infrastructure && pulumi destroy
```

## 📝 Environment Variables

Copy `.env.example` files and configure:

- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `config.env` - Deployment configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with MERN stack
- Deployed on AWS EKS
- Infrastructure managed by Pulumi
- Containerized with Docker
