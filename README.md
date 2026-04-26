# Dockerized MERN DevOps Platform

A full-stack Dockerized 3-tier application built with React, Node.js, MongoDB, Redis, Nginx, Docker Compose, Prometheus, Grafana, and cAdvisor.

## Architecture

- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB
- Cache: Redis
- Reverse Proxy: Nginx
- Container Orchestration: Docker Compose
- Monitoring: Prometheus, Grafana, cAdvisor

## DevOps Concepts Covered

- Dockerfiles
- Multi-stage builds
- Docker Compose
- Custom Docker networks
- Named volumes
- Environment variables
- Health checks
- Reverse proxy
- Container logs
- Monitoring
- Production-style deployment

## Services

| Service | Description |
|---|---|
| frontend | React web application |
| backend | Express API |
| mongodb | Database |
| redis | Cache and request counter |
| nginx | Reverse proxy |
| prometheus | Metrics collection |
| grafana | Dashboard visualization |
| cadvisor | Container metrics |

## Run Project

```bash
docker compose up --build