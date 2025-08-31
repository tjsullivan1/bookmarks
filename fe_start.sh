#!/bin/sh

# Set default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-http://localhost:8000}

# Extract the host from BACKEND_URL for the Host header
BACKEND_HOST=$(echo $BACKEND_URL | sed -e 's|^[^/]*//||' -e 's|/.*||')

echo "Backend URL: $BACKEND_URL"
echo "Backend Host: $BACKEND_HOST"

# Replace placeholders in nginx config
sed "s|BACKEND_URL_PLACEHOLDER|$BACKEND_URL|g; s|BACKEND_HOST_PLACEHOLDER|$BACKEND_HOST|g" /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Remove template file
rm /etc/nginx/conf.d/default.conf.template

# Show final config for debugging
echo "Final nginx config:"
cat /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g "daemon off;"
