# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

# Final stage
FROM node:18-alpine

WORKDIR /app
COPY --from=build /app /app

EXPOSE 4000

CMD ["node", "app.js"]]
