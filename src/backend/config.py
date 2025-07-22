from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Azure Cosmos DB settings
    cosmos_endpoint: str = os.getenv("COSMOS_ENDPOINT", "")
    cosmos_key: str = os.getenv("COSMOS_KEY", "")
    cosmos_database_name: str = os.getenv("COSMOS_DATABASE_NAME", "bookmarks_db")
    cosmos_container_name: str = os.getenv("COSMOS_CONTAINER_NAME", "bookmarks")
    
    # Application settings
    app_name: str = "Bookmarks API"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # CORS settings
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()