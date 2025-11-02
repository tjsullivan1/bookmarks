# Scripts

Utility scripts for development and deployment of the Bookmarks application.

## Available Scripts

### Development

**`run_server.sh`** - Start the FastAPI backend server
```bash
./scripts/run_server.sh
```
- Sets up Python environment
- Starts backend on http://localhost:8000
- Enables hot-reload for development

**`dev_frontend.sh`** - Start the React frontend development server
```bash
./scripts/dev_frontend.sh
```
- Installs npm dependencies if needed
- Starts frontend on http://localhost:3000
- Enables hot module replacement

**`demo_api.sh`** - Test the API endpoints
```bash
./scripts/demo_api.sh
```
- Runs a series of API calls to test functionality
- Useful for quick verification after changes
- Shows example requests and responses

### Deployment

**`docker-build-push.sh`** - Build and push Docker images
```bash
./scripts/docker-build-push.sh <dockerhub-username> [version]
```
- Builds backend Docker image
- Tags with version and latest
- Optionally pushes to DockerHub

Example:
```bash
./scripts/docker-build-push.sh myusername v1.0.0
```

**`fe_start.sh`** - Frontend container startup script
- Used internally by the frontend Docker container
- Configures nginx with environment variables
- Not typically run directly

## Usage Tips

### Running from any directory

All scripts handle relative paths, so you can run them from the project root:

```bash
# From project root
./scripts/run_server.sh
./scripts/dev_frontend.sh
```

### Making scripts executable

If you get permission errors, make scripts executable:

```bash
chmod +x scripts/*.sh
```

### Environment variables

Most scripts respect standard environment variables:
- `BACKEND_URL` - Backend API endpoint
- `DEBUG` - Enable debug mode
- `PYTHONPATH` - Python module path

## Script Dependencies

- **bash** - All scripts require bash shell
- **python3** - Required by backend scripts
- **node/npm** - Required by frontend scripts
- **docker** - Required by Docker build script
- **curl** - Required by demo script
