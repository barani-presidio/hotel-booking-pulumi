.PHONY: help install build push deploy destroy local clean

help:
	@echo "Hotel Booking System - Available Commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make local            - Run application locally with Docker Compose"
	@echo "  make build            - Build Docker images"
	@echo "  make push             - Push images to ECR"
	@echo "  make infra-up         - Create infrastructure with Pulumi"
	@echo "  make infra-down       - Destroy infrastructure"
	@echo "  make deploy           - Deploy to Kubernetes"
	@echo "  make full-deploy      - Complete deployment pipeline"
	@echo "  make clean            - Clean up local resources"

install:
	cd backend && npm install
	cd frontend && npm install
	cd infrastructure && npm install

local:
	docker-compose up --build

build:
	docker build -t hotel-backend:latest ./backend
	docker build -t hotel-frontend:latest ./frontend

push:
	chmod +x scripts/build-and-push.sh
	./scripts/build-and-push.sh

infra-up:
	cd infrastructure && pulumi up

infra-down:
	cd infrastructure && pulumi destroy

deploy:
	chmod +x scripts/deploy-k8s.sh
	./scripts/deploy-k8s.sh

full-deploy:
	chmod +x scripts/full-deploy.sh
	./scripts/full-deploy.sh

clean:
	docker-compose down -v
	rm -rf backend/node_modules frontend/node_modules infrastructure/node_modules
	rm -f kubeconfig-*.json
