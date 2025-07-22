from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BookmarkCategory(str, Enum):
    WORK = "work"
    PERSONAL = "personal"
    EDUCATION = "education"
    ENTERTAINMENT = "entertainment"
    NEWS = "news"
    SHOPPING = "shopping"
    SOCIAL = "social"
    TECHNOLOGY = "technology"
    OTHER = "other"

class BookmarkBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the bookmark")
    url: HttpUrl = Field(..., description="URL of the bookmark")
    description: Optional[str] = Field(None, max_length=500, description="Optional description")
    category: BookmarkCategory = Field(default=BookmarkCategory.OTHER, description="Bookmark category")
    tags: Optional[List[str]] = Field(default=[], description="List of tags for organization")

class BookmarkCreate(BookmarkBase):
    user_id: str = Field(default="default_user", description="User ID for future multi-user support")

class BookmarkUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200, description="Title of the bookmark")
    url: Optional[HttpUrl] = Field(None, description="URL of the bookmark")
    description: Optional[str] = Field(None, max_length=500, description="Optional description")
    category: Optional[BookmarkCategory] = Field(None, description="Bookmark category")
    tags: Optional[List[str]] = Field(None, description="List of tags for organization")

class Bookmark(BookmarkBase):
    id: str = Field(..., description="Unique identifier for the bookmark")
    user_id: str = Field(..., description="User ID who owns this bookmark")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Creation timestamp")
    updated_at: datetime = Field(default_factory=datetime.utcnow, description="Last update timestamp")
    
    model_config = {"from_attributes": True}

class BookmarkResponse(Bookmark):
    """Response model for bookmark operations"""
    pass

class BookmarksListResponse(BaseModel):
    bookmarks: List[BookmarkResponse]
    total: int = Field(..., description="Total number of bookmarks")
    page: int = Field(default=1, description="Current page number")
    page_size: int = Field(default=50, description="Number of items per page")

class CategoriesResponse(BaseModel):
    categories: List[str] = Field(..., description="List of available categories")