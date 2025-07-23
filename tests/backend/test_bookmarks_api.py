import os
import sys
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastapi.testclient import TestClient

# Add the src directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "src"))

from backend.models import Bookmark, BookmarkCreate  # noqa: E402


# Mock the database dependency
async def mock_get_database():
    return Mock()


async def mock_get_bookmark_service():
    service = Mock()
    service.create_bookmark = AsyncMock()
    service.get_bookmarks = AsyncMock()
    service.get_bookmark = AsyncMock()
    service.update_bookmark = AsyncMock()
    service.delete_bookmark = AsyncMock()
    service.get_categories = AsyncMock()
    return service


# Import after setting up mocks
with patch("backend.database.get_database", mock_get_database):
    with patch("backend.services.get_bookmark_service", mock_get_bookmark_service):
        from backend.main import app

# Create test client
client = TestClient(app)


class TestBookmarksAPI:
    def test_root_endpoint(self):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data

    def test_health_endpoint(self):
        """Test the health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "database" in data
        assert "version" in data

    def test_create_bookmark_invalid_url(self):
        """Test creating a bookmark with invalid URL"""
        bookmark_data = {
            "title": "Test Bookmark",
            "url": "not-a-valid-url",
            "description": "A test bookmark",
            "category": "work",
            "tags": ["test"],
        }

        response = client.post("/api/v1/bookmarks/", json=bookmark_data)
        assert response.status_code == 422  # Validation error

    @patch("backend.routers.bookmarks.get_bookmark_service")
    async def test_get_bookmarks_success(self, mock_service):
        """Test getting bookmarks returns proper structure"""
        # Mock the service to return empty results
        mock_service_instance = Mock()
        mock_service_instance.get_bookmarks = AsyncMock(return_value=([], 0))
        mock_service.return_value = mock_service_instance

        response = client.get("/api/v1/bookmarks/")
        assert response.status_code == 200
        data = response.json()
        assert "bookmarks" in data
        assert "total" in data
        assert "page" in data
        assert "page_size" in data


# Test the models
class TestBookmarkModels:
    def test_bookmark_create_valid(self):
        """Test creating a valid bookmark model"""
        bookmark_data = {
            "title": "Test Bookmark",
            "url": "https://example.com",
            "description": "A test bookmark",
            "category": "work",
            "tags": ["test", "example"],
        }

        bookmark = BookmarkCreate(**bookmark_data)
        assert bookmark.title == "Test Bookmark"
        assert str(bookmark.url) == "https://example.com/"
        assert bookmark.category.value == "work"
        assert bookmark.tags == ["test", "example"]

    def test_bookmark_create_minimal(self):
        """Test creating a bookmark with minimal data"""
        bookmark_data = {"title": "Test Bookmark", "url": "https://example.com"}

        bookmark = BookmarkCreate(**bookmark_data)
        assert bookmark.title == "Test Bookmark"
        assert str(bookmark.url) == "https://example.com/"
        assert bookmark.category.value == "other"  # Default category
        assert bookmark.tags == []  # Default empty tags

    def test_bookmark_create_validation_error(self):
        """Test validation errors in bookmark creation"""
        # Test missing title
        with pytest.raises(ValueError):
            BookmarkCreate(url="https://example.com")

        # Test missing URL
        with pytest.raises(ValueError):
            BookmarkCreate(title="Test Bookmark")

        # Test invalid URL
        with pytest.raises(ValueError):
            BookmarkCreate(title="Test Bookmark", url="not-a-url")


if __name__ == "__main__":
    pytest.main([__file__])
