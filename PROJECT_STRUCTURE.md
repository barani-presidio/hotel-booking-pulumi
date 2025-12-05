# Project Structure

```
hotel-booking-system/
├── backend/                      # Node.js Express Backend
│   ├── models/                   # Mongoose models
│   │   ├── Hotel.js
│   │   ├── Booking.js
│   │   └── User.js
│   ├── routes/                   # API routes
│   │   ├── hotels.js
│   │   ├── bookings.js
│   │   └── auth.js
│   ├── server.js                 # Main server file
│   ├── package.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
│
├── frontend/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Navbar.js
│   │   │   ├── HotelList.js
│   │   │   ├── HotelDetail.js
│   │   │   ├── BookingForm.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── api/
│   │   │   └── axios.js         # API client
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   └── .env.example
│
├── infrastructure/               # Pulumi IaC
│   ├── index.js                 # Main infrastructure code
│   ├── package.json
│   └── Pulumi.yaml
│
├── k8s/                         # Kubernetes manifests
│   ├── mongodb-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── secrets.yaml
│
├── scripts/                     # Deployment scripts
│   ├── setup-infrastructure.sh
│   ├── build-and-push.sh
│   ├── deploy-k8s.sh
│   └── full-deploy.sh
│
├── docker-compose.yml           # Local development
├── Makefile                     # Build automation
├── cluster-details.json         # Cluster configuration
├── config.env.example           # Environment variables
├── .gitignore
├── README.md
├── DEPLOYMENT.md
├── ARCHITECTURE.md
└── QUICKSTART.md
```
