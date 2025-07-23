import logging

from azure.cosmos import CosmosClient, PartitionKey, exceptions

from backend.config import settings

logger = logging.getLogger(__name__)


class CosmosDBClient:
    def __init__(self):
        self.client = None
        self.database = None
        self.container = None

    async def initialize(self):
        """Initialize the Cosmos DB client and create database/container if they don't exist"""
        try:
            if not settings.cosmos_endpoint or not settings.cosmos_key:
                logger.warning(
                    "Cosmos DB credentials not provided. Using mock database."
                )
                return

            self.client = CosmosClient(settings.cosmos_endpoint, settings.cosmos_key)

            # Create database if it doesn't exist
            try:
                self.database = self.client.create_database_if_not_exists(
                    id=settings.cosmos_database_name
                )
            except exceptions.CosmosResourceExistsError:
                self.database = self.client.get_database_client(
                    settings.cosmos_database_name
                )

            # Create container if it doesn't exist
            try:
                self.container = self.database.create_container_if_not_exists(
                    id=settings.cosmos_container_name,
                    partition_key=PartitionKey(path="/user_id"),
                    offer_throughput=400,
                )
            except exceptions.CosmosResourceExistsError:
                self.container = self.database.get_container_client(
                    settings.cosmos_container_name
                )

            logger.info("Cosmos DB initialized successfully")

        except Exception as e:
            logger.error(f"Error initializing Cosmos DB: {str(e)}")
            raise

    def get_container(self):
        """Get the container client"""
        if not self.container:
            raise RuntimeError("Database not initialized. Call initialize() first.")
        return self.container


# Global instance
cosmos_client = CosmosDBClient()


async def get_database():
    """Dependency to get database client"""
    if not cosmos_client.container:
        await cosmos_client.initialize()
    # Return None if no container is available (development mode)
    return cosmos_client.container
