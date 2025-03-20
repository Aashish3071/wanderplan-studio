# WanderPlan Studio

A travel planning platform with interactive 3D maps, AI-powered itinerary generation, and real-time collaboration.

## Features

- **Interactive 3D Maps**: Visualize your travel destinations with immersive 3D maps
- **AI-Powered Itinerary Planning**: Generate personalized travel plans based on your preferences
- **Real-Time Collaboration**: Plan trips with friends and family together
- **Secure Authentication**: Sign in with Google or GitHub

## Tech Stack

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Custom components built with Radix UI
- **State Management**: React Context and Hooks
- **Maps & Visualization**: Three.js for 3D globe interactions

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wanderplan-studio.git
   cd wanderplan-studio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your database credentials and API keys

4. Set up the database:
   ```
   npx prisma db push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/pages`: Next.js pages and API routes
- `/src/components`: Reusable React components
- `/src/hooks`: Custom React hooks
- `/src/lib`: Shared utilities and business logic
- `/src/styles`: Global styles
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 