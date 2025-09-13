FROM node:20

WORKDIR /app

ARG DATABASE_URL

COPY package*.json ./

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3002

RUN npm i

CMD ["./entrypoint.sh"]