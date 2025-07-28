import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.database import cosmos_client
from backend.routers import bookmarks_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle"""
    # Startup
    logger.info("Starting up Bookmarks API...")
    try:
        await cosmos_client.initialize()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        if not settings.debug:
            raise
        logger.warning("Running in debug mode without database")

    yield

    # Shutdown
    logger.info("Shutting down Bookmarks API...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="A RESTful API for managing personal bookmarks with Azure Cosmos DB",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Add HTTPS redirect middleware for Azure Web Apps
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
if not settings.debug:  # Only in production
    app.add_middleware(HTTPSRedirectMiddleware)

# Include routers
app.include_router(bookmarks_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to the Bookmarks API",
        "version": settings.app_version,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Try to get database status
        container = cosmos_client.get_container() if cosmos_client.container else None
        db_status = "connected" if container else "disconnected"
    except Exception:
        db_status = "error"

    return {"status": "healthy", "database": db_status, "version": settings.app_version}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # nosec
        port=8000,  # nosec
        reload=settings.debug,
        log_level="info" if settings.debug else "warning",
    )
