from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.models import (
    Bookmark,
    BookmarkCreate,
    BookmarkResponse,
    BookmarksListResponse,
    BookmarkUpdate,
    CategoriesResponse,
)
from backend.services import BookmarkService, get_bookmark_service

router = APIRouter(prefix="/bookmarks", tags=["bookmarks"])


@router.post("/", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def create_bookmark(
    bookmark: BookmarkCreate, service: BookmarkService = Depends(get_bookmark_service)
):
    """Create a new bookmark"""
    try:
        created_bookmark = await service.create_bookmark(bookmark)
        return created_bookmark
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/", response_model=BookmarksListResponse)
async def get_bookmarks(
    user_id: str = Query(default="default_user", description="User ID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    service: BookmarkService = Depends(get_bookmark_service),
):
    """Get all bookmarks for a user with optional filtering"""
    try:
        # Parse tags if provided
        tag_list = None
        if tags:
            tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

        bookmarks, total = await service.get_bookmarks(
            user_id=user_id,
            category=category,
            tags=tag_list,
            page=page,
            page_size=page_size,
        )

        return BookmarksListResponse(
            bookmarks=bookmarks, total=total, page=page, page_size=page_size
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/{bookmark_id}", response_model=BookmarkResponse)
async def get_bookmark(
    bookmark_id: str,
    user_id: str = Query(default="default_user", description="User ID"),
    service: BookmarkService = Depends(get_bookmark_service),
):
    """Get a specific bookmark by ID"""
    try:
        bookmark = await service.get_bookmark(bookmark_id, user_id)
        if not bookmark:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found"
            )
        return bookmark
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.put("/{bookmark_id}", response_model=BookmarkResponse)
async def update_bookmark(
    bookmark_id: str,
    bookmark_update: BookmarkUpdate,
    user_id: str = Query(default="default_user", description="User ID"),
    service: BookmarkService = Depends(get_bookmark_service),
):
    """Update an existing bookmark"""
    try:
        updated_bookmark = await service.update_bookmark(
            bookmark_id, bookmark_update, user_id
        )
        if not updated_bookmark:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found"
            )
        return updated_bookmark
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.delete("/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    bookmark_id: str,
    user_id: str = Query(default="default_user", description="User ID"),
    service: BookmarkService = Depends(get_bookmark_service),
):
    """Delete a bookmark"""
    try:
        deleted = await service.delete_bookmark(bookmark_id, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/categories/", response_model=CategoriesResponse)
async def get_categories(
    user_id: str = Query(default="default_user", description="User ID"),
    service: BookmarkService = Depends(get_bookmark_service),
):
    """Get all bookmark categories"""
    try:
        categories = await service.get_categories(user_id)
        return CategoriesResponse(categories=categories)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
