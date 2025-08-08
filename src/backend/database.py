import logging

from azure.cosmos import CosmosClient, PartitionKey, exceptions
from azure.identity import DefaultAzureCredential

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
            if not settings.cosmos_endpoint:
                logger.warning(
                    "Cosmos DB endpoint not provided. Using mock database."
                )
                return

            # Try managed identity first
            try:
                logger.info("Attempting to connect using managed identity...")
                credential = DefaultAzureCredential()
                self.client = CosmosClient(settings.cosmos_endpoint, credential)

                # Test the connection by attempting to list databases
                # Test the connection by attempting to get database account info (lightweight connectivity check)
                self.client.get_database_account()
                logger.info("Successfully connected using managed identity")

            except Exception as managed_identity_error:
                logger.warning(f"Managed identity authentication failed: {managed_identity_error}")

                # Fall back to cosmos key authentication
                if not settings.cosmos_key:
                    logger.error(
                        "Both managed identity and cosmos key authentication failed. "
                        "Please provide either managed identity access or COSMOS_KEY."
                    )
                    raise ValueError("No valid authentication method available for Cosmos DB")

                logger.info("Falling back to cosmos key authentication...")
                self.client = CosmosClient(settings.cosmos_endpoint, settings.cosmos_key)
                logger.info("Successfully connected using cosmos key")

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
