#!/bin/bash

# Start the Bookmarks API server
echo "Starting Bookmarks API..."

# Change to the project root directory
cd "$(dirname "$0")/.."

# Set the Python path to include the src directory
export PYTHONPATH="$(pwd)/src"

# Start the FastAPI server
echo "Server will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
