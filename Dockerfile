# Self-hosted AutoDex server (web app + sync) for a NAS or home server.
FROM node:25-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:25-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=4174 AUTODEX_DATA_DIR=/data
COPY --from=build /app/dist ./dist
COPY server ./server
COPY src/merge.js ./src/merge.js
COPY package.json ./
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME /data
EXPOSE 4174
CMD ["node", "server/index.mjs"]
