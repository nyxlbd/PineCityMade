FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]