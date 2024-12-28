# Usando a imagem oficial do Node.js
FROM node:18-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos package.json e yarn.lock
COPY package.json yarn.lock ./

# Instalando as dependências
RUN yarn install --frozen-lockfile

# Copiando o restante dos arquivos do projeto
COPY . .

# Construindo a aplicação
RUN yarn build

# Expondo a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start:prod"]
