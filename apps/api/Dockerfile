# 1. Base Image
FROM node:20-slim

# 2. Set up pnpm
RUN npm install -g pnpm

# 3. Set Working Directory
WORKDIR /app

# 4. Copy dependency files and install ALL dependencies
# This is for nodemon and ts-node to be available
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# 5. Copy the rest of the application code
# The .dockerignore file will prevent local node_modules from being copied
COPY . .

# 6. Expose Port
EXPOSE 4000

# 7. Define the default command
# This will be overridden by the command in docker-compose.yml, but it's good practice
CMD [ "pnpm", "run", "dev" ]