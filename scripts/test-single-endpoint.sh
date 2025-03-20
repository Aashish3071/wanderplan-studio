#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Test endpoint
ENDPOINT="/trips"

# Add debug information
echo "Testing endpoint: ${BASE_URL}${ENDPOINT}?test_mode=true"
echo "With detailed output..."

# Make the request with verbose output
curl -v "${BASE_URL}${ENDPOINT}?test_mode=true" 