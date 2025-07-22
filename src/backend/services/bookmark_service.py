from typing import List, Optional
from azure.cosmos import exceptions
from backend.models import Bookmark, BookmarkCreate, BookmarkUpdate, BookmarkCategory
from backend.database import get_database
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

# Global mock storage for development mode
_mock_storage = []

class BookmarkService:
    def __init__(self, container):
        self.container = container
        # Use global mock storage for development mode so it persists across service instances
        self._mock_storage = _mock_storage if not container else None
    
    async def create_bookmark(self, bookmark_data: BookmarkCreate) -> Bookmark:
        """Create a new bookmark"""
        try:
            # Generate unique ID
            bookmark_id = str(uuid.uuid4())
            
            # Create bookmark document
            bookmark_doc = {
                "id": bookmark_id,
                "title": bookmark_data.title,
                "url": str(bookmark_data.url),
                "description": bookmark_data.description,
                "category": bookmark_data.category.value,
                "tags": bookmark_data.tags or [],
                "user_id": bookmark_data.user_id,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if self.container:
                # Insert into Cosmos DB
                created_item = self.container.create_item(body=bookmark_doc)
                return Bookmark(**created_item)
            else:
                # Mock storage for development
                self._mock_storage.append(bookmark_doc)
                logger.info(f"Created bookmark in mock storage: {bookmark_doc['title']}")
                return Bookmark(**bookmark_doc)
            
        except exceptions.CosmosHttpResponseError as e:
            logger.error(f"Error creating bookmark: {e.message}")
            raise Exception(f"Failed to create bookmark: {e.message}")
        except Exception as e:
            logger.error(f"Unexpected error creating bookmark: {str(e)}")
            raise Exception(f"Failed to create bookmark: {str(e)}")
    
    async def get_bookmark(self, bookmark_id: str, user_id: str = "default_user") -> Optional[Bookmark]:
        """Get a specific bookmark by ID"""
        try:
            if self.container:
                item = self.container.read_item(
                    item=bookmark_id,
                    partition_key=user_id
                )
                return Bookmark(**item)
            else:
                # Mock storage for development
                for item in self._mock_storage:
                    if item['id'] == bookmark_id and item['user_id'] == user_id:
                        return Bookmark(**item)
                return None
        except exceptions.CosmosResourceNotFoundError:
            return None
        except Exception as e:
            logger.error(f"Error retrieving bookmark {bookmark_id}: {str(e)}")
            raise Exception(f"Failed to retrieve bookmark: {str(e)}")
    
    async def get_bookmarks(
        self, 
        user_id: str = "default_user", 
        category: Optional[str] = None,
        tags: Optional[List[str]] = None,
        page: int = 1,
        page_size: int = 50
    ) -> tuple[List[Bookmark], int]:
        """Get all bookmarks for a user with optional filtering"""
        try:
            if self.container:
                # Build query
                query = "SELECT * FROM c WHERE c.user_id = @user_id"
                parameters = [{"name": "@user_id", "value": user_id}]
                
                if category:
                    query += " AND c.category = @category"
                    parameters.append({"name": "@category", "value": category})
                
                if tags:
                    tag_conditions = []
                    for i, tag in enumerate(tags):
                        tag_param = f"@tag{i}"
                        tag_conditions.append(f"ARRAY_CONTAINS(c.tags, {tag_param})")
                        parameters.append({"name": tag_param, "value": tag})
                    
                    if tag_conditions:
                        query += f" AND ({' OR '.join(tag_conditions)})"
                
                query += " ORDER BY c.created_at DESC"
                
                # Execute query
                items = list(self.container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=True
                ))
            else:
                # Mock storage for development
                items = []
                for item in self._mock_storage:
                    if item['user_id'] != user_id:
                        continue
                    
                    if category and item['category'] != category:
                        continue
                        
                    if tags:
                        item_tags = item.get('tags', [])
                        if not any(tag in item_tags for tag in tags):
                            continue
                    
                    items.append(item)
                
                # Sort by created_at descending
                items.sort(key=lambda x: x['created_at'], reverse=True)
            
            total_count = len(items)
            
            # Apply pagination
            start_index = (page - 1) * page_size
            end_index = start_index + page_size
            paginated_items = items[start_index:end_index]
            
            bookmarks = [Bookmark(**item) for item in paginated_items]
            return bookmarks, total_count
            
        except Exception as e:
            logger.error(f"Error retrieving bookmarks: {str(e)}")
            raise Exception(f"Failed to retrieve bookmarks: {str(e)}")
    
    async def update_bookmark(
        self, 
        bookmark_id: str, 
        bookmark_update: BookmarkUpdate,
        user_id: str = "default_user"
    ) -> Optional[Bookmark]:
        """Update an existing bookmark"""
        try:
            # First, get the existing bookmark
            existing_bookmark = await self.get_bookmark(bookmark_id, user_id)
            if not existing_bookmark:
                return None
            
            # Create update document with only provided fields
            update_data = existing_bookmark.dict()
            update_dict = bookmark_update.dict(exclude_unset=True)
            
            # Convert URL to string if provided
            if 'url' in update_dict and update_dict['url'] is not None:
                update_dict['url'] = str(update_dict['url'])
            
            # Convert category to value if provided
            if 'category' in update_dict and update_dict['category'] is not None:
                update_dict['category'] = update_dict['category'].value
            
            # Update the fields
            update_data.update(update_dict)
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            if self.container:
                # Update in Cosmos DB
                updated_item = self.container.replace_item(
                    item=bookmark_id,
                    body=update_data
                )
                return Bookmark(**updated_item)
            else:
                # Mock storage for development
                for i, item in enumerate(self._mock_storage):
                    if item['id'] == bookmark_id and item['user_id'] == user_id:
                        self._mock_storage[i] = update_data
                        logger.info(f"Updated bookmark in mock storage: {update_data['title']}")
                        return Bookmark(**update_data)
                return None
            
        except exceptions.CosmosResourceNotFoundError:
            return None
        except Exception as e:
            logger.error(f"Error updating bookmark {bookmark_id}: {str(e)}")
            raise Exception(f"Failed to update bookmark: {str(e)}")
    
    async def delete_bookmark(self, bookmark_id: str, user_id: str = "default_user") -> bool:
        """Delete a bookmark"""
        try:
            if self.container:
                self.container.delete_item(
                    item=bookmark_id,
                    partition_key=user_id
                )
                return True
            else:
                # Mock storage for development
                for i, item in enumerate(self._mock_storage):
                    if item['id'] == bookmark_id and item['user_id'] == user_id:
                        deleted_item = self._mock_storage.pop(i)
                        logger.info(f"Deleted bookmark from mock storage: {deleted_item['title']}")
                        return True
                return False
        except exceptions.CosmosResourceNotFoundError:
            return False
        except Exception as e:
            logger.error(f"Error deleting bookmark {bookmark_id}: {str(e)}")
            raise Exception(f"Failed to delete bookmark: {str(e)}")
    
    async def get_categories(self, user_id: str = "default_user") -> List[str]:
        """Get all categories used by the user"""
        try:
            if self.container:
                query = "SELECT DISTINCT c.category FROM c WHERE c.user_id = @user_id"
                parameters = [{"name": "@user_id", "value": user_id}]
                
                items = list(self.container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=True
                ))
                
                categories = [item['category'] for item in items]
            else:
                # Mock storage for development
                categories = []
                for item in self._mock_storage:
                    if item['user_id'] == user_id:
                        categories.append(item['category'])
                categories = list(set(categories))  # Remove duplicates
            
            # Include all available categories from enum
            all_categories = [category.value for category in BookmarkCategory]
            
            # Return unique categories that are either used or available
            unique_categories = list(set(categories + all_categories))
            unique_categories.sort()
            
            return unique_categories
            
        except Exception as e:
            logger.error(f"Error retrieving categories: {str(e)}")
            raise Exception(f"Failed to retrieve categories: {str(e)}")


async def get_bookmark_service():
    """Dependency to get bookmark service"""
    container = await get_database()
    return BookmarkService(container)