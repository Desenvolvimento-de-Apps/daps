# Use uma imagem base do Node.js, versão 18-alpine, que é leve.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
# para que as dependências sejam instaladas primeiro.
# Isso aproveita o cache do Docker para builds mais rápidos.
COPY package*.json ./

# Instala as dependências do projeto.
RUN npm install

# Copia todo o resto do código-fonte para o contêiner.
COPY . .

# Expõe a porta que o Expo usa para o servidor de desenvolvimento.
# O padrão é 19000 e 19001.
EXPOSE 19000 19001

# Define o comando padrão para iniciar o projeto.
# expo start --web é uma boa opção para desenvolvimento e acesso via navegador.
# Se você for construir para Android/iOS, o fluxo de trabalho é diferente,
# geralmente envolvendo a criação de um build nativo.
CMD ["npx", "expo", "start", "--web"]