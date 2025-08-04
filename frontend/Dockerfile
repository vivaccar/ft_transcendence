# Stage 1: Build a aplicação
# Usa a imagem oficial do Node.js como base
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto dos arquivos da aplicação
COPY . .

# Executa o build de produção com Vite
RUN npm run build

# Stage 2: Serve a aplicação com Nginx
# Usa uma imagem leve do Nginx
FROM nginx:1.27-alpine AS production

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia o arquivo de configuração customizado do Nginx
# Você precisará criar este arquivo (ver abaixo)
COPY nginx.conf /etc/nginx/conf.d

# Copia os arquivos estáticos gerados no build do stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]