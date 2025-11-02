#!/bin/bash

# Development startup script for the frontend
echo "🚀 Starting Bookmarks Frontend Development Server..."

# Navigate to frontend directory from scripts folder
cd "$(dirname "$0")/../src/frontend"

# Check if node_modules exists, install dependencies if not
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Set environment variables for development
export BACKEND_URL="http://localhost:8000"

echo "🔧 Backend URL set to: $BACKEND_URL"
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "📊 Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev
