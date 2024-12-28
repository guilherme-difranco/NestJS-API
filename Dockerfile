# Usando a imagem oficial do Node.js (Debian-based)
FROM node:18

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de dependências
COPY package.json yarn.lock ./

# Instalando as dependências
RUN yarn install --frozen-lockfile

# Copiando o diretório prisma para gerar o cliente Prisma
COPY prisma ./prisma

# Gerando o cliente Prisma
RUN npx prisma generate

# Copiando o restante dos arquivos do projeto
COPY . .

# Construindo a aplicação
RUN yarn build

# Expondo a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "start:prod"]
