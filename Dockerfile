# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate an encryption key if not set
RUN export VITE_ENCRYPTION_KEY=${VITE_ENCRYPTION_KEY:-$(openssl rand -hex 32)}

# Expose Vite's default port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]
