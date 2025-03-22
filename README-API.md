# WanderPlan Studio API Documentation

This document provides detailed information about the API integrations in WanderPlan Studio, focusing on AI features, authentication, and database setup.

## AI Integration

### AI Providers

WanderPlan Studio supports multiple AI providers that can be switched based on configuration:

1. **OpenAI Provider** (`src/lib/ai-providers/openai.ts`)

   - Uses the OpenAI API with either GPT-4 or GPT-3.5-Turbo
   - Requires an OpenAI API key in environment variables

2. **Mock Provider** (`src/lib/ai-providers/mock.ts`)
   - Generates mock data for development and testing
   - Doesn't require any API key
   - Useful for local development or when OpenAI API is unavailable

### AI Service

The AI service (`src/lib/ai-service.ts`) provides a unified interface for:

1. **Generating Itineraries**: Creates complete travel itineraries based on destination, dates, budget, and interests
2. **Generating Alternative Itineraries**: Provides different options for the same trip parameters
3. **Suggesting Replacements**: Recommends alternative activities or places for existing itinerary items

### API Endpoints

The following API endpoints are available:

- `POST /api/ai/generate-itinerary`: Generate a new itinerary
- `POST /api/ai/generate-alternative`: Generate alternative versions of an existing itinerary
- `POST /api/ai/suggest-replacement`: Suggest replacement activities

## Authentication

Authentication is implemented using NextAuth with several providers:

1. **OAuth Providers**:

   - Google
   - GitHub

2. **Credentials Provider** (for beta testing)
   - Enabled when `BETA_TESTING=true` in environment variables
   - Allows login with any email without password verification

## Database Setup

### Prisma ORM

The application uses Prisma ORM for database access with support for:

1. **Development**: SQLite database
2. **Production**: PostgreSQL database

### Database Models

Key models in the schema:

- `User`: User accounts
- `Trip`: Travel itineraries
- `ItineraryDay`: Days within a trip
- `Activity`: Individual activities within days
- `Place`: Locations with details
- `Collaboration`: User collaboration on trips

## Environment Variables

### Required Variables

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wanderplan"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# AI Provider
OPENAI_API_KEY="your-openai-api-key"
USE_GPT4="false"
USE_MOCK_AI="false" # Set to true to use mock provider instead of OpenAI

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Beta Testing
BETA_TESTING="false" # Set to true to enable development credentials
```

## Setup Instructions

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local` and add your API keys
3. Install dependencies: `npm install`
4. Generate Prisma client: `npm run prisma:generate`
5. Start the development server: `npm run dev`

### Testing AI Without API Keys

1. Set `USE_MOCK_AI=true` in your `.env.local` file
2. Generate mock data: `npm run generate-mock`
3. Visit `/test-itinerary` to view a sample AI-generated itinerary

## Beta Testing

For beta testing with simplified authentication:

1. Set `BETA_TESTING=true` in `.env.local`
2. Users can sign in with any email without password verification
3. This allows testers to try the app without requiring OAuth setup
