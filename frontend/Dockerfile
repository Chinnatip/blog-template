# Use the latest Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

## Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the Next.js default development port
EXPOSE 3000

# Start the development server
CMD ["yarn", "dev"]
