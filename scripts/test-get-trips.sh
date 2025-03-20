#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Test mode query parameter
TEST_MODE="test_mode=true"

echo "=== Testing GET /trips endpoint ==="
echo "URL: ${BASE_URL}/trips?${TEST_MODE}"

# Make the request
curl -v "${BASE_URL}/trips?${TEST_MODE}"

echo -e "\n\nTest completed" 