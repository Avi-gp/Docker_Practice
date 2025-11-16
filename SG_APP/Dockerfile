# Use Node.js v22 LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the port your app runs on
EXPOSE 5050

# Start the application
CMD ["node", "server.js"]

#Envionment Variables
ENV MONGODB_USERNAME=admin \
    MONGODB_PASSWORD=surya4