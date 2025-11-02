# Docker Configuration

This directory contains all Docker-related files for the Bookmarks application.

## Files

- **`Dockerfile.backend`** - Backend API container (FastAPI + Python)
- **`Dockerfile.frontend`** - Frontend web app container (React + Nginx)
- **`docker-compose.yml`** - Multi-container orchestration
- **`nginx.conf.template`** - Nginx configuration template for frontend
- **`.dockerignore`** - Files to exclude from Docker builds

## Usage

### Using Docker Compose (Recommended)

Build and run both frontend and backend:

```bash
cd docker
docker-compose up --build
```

Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Building Individual Images

**Backend:**
```bash
docker build -f docker/Dockerfile.backend -t bookmarks-backend .
docker run -p 8000:8000 bookmarks-backend
```

**Frontend:**
```bash
docker build -f docker/Dockerfile.frontend -t bookmarks-frontend .
docker run -p 8080:80 bookmarks-frontend
```

## Environment Variables

Configure via `.env` file or pass directly:

**Backend:**
- `COSMOS_ENDPOINT` - Azure Cosmos DB endpoint
- `COSMOS_KEY` - Azure Cosmos DB access key
- `COSMOS_DATABASE_NAME` - Database name (default: bookmarks_db)
- `COSMOS_CONTAINER_NAME` - Container name (default: bookmarks)
- `DEBUG` - Enable debug mode (default: false)

**Frontend:**
- `BACKEND_URL` - Backend API URL (default: http://bookmarks-backend:8000)
- `VITE_BACKEND_URL` - Backend URL for Vite build

## Production Deployment

For production, ensure:
1. Set `DEBUG=false`
2. Use proper secrets management for Cosmos DB credentials
3. Configure proper networking and load balancing
4. Enable container health checks
5. Set appropriate resource limits
