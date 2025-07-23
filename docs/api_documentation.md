# Bookmarks API Documentation

## Overview

The Bookmarks API is a RESTful web service built with FastAPI that allows users to manage their personal bookmarks with Azure Cosmos DB as the backend database.

## Features

- **Create bookmarks** - Add new bookmark entries with title, URL, description, category, and tags
- **Retrieve bookmarks** - Get all bookmarks or filter by category and tags with pagination
- **Update bookmarks** - Modify existing bookmark entries
- **Delete bookmarks** - Remove bookmarks from the collection
- **Category management** - Get all available categories
- **Validation** - Input validation using Pydantic models
- **Error handling** - Comprehensive error responses
- **Azure Cosmos DB integration** - Production-ready database backend

## Installation and Setup

### Prerequisites

- Python 3.12+
- Azure Cosmos DB account (optional for development)

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables (create a `.env` file):
```env
COSMOS_ENDPOINT=your_cosmos_endpoint_here
COSMOS_KEY=your_cosmos_key_here
COSMOS_DATABASE_NAME=bookmarks_db
COSMOS_CONTAINER_NAME=bookmarks
DEBUG=true
```

3. Run the application:
```bash
cd src/backend
PYTHONPATH=../../src python main.py
```

Or using uvicorn directly:
```bash
cd src
uvicorn backend.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## API Endpoints

### Base URL
- Development: `http://localhost:8000/api/v1`

### Health Check
- **GET** `/` - Welcome message
- **GET** `/health` - Health check status

### Bookmarks Management

#### Create Bookmark
- **POST** `/bookmarks/`
- **Body**:
```json
{
  "title": "Example Website",
  "url": "https://example.com",
  "description": "A useful website",
  "category": "work",
  "tags": ["development", "tools"],
  "user_id": "user123"
}
```

#### Get All Bookmarks
- **GET** `/bookmarks/?user_id=default_user&page=1&page_size=50`
- **Query Parameters**:
  - `user_id` (optional): User identifier (default: "default_user")
  - `category` (optional): Filter by category
  - `tags` (optional): Comma-separated tags to filter by
  - `page` (optional): Page number (default: 1)
  - `page_size` (optional): Items per page (default: 50, max: 100)

#### Get Specific Bookmark
- **GET** `/bookmarks/{bookmark_id}?user_id=default_user`

#### Update Bookmark
- **PUT** `/bookmarks/{bookmark_id}?user_id=default_user`
- **Body**: Any subset of bookmark fields to update

#### Delete Bookmark
- **DELETE** `/bookmarks/{bookmark_id}?user_id=default_user`

#### Get Categories
- **GET** `/bookmarks/categories/?user_id=default_user`

## Data Models

### Bookmark
```json
{
  "id": "uuid-string",
  "title": "string (1-200 characters)",
  "url": "valid URL",
  "description": "string (optional, max 500 characters)",
  "category": "work|personal|education|entertainment|news|shopping|social|technology|other",
  "tags": ["array", "of", "strings"],
  "user_id": "string",
  "created_at": "ISO datetime string",
  "updated_at": "ISO datetime string"
}
```

### Available Categories
- `work` - Work-related bookmarks
- `personal` - Personal bookmarks
- `education` - Educational resources
- `entertainment` - Entertainment sites
- `news` - News sources
- `shopping` - Shopping sites
- `social` - Social media platforms
- `technology` - Tech resources
- `other` - Other bookmarks (default)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

Error responses include detailed messages:
```json
{
  "detail": "Error description"
}
```

## Testing

Run the test suite:
```bash
PYTHONPATH=src python -m pytest tests/backend/ -v
```

## Database Schema

The application uses Azure Cosmos DB with the following document structure:
- **Partition Key**: `user_id`
- **Document ID**: Unique UUID for each bookmark
- **Container**: Stores all bookmark documents with automatic indexing

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://127.0.0.1:3000`

## Development Notes

- The application supports running without Cosmos DB credentials for development
- Interactive API documentation is available at `/docs`
- All datetime fields are stored and returned in ISO format
- URLs are automatically validated and normalized (trailing slashes added)
- The application uses async/await for all database operations

## Deployment Considerations

1. Set proper environment variables in production
2. Configure appropriate CORS origins
3. Set `DEBUG=false` in production
4. Ensure Azure Cosmos DB is properly configured with appropriate throughput
5. Consider implementing authentication and authorization for multi-user scenarios
