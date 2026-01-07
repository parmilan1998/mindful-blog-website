# Use Node.js v22 as the base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# mongodb+srv://mindful:mindful@cluster0.95ynglx.mongodb.net/mindfulDB

# Build the Next.js application
RUN yarn build

# Create a lightweight production image
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src  
COPY --from=builder /app/node_modules ./node_modules

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
