# Documentation Index

Complete guide to all documentation in this project.

## 🚀 Getting Started

1. **[GET_STARTED.md](GET_STARTED.md)** - Start here! Quick 3-step guide
   - Prerequisites check
   - Local development setup
   - AWS deployment options
   - Common commands

2. **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start
   - Fastest way to get running
   - Essential commands only
   - Quick testing guide

3. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
   - Detailed installation steps
   - Configuration details
   - Post-deployment tasks
   - Maintenance procedures

## 📖 Core Documentation

4. **[README.md](README.md)** - Project overview
   - Features and architecture
   - Technology stack
   - Quick reference
   - Project structure

5. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
   - Architecture diagram
   - Component overview
   - Technology stack details
   - Key features

6. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - File organization
   - Complete directory tree
   - File descriptions
   - Module organization

## 🚢 Deployment

7. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
   - Prerequisites
   - Step-by-step deployment
   - Local development
   - Monitoring and troubleshooting
   - Cleanup procedures

8. **[cluster-details.json](cluster-details.json)** - Cluster configuration
   - EKS cluster settings
   - Network configuration
   - Tags and metadata

## 🧪 Testing & Troubleshooting

9. **[TESTING.md](TESTING.md)** - Testing guide
   - Local testing
   - Kubernetes testing
   - Integration testing
   - Performance testing
   - Common test scenarios

10. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problem solving
    - Common issues and solutions
    - Debugging commands
    - Error resolution
    - Getting help

## 🔧 Configuration

11. **[NAMESPACE_GUIDE.md](NAMESPACE_GUIDE.md)** - Kubernetes namespace guide
    - Namespace overview
    - Service DNS names
    - Working with namespaces
    - Best practices

11a. **[STATEFULSET_GUIDE.md](STATEFULSET_GUIDE.md)** - StatefulSet vs Deployment
    - Why StatefulSet for databases
    - Key differences
    - Commands and best practices

11b. **[MONGODB_STATEFULSET_UPDATE.md](MONGODB_STATEFULSET_UPDATE.md)** - MongoDB update details
    - What changed
    - Benefits and features
    - Migration notes

12. **[config.env.example](config.env.example)** - Environment variables
    - AWS configuration
    - Cluster settings
    - Application config
    - Security settings

12a. **[PORT_CONFIGURATION.md](PORT_CONFIGURATION.md)** - Port configuration guide
    - Local development ports
    - Kubernetes ports
    - Port forwarding
    - Troubleshooting

13. **[Makefile](Makefile)** - Build automation
    - Available commands
    - Build targets
    - Deployment shortcuts

## 📁 Component Documentation

### Backend
- **[backend/package.json](backend/package.json)** - Dependencies
- **[backend/.env.example](backend/.env.example)** - Environment config
- **[backend/Dockerfile](backend/Dockerfile)** - Container config
- **[backend/server.js](backend/server.js)** - Main server file

### Frontend
- **[frontend/package.json](frontend/package.json)** - Dependencies
- **[frontend/.env.example](frontend/.env.example)** - Environment config
- **[frontend/Dockerfile](frontend/Dockerfile)** - Container config
- **[frontend/nginx.conf](frontend/nginx.conf)** - Nginx configuration

### Infrastructure
- **[infrastructure/index.js](infrastructure/index.js)** - Pulumi IaC
- **[infrastructure/Pulumi.yaml](infrastructure/Pulumi.yaml)** - Pulumi config
- **[infrastructure/package.json](infrastructure/package.json)** - Dependencies

### Kubernetes
- **[k8s/README.md](k8s/README.md)** - Kubernetes manifests guide
- **[k8s/namespace.yaml](k8s/namespace.yaml)** - Namespace definition
- **[k8s/mongodb-deployment.yaml](k8s/mongodb-deployment.yaml)** - MongoDB
- **[k8s/backend-deployment.yaml](k8s/backend-deployment.yaml)** - Backend
- **[k8s/frontend-deployment.yaml](k8s/frontend-deployment.yaml)** - Frontend
- **[k8s/secrets.yaml](k8s/secrets.yaml)** - Secrets

## 🔧 Scripts

14. **[scripts/README.md](scripts/README.md)** - Scripts documentation
15. **[scripts/verify-setup.sh](scripts/verify-setup.sh)** - Prerequisites check
16. **[scripts/setup-infrastructure.sh](scripts/setup-infrastructure.sh)** - Infrastructure setup
17. **[scripts/build-and-push.sh](scripts/build-and-push.sh)** - Build and push images
18. **[scripts/deploy-k8s.sh](scripts/deploy-k8s.sh)** - Kubernetes deployment
19. **[scripts/full-deploy.sh](scripts/full-deploy.sh)** - Complete deployment

## 🔄 CI/CD

20. **[.github/workflows/deploy.yml](.github/workflows/deploy.yml)** - GitHub Actions
    - Automated deployment
    - Build pipeline
    - Testing workflow

## 📊 Additional Resources

### Docker
- **[docker-compose.yml](docker-compose.yml)** - Local development
- **[backend/.dockerignore](backend/.dockerignore)** - Docker ignore rules
- **[frontend/.dockerignore](frontend/.dockerignore)** - Docker ignore rules

### Git
- **[.gitignore](.gitignore)** - Git ignore rules

## 📚 Reading Order

### For Beginners
1. GET_STARTED.md
2. README.md
3. QUICKSTART.md
4. ARCHITECTURE.md

### For Developers
1. README.md
2. ARCHITECTURE.md
3. PROJECT_STRUCTURE.md
4. SETUP_GUIDE.md
5. TESTING.md

### For DevOps
1. DEPLOYMENT.md
2. SETUP_GUIDE.md
3. infrastructure/index.js
4. k8s/*.yaml
5. TROUBLESHOOTING.md

### For Production Deployment
1. SETUP_GUIDE.md
2. DEPLOYMENT.md
3. config.env.example
4. TROUBLESHOOTING.md
5. TESTING.md

## 🔍 Quick Reference

| Need to... | Read this |
|------------|-----------|
| Get started quickly | GET_STARTED.md |
| Understand the system | ARCHITECTURE.md |
| Deploy to AWS | DEPLOYMENT.md |
| Fix an issue | TROUBLESHOOTING.md |
| Run tests | TESTING.md |
| Configure settings | config.env.example |
| Learn the structure | PROJECT_STRUCTURE.md |
| Set up from scratch | SETUP_GUIDE.md |

## 💡 Tips

- Start with GET_STARTED.md if you're new
- Keep TROUBLESHOOTING.md handy during deployment
- Use `make help` for quick command reference
- Run `./scripts/verify-setup.sh` before deployment
- Check TESTING.md after deployment to verify everything works

## 🆘 Getting Help

1. Check the relevant documentation above
2. Run diagnostic scripts
3. Review logs and error messages
4. Consult TROUBLESHOOTING.md
5. Check AWS/Kubernetes documentation

---

**Last Updated**: December 2025
**Version**: 1.0.0
