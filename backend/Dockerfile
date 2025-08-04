FROM node:20

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "run", "dev"]