FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3200

CMD ["npm", "run", "dev"]