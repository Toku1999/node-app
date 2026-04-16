# -------- STAGE 1: BUILD --------
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# -------- STAGE 2: PRODUCTION --------
FROM node:18-alpine

WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --only=production

EXPOSE 4000

CMD ["node", "app.js"]
