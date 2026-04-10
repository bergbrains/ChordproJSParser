.PHONY: build dev start serve preview stop test lint docker-build docker-up docker-down docker-push help

DOCKER_IMAGE ?= bergbrains/chordpro-jsparser:latest

# Default target
help:
	@echo "ChordproJS - Management Commands"
	@echo "-------------------------------"
	@echo "Local Development:"
	@echo "  make dev          Start development server with live reload (port 3001)"
	@echo "  make build        Build production bundles in dist/"
	@echo "  make start        Serve current dist/ via a simple web server (port 3001)"
	@echo "  make preview      Build and then serve (alias for prod preview)"
	@echo ""
	@echo "Testing and Linting:"
	@echo "  make test         Run all tests via Jest"
	@echo "  make lint         Run ESLint on src/"
	@echo ""
	@echo "Docker Management:"
	@echo "  make docker-build Build the container image"
	@echo "  make docker-up    Build and start containerized application (port 8080)"
	@echo "  make docker-down  Stop and remove containerized application"
	@echo "  make docker-push  Push the container image to a registry"
	@echo ""
	@echo "Process Management:"
	@echo "  make stop         Stop any running development servers (via port 3001 check)"

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

serve:
	npm run serve

preview:
	npm run preview

test:
	npm run test

lint:
	npm run lint

docker-build:
	docker build -t $(DOCKER_IMAGE) .

docker-up:
	docker-compose up -d --build
	@echo "Application running at http://localhost:8080"

docker-down:
	docker-compose down

docker-push:
	docker push $(DOCKER_IMAGE)

stop:
	@echo "Stopping processes on port 3001..."
	-lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "No process found on port 3001"
	@echo "Stopping processes on port 8080..."
	-lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "No process found on port 8080"

pre-commit:
	pre-commit
pre-commit-all:
	pre-commit run -a
