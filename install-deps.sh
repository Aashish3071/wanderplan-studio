#!/bin/bash

# WanderPlan Studio Dependency Installer
echo "🚀 Installing WanderPlan Studio dependencies..."

# Install main dependencies
echo "📦 Installing Next.js and React dependencies..."
npm install next@latest react@latest react-dom@latest

# Install authentication dependencies
echo "🔐 Installing authentication dependencies..."
npm install next-auth@latest @next-auth/prisma-adapter

# Install database dependencies
echo "💾 Installing database dependencies..."
npm install @prisma/client
npm install -D prisma

# Install UI dependencies
echo "🎨 Installing UI dependencies..."
npm install @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
npm install -D tailwindcss postcss autoprefixer prettier prettier-plugin-tailwindcss

# Install API route dependencies
echo "🌐 Installing API dependencies..."
npm install next-connect zod

# Install dev dependencies
echo "🛠️ Installing development dependencies..."
npm install -D typescript @types/react @types/node @types/react-dom eslint eslint-config-next

# Initialize TypeScript
echo "📝 Initializing TypeScript configuration..."
npx tsc --init

# Create directories
echo "📁 Creating directory structure..."
mkdir -p src/components/{layout,navigation,ui} src/hooks src/lib src/pages/{api,auth} src/styles

echo "✅ All dependencies installed successfully!" 