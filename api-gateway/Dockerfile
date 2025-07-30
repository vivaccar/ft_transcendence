# --- Estágio 1: Builder ---
# We first build in a more complete version of node
# Then, we use a lighter version to put it in production
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# --- Estágio 2: Produção ---
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/server.js" ]
	