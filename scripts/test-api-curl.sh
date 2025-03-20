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

# Test basic-trips endpoint
echo -e "\n${BLUE}Testing basic-trips endpoint${NC}"
RESPONSE=$(curl -s "${BASE_URL}/basic-trips?${TEST_MODE}")

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}GET /basic-trips: SUCCESS${NC}"
  
  # Extract the number of trips
  TRIPS_COUNT=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  echo "Found ${TRIPS_COUNT} trips"
  
  # Extract one trip ID if available
  TRIP_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -n "$TRIP_ID" ]; then
    echo "Sample trip ID: $TRIP_ID"
  else
    echo -e "${RED}No trips found${NC}"
  fi
else
  echo -e "${RED}GET /basic-trips: FAILED${NC}"
  echo "$RESPONSE"
fi

# Test the full trips endpoint
echo -e "\n${BLUE}Testing full trips endpoint${NC}"
RESPONSE=$(curl -s "${BASE_URL}/trips?${TEST_MODE}")

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo -e "${GREEN}GET /trips: SUCCESS${NC}"
  
  # Extract info from the response if available
  if echo "$RESPONSE" | grep -q '"data":'; then
    TRIPS_COUNT=$(echo "$RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
    echo "Found ${TRIPS_COUNT} trips"
  else
    echo "No trip data in response"
  fi
else
  echo -e "${RED}GET /trips: FAILED${NC}"
  echo "$RESPONSE"
fi

echo -e "\n${BLUE}Test completed${NC}"