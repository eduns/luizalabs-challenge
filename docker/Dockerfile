FROM node:lts-slim AS builder

RUN mkdir -p /home/node/api && chown -R node:node /home/node/api

WORKDIR /home/node/api

COPY package*.json .

USER node

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

FROM node:lts-slim

ENV NODE_ENV production

USER node

WORKDIR /home/node/api

COPY package*.json .

RUN npm ci --production

COPY --from=builder /home/node/api/dist ./dist

EXPOSE 8081

CMD [ "node", "./dist/src/infra/index.js" ]