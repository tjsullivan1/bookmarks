#!/bin/bash

# Demo script to test the Bookmarks API
echo "=== Bookmarks API Demo ==="
echo

# Base URL for the API
BASE_URL="http://localhost:8000"
API_BASE="${BASE_URL}/api/v1"

echo "1. Testing API health..."
curl -s "${BASE_URL}/health" | python -m json.tool
echo -e "\n"

echo "2. Getting welcome message..."
curl -s "${BASE_URL}/" | python -m json.tool
echo -e "\n"

echo "3. Testing bookmark validation (should fail with invalid URL)..."
curl -s -X POST "${API_BASE}/bookmarks/" \
  -H "Content-Type: application/json" \
  -d '{"title": "Invalid Bookmark", "url": "not-a-url"}' | python -m json.tool
echo -e "\n"

echo "4. Getting all bookmarks (will fail without database, but shows structure)..."
curl -s "${API_BASE}/bookmarks/" | head -20
echo -e "\n"

echo "5. Getting categories (will fail without database, but shows endpoint)..."
curl -s "${API_BASE}/bookmarks/categories/" | head -20
echo -e "\n"

echo "=== Demo completed ==="
echo "Note: Some operations may fail without a configured Cosmos DB, but this demonstrates"
echo "that the API is properly structured and validates input correctly."
echo
echo "Visit http://localhost:8000/docs for interactive API documentation"
