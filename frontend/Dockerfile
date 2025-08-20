# Stage 1: Build a aplicação
# Usa a imagem oficial do Node.js como base
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:1.27-alpine AS production

# Instala openssl para criar o certificado
RUN apk add --no-cache openssl

# Remove configuração default
RUN rm /etc/nginx/conf.d/default.conf

# Cria diretório para os certificados
RUN mkdir -p /etc/nginx/ssl

# Gera certificado self-signed
RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/selfsigned.key \
    -out /etc/nginx/ssl/selfsigned.crt \
    -subj "/CN=localhost"

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d

# Copia arquivos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe HTTP e HTTPS
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]