#!/bin/bash

# Docker Build and Push Script for Bookmarks Backend
# Usage: ./docker-build-push.sh <dockerhub-username> [version]

set -e  # Exit on any error

# Check if username provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <dockerhub-username> [version]"
    echo "Example: $0 myusername v1.0.0"
    exit 1
fi

DOCKERHUB_USERNAME=$1
VERSION=${2:-latest}
IMAGE_NAME="bookmarks-backend"
FULL_IMAGE_NAME="${DOCKERHUB_USERNAME}/${IMAGE_NAME}"

echo "🐳 Building Docker image..."
echo "Image: ${FULL_IMAGE_NAME}:${VERSION}"
echo "----------------------------------------"

# Build the image
docker build -t "${FULL_IMAGE_NAME}:${VERSION}" .

# Also tag as latest if not already latest
if [ "$VERSION" != "latest" ]; then
    docker tag "${FULL_IMAGE_NAME}:${VERSION}" "${FULL_IMAGE_NAME}:latest"
fi

echo "✅ Build completed successfully!"
echo ""

# Ask for confirmation before pushing
read -p "🚀 Push to DockerHub? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing to DockerHub..."

    # Login check
    if ! docker info | grep -q "Username:"; then
        echo "Please login to DockerHub first:"
        docker login
    fi

    # Push the image
    docker push "${FULL_IMAGE_NAME}:${VERSION}"

    # Push latest tag if we created it
    if [ "$VERSION" != "latest" ]; then
        docker push "${FULL_IMAGE_NAME}:latest"
    fi

    echo "✅ Successfully pushed to DockerHub!"
    echo "🔗 View at: https://hub.docker.com/r/${FULL_IMAGE_NAME}"
    echo ""
    echo "📋 To use this image:"
    echo "docker pull ${FULL_IMAGE_NAME}:${VERSION}"
    echo "docker run -p 8000:8000 ${FULL_IMAGE_NAME}:${VERSION}"
else
    echo "❌ Push cancelled."
fi
