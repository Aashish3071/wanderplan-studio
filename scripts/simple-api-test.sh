#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000/api"

# Test mode query parameter
TEST_MODE="test_mode=true"

# Text colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== WanderPlan API Test ===${NC}"

# Create a test trip
echo -e "\n${BLUE}Creating a test trip${NC}"
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/trips?${TEST_MODE}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Trip via API",
    "description": "A test trip created via API",
    "destination": "Test City",
    "startDate": "2023-06-01",
    "endDate": "2023-06-07",
    "budget": 1000,
    "isPublic": true
  }')

echo "Response: $CREATE_RESPONSE"

# Extract trip ID if available
TRIP_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$TRIP_ID" ]; then
  echo -e "${GREEN}Successfully created trip with ID: ${TRIP_ID}${NC}"
  
  # Get trip details
  echo -e "\n${BLUE}Fetching trip details${NC}"
  TRIP_RESPONSE=$(curl -s -X GET "${BASE_URL}/trips/${TRIP_ID}?${TEST_MODE}")
  echo "Response: $TRIP_RESPONSE"
  
  # List all trips
  echo -e "\n${BLUE}Listing all trips${NC}"
  LIST_RESPONSE=$(curl -s -X GET "${BASE_URL}/trips?${TEST_MODE}")
  echo "Response: $LIST_RESPONSE"
else
  echo -e "${RED}Failed to create trip${NC}"
fi

echo -e "\n${BLUE}Test completed${NC}" 