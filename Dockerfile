# Base image
FROM node:19-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY . .

RUN rm -rf /app/apps/queue
# Install dependencies
RUN npm install

# Build the app
RUN npm run build