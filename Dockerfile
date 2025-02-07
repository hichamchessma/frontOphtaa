# Build stage
FROM node:18-alpine AS build  
WORKDIR /app
COPY package*.json ./
RUN npm install 
RUN npm install -g @angular/cli  # Install Angular CLI globally
COPY . .
RUN npm run build  # Ensure this generates the `dist` directory

# Production stage
FROM node:18-alpine  
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["node", "dist/front-ophtaa/main.9aab17471b8b7942.js"]
