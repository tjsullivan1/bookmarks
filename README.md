# Bookmarks Manager

A modern web application for managing personal bookmarks, built with React and FastAPI, backed by Azure Cosmos DB.

## 🚀 Quick Start

### Development

**Backend API:**
```bash
./scripts/run_server.sh
```
Access at http://localhost:8000 | [API Docs](http://localhost:8000/docs)

**Frontend:**
```bash
./scripts/dev_frontend.sh
```
Access at http://localhost:3000

### Docker

```bash
cd docker
docker-compose up --build
```
- Frontend: http://localhost:8080
- Backend: http://localhost:8000

## 📁 Project Structure

```
bookmarks/
├── docker/              # Docker configurations and compose files
├── scripts/             # Development and deployment scripts
├── src/
│   ├── backend/        # FastAPI application
│   └── frontend/       # React application
├── tests/              # Test suites
├── infra/              # Terraform infrastructure as code
└── docs/               # Documentation
```

## 🔧 Setup

1. **Install dependencies:**
   ```bash
   # Backend
   pip install -r requirements.txt

   # Frontend
   cd src/frontend && npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure Cosmos DB credentials
   ```

3. **Run the application** (see Quick Start above)

## 📚 Documentation

- **[Implementation Guide](README_IMPLEMENTATION.md)** - Detailed implementation overview
- **[API Documentation](docs/api_documentation.md)** - Complete API reference
- **[Docker Guide](docker/README.md)** - Container deployment instructions
- **[Scripts Reference](scripts/README.md)** - Development scripts documentation

## 🧪 Testing

```bash
# Backend tests
PYTHONPATH=src python -m pytest tests/backend/ -v

# Frontend tests
cd src/frontend && npm test

# API demo
./scripts/demo_api.sh
```

## 🏗️ Infrastructure

Terraform modules for Azure deployment are available in `infra/catalog/terraform_modules/`.

## 📝 License

See [LICENSE](LICENSE) file for details.
