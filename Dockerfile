# Use official Node.js LTS image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy all source files
COPY . .

# Expose port (Next.js default)
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
