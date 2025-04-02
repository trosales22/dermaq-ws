# Build AdonisJS
FROM node:20-alpine as builder
# Set directory for all files
WORKDIR /home/node/app
# Copy source code
COPY . ./
# Install all packages
RUN npm install && npm i -g pm2
# Build AdonisJS for production
RUN npm run build --production
# Set directory for build files
WORKDIR /home/node/app/build
# Copy ENV file
COPY .env ./
# Install all packages
RUN npm ci --production
# Expose port to outside world
ENV TZ=Asia/Manila
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 3335
# Start server up
CMD [ "pm2-runtime", "start", "server.js" ]
