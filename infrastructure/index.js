const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const eks = require("@pulumi/eks");
const k8s = require("@pulumi/kubernetes");

// Get AWS account ID and region
const awsAccountId = aws.getCallerIdentity().then(id => id.accountId);
const awsRegion = aws.getRegion().then(region => region.name);

// Create VPC
const vpc = new awsx.ec2.Vpc("hotel-booking-vpc", {
    cidrBlock: "10.0.0.0/16",
    numberOfAvailabilityZones: 2,
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "hotel-booking-vpc",
        createdby: "pulumi",
    },
});

// Create EKS Cluster
const cluster = new eks.Cluster("eks-cluster-pulumi", {
    vpcId: vpc.vpcId,
    subnetIds: vpc.publicSubnetIds,
    instanceType: "t3.medium",
    desiredCapacity: 2,
    minSize: 1,
    maxSize: 3,
    version: "1.32",
    tags: {
        Name: "eks-cluster-pulumi",
        createdby: "pulumi",
    },
});

// Create ECR repositories
const backendRepo = new aws.ecr.Repository("hotel-backend", {
    name: "hotel-backend",
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    tags: {
        Name: "hotel-backend",
        createdby: "pulumi",
    },
});

const frontendRepo = new aws.ecr.Repository("hotel-frontend", {
    name: "hotel-frontend",
    imageScanningConfiguration: {
        scanOnPush: true,
    },
    tags: {
        Name: "hotel-frontend",
        createdby: "pulumi",
    },
});

// Create Kubernetes provider
const k8sProvider = new k8s.Provider("k8s-provider", {
    kubeconfig: cluster.kubeconfig,
});

// Create namespace
const namespace = new k8s.core.v1.Namespace("hotel-booking", {
    metadata: { name: "hotel-booking" },
}, { provider: k8sProvider });

// Deploy MongoDB as Deployment
const mongodbService = new k8s.core.v1.Service("mongodb-service", {
    metadata: {
        name: "mongodb-service",
        namespace: namespace.metadata.name,
        labels: {
            app: "mongodb",
        },
    },
    spec: {
        type: "ClusterIP",
        selector: { app: "mongodb" },
        ports: [{
            port: 27017,
            targetPort: 27017,
            protocol: "TCP",
            name: "mongodb",
        }],
    },
}, { provider: k8sProvider });

const mongodbDeployment = new k8s.apps.v1.Deployment("mongodb-deployment", {
    metadata: {
        name: "mongodb-deployment",
        namespace: namespace.metadata.name,
        labels: {
            app: "mongodb",
            component: "database",
        },
    },
    spec: {
        replicas: 1,
        selector: {
            matchLabels: { app: "mongodb" },
        },
        template: {
            metadata: {
                labels: {
                    app: "mongodb",
                    component: "database",
                },
            },
            spec: {
                nodeSelector: {
                    "kubernetes.io/arch": "amd64",
                },
                containers: [{
                    name: "mongodb",
                    image: "mongo:7.0",
                    ports: [{ 
                        containerPort: 27017,
                        name: "mongodb"
                    }],
                    env: [{
                        name: "MONGO_INITDB_DATABASE",
                        value: "hotel-booking"
                    }],
                    volumeMounts: [{
                        name: "mongodb-storage",
                        mountPath: "/data/db",
                    }],
                    livenessProbe: {
                        exec: {
                            command: [
                                "mongosh",
                                "--eval",
                                "db.adminCommand('ping')"
                            ]
                        },
                        initialDelaySeconds: 30,
                        periodSeconds: 10,
                        timeoutSeconds: 5,
                    },
                    readinessProbe: {
                        exec: {
                            command: [
                                "mongosh",
                                "--eval",
                                "db.adminCommand('ping')"
                            ]
                        },
                        initialDelaySeconds: 10,
                        periodSeconds: 5,
                        timeoutSeconds: 5,
                    },
                    resources: {
                        requests: {
                            memory: "256Mi",
                            cpu: "250m"
                        },
                        limits: {
                            memory: "512Mi",
                            cpu: "500m"
                        }
                    }
                }],
                volumes: [{
                    name: "mongodb-storage",
                    emptyDir: {},
                }],
            },
        },
    },
}, { provider: k8sProvider, dependsOn: [mongodbService] });

// Create secrets
const appSecrets = new k8s.core.v1.Secret("app-secrets", {
    metadata: {
        name: "app-secrets",
        namespace: namespace.metadata.name,
    },
    stringData: {
        "jwt-secret": "your-secret-key-change-in-production",
    },
}, { provider: k8sProvider });

// Export outputs
exports.vpcId = vpc.vpcId;
exports.clusterName = cluster.eksCluster.name;
exports.clusterEndpoint = cluster.eksCluster.endpoint;
exports.kubeconfig = cluster.kubeconfig;
exports.namespaceName = namespace.metadata.name;
exports.backendRepoUrl = backendRepo.repositoryUrl;
exports.frontendRepoUrl = frontendRepo.repositoryUrl;
exports.awsAccountId = awsAccountId;
exports.awsRegion = awsRegion;
