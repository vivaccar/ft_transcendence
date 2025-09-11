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

ARG SSL_CERT_PATH SSL_KEY_PATH CERT_PATH

# Instala openssl e gettext(PARA ENVSUBST)
RUN apk add --no-cache openssl gettext

# Remove configuração default
RUN rm /etc/nginx/conf.d/default.conf

# Cria diretório para os certificados
RUN mkdir -p ${CERT_PATH}

# Gera certificado self-signed
RUN openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout ${SSL_KEY_PATH} \
    -out ${SSL_CERT_PATH} \
    -subj "/CN=localhost"

# Copia configuração customizada do nginx
COPY nginx.conf .

# Substitui variáveis e coloca em conf.d
RUN envsubst '$SSL_CERT_PATH $SSL_KEY_PATH' < nginx.conf > /etc/nginx/conf.d/default.conf

# Copia arquivos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe HTTP e HTTPS
EXPOSE  8443

CMD ["nginx", "-g", "daemon off;"]
