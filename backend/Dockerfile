# Use Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Create the uploads directory and set permissions
RUN mkdir -p /app/uploads/images && chmod -R 755 /app/uploads/images

# Add volume for image storage (this is optional; ensure volume is set in docker-compose.yml)
VOLUME /app/uploads/images

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all project files into the container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port 4000
EXPOSE 4000

# Set environment variable
ENV NODE_ENV=development

# Run Prisma Migration & Seed Script and start Backend Server
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && if [ \"$NODE_ENV\" = \"development\" ]; then yarn dev; else yarn start; fi"]
