# Use uma imagem base do Node.js, versão 18-alpine, que é leve.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala as dependências do projeto.
RUN npm install

# Instala o ngrok globalmente para uso com a flag --tunnel do Expo.
RUN npm install -g @expo/ngrok@^4.1.0

# Copia todo o resto do código-fonte para o contêiner.
COPY . .

# Expõe a porta que o Expo usa para o servidor de desenvolvimento.
EXPOSE 19000 19001

# Define o comando padrão para iniciar o projeto.
CMD ["npx", "expo", "start", "--web", "--tunnel"]