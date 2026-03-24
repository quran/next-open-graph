FROM node:24-bookworm-slim

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates; \
    rm -rf /var/lib/apt/lists/*; \
    npm install -g pm2@6

SHELL ["/bin/bash", "-c"]

ENV LANG=en_US.utf8
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN NODE_ENV=development yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["pm2-runtime", "start", "server-http.mjs", "-i", "max", "--max-memory-restart", "1G"]
