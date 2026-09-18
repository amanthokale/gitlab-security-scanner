FROM node:20-bookworm-slim

# Install Git and CA certificates
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "src/server.js"]