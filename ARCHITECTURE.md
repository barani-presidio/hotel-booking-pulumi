# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    EKS Cluster                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │   Frontend   │  │   Backend    │  │  MongoDB   │ │  │
│  │  │   (React)    │→ │  (Node.js)   │→ │            │ │  │
│  │  │   Nginx      │  │   Express    │  │            │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    ECR Repositories                   │  │
│  │  ┌──────────────┐  ┌──────────────┐                  │  │
│  │  │hotel-backend │  │hotel-frontend│                  │  │
│  │  └──────────────┘  └──────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

- **Frontend**: React 18, Material-UI, Axios
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: MongoDB 7
- **Container**: Docker
- **Orchestration**: Kubernetes (EKS)
- **Infrastructure**: Pulumi (IaC)
- **Cloud**: AWS (EKS, ECR, VPC)

## Key Features

1. Hotel listing and search
2. User authentication (JWT)
3. Booking management
4. Responsive UI with Material-UI
5. RESTful API architecture
6. Containerized microservices
7. Scalable Kubernetes deployment
8. Infrastructure as Code with Pulumi
