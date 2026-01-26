# Stage 1: Build the Frontend
FROM node:20-alpine as builder

WORKDIR /app

# Copy root package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the frontend (React + Vite)
# This creates the /dist folder
RUN npm run build

# Stage 2: Setup the Production Server
FROM node:20-alpine as runner

WORKDIR /app

# Copy the built frontend assets
COPY --from=builder /app/dist ./dist

# Setup Server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# Expose the API port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
