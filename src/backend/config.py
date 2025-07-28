import os
from typing import Optional

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

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
    allowed_origins: list = (
        os.getenv("ALLOWED_ORIGINS", "*").split(",")
        if debug
        else os.getenv("ALLOWED_ORIGINS", "").split(",")
    )

    class Config:
        env_file = ".env"


settings = Settings()
