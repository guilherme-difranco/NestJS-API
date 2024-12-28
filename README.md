<p align="center"> <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a> </p> <p align="center"> <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a> <a href="https://github.com/guilherme-difranco/NestJS-API/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License" /></a> <a href="https://github.com/guilherme-difranco/NestJS-API/actions/workflows/ci.yml" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/guilherme-difranco/NestJS-API/ci.yml?branch=main" alt="CI Status" /></a> <a href="https://coveralls.io/github/guilherme-difranco/NestJS-API?branch=main" target="_blank"><img src="https://coveralls.io/repos/github/guilherme-difranco/NestJS-API/badge.svg?branch=main" alt="Coverage" /></a> <a href="https://discord.gg/seu-discord" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a> </p>

## 📜 Descrição
Este projeto é uma API desenvolvida em NestJS, focada em backend, que inclui funcionalidades de autenticação, um sistema de transações financeiras, gerenciamento de filas com BullMQ, documentação interativa com Swagger, e suporte para execução local e via Docker. A aplicação utiliza PostgreSQL via Neon como banco de dados, Redis via Upstash para gerenciamento de filas, e está containerizada para facilitar o deploy e testes.

## 🚀 Funcionalidades
### Principais Funcionalidades
#### Autenticação

- Registro de usuários (signup).
- Login de usuários (signin) com autenticação via JWT.

#### Sistema de Transações

- Depósitos: Adicionar valores ao saldo do usuário.
- Saques: Remover valores do saldo do usuário com validação de saldo.
- Transferências: Transferir valores entre usuários cadastrados.
- Registro de todas as transações no histórico.

#### Gerenciamento de Filas

- Processamento assíncrono de transações com BullMQ.
- Geração de relatórios diários de transações.
- Painel de monitoramento Bull-Board acessível em /admin/queues.

#### Documentação das Rotas

- Todas as rotas documentadas utilizando Swagger disponível em /docs.

### Funcionalidades Adicionais

- Seeds de Banco de Dados
- Banco de dados PostgreSQL via Neon configurado com dados de exemplo para usuários e transações.

#### Testes Automatizados
- Testes unitários e de integração configurados com Jest.


## 🛠 Tecnologias Utilizadas

- NestJS
- TypeScript
- PostgreSQL via Neon
- Redis via Upstash
- BullMQ
- Swagger
- Docker e Docker Compose
- Prisma (ORM)
- Jest (Testes)

## 📋 Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:

- Docker
- Docker Compose
- Node.js (versão 18 ou superior)
- Yarn (opcional para execução local sem Docker)

## 🏁 Como Rodar o Projeto
1. Rodando com Docker

Passo a Passo

- Clone o repositório:

```bash

git clone https://github.com/guilherme-difranco/NestJS-API
cd NestJS-API
```

2. Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto com as seguintes variáveis (substitua os valores conforme necessário):

env

DATABASE_URL=postgresql://<usuario>:<senha>@postgres:5432/<database>
JWT_SECRET=seu_jwt_secret
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=sua_senha_redis
REDIS_TLS=true
REDIS_USERNAME=seu_usuario_redis
PORT=3000
Notas:

PostgreSQL (Neon): Substitua <usuario>, <senha>, e <database> com suas credenciais do Neon.
Redis (Upstash): Substitua redis, sua_senha_redis, e seu_usuario_redis com suas credenciais do Upstash.
Construa e inicie os contêineres:

bash

docker-compose up --build
Acesse a API:

API: http://localhost:3000
Documentação Swagger: http://localhost:3000/docs
Bull-Board: http://localhost:3000/admin/queues
Rodar Migrations e Seeds dentro do container (se necessário):

Caso seja necessário rodar migrations ou seeds após subir os containers, você pode acessar o container da aplicação:

bash

docker exec -it nestjs-api-app sh
Dentro do container, execute:

bash

yarn prisma migrate dev
yarn seed
2. Rodando Localmente (Sem Docker)
Passo a Passo
Clone o repositório:

bash

git clone https://github.com/guilherme-difranco/NestJS-API
cd NestJS-API
Instale as dependências:

bash

yarn install
Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto com as seguintes variáveis (substitua os valores conforme necessário):

env

DATABASE_URL=postgresql://<neon_user>:<neon_password>@<neon_host>:5432/<neon_db>
JWT_SECRET=seu_jwt_secret
REDIS_HOST=<upstash_redis_host>
REDIS_PORT=6379
REDIS_PASSWORD=<upstash_redis_password>
REDIS_TLS=true
REDIS_USERNAME=<upstash_redis_username>
PORT=3000
Execute as migrações do banco de dados:

bash

yarn prisma migrate dev
Popule o banco de dados com dados de exemplo:

bash

yarn seed
Inicie a aplicação:

bash

yarn start:dev
Acesse a API:

API: http://localhost:3000
Documentação Swagger: http://localhost:3000/docs
Bull-Board: http://localhost:3000/admin/queues
📜 Scripts Disponíveis
Scripts com Yarn
Iniciar a aplicação em modo de desenvolvimento:

bash

yarn start:dev
Compilar o código TypeScript para JavaScript:

bash

yarn build
Iniciar a aplicação no modo de produção:

bash

yarn start:prod
Executar testes unitários:

bash

yarn test
Executar testes de integração (e2e):

bash

yarn test:e2e
Verificar cobertura dos testes:

bash

yarn test:cov
Executar migrações do banco de dados:

bash

yarn prisma migrate dev
Gerar o cliente Prisma:

bash

yarn prisma generate
Popular o banco de dados com dados de exemplo:

bash

yarn seed
🌱 Seeds
Para popular o banco de dados com dados de exemplo, execute:

bash

yarn seed
Isso criará usuários e transações de exemplo para análise do projeto.

🧪 Testes
Os testes estão configurados com Jest. Para rodar os testes, utilize os seguintes comandos:

Executar todos os testes:

bash

yarn test
Executar testes de integração (e2e):

bash

yarn test:e2e
Verificar cobertura dos testes:

bash

yarn test:cov
☁️ Deployment
A aplicação está configurada para ser executada em Docker, facilitando o deploy em diversas plataformas. Para realizar o deploy em serviços como AWS, Heroku ou Vercel, siga os passos abaixo:

Build da Imagem Docker:

bash

docker build -t nestjs-api-app .
Executar a Imagem em Produção:

bash

docker run -d -p 3000:3000 --env-file .env nestjs-api-app
Considerações para Deploy
Variáveis de Ambiente: Certifique-se de configurar as variáveis de ambiente no serviço de hospedagem.
Segurança: Nunca exponha informações sensíveis. Utilize serviços de gerenciamento de segredos quando possível.
Escalabilidade: Para ambientes de produção, considere utilizar orquestradores como Kubernetes para gerenciar a escalabilidade da aplicação.
📚 Recursos
Confira alguns recursos úteis para trabalhar com NestJS:

Documentação Oficial do NestJS
Discord do NestJS - Para dúvidas e suporte.
Cursos Oficiais - Para aprofundar seus conhecimentos.
NestJS Devtools - Ferramentas para visualizar e interagir com sua aplicação NestJS em tempo real.
Prisma Documentation
BullMQ Documentation
Upstash Redis
Neon PostgreSQL
🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

Passos para Contribuir
Fork este repositório

Crie uma branch para sua feature:

bash

git checkout -b minha-nova-feature
Commit suas alterações:

bash

git commit -m 'Adiciona nova feature'
Push para a branch:

bash

git push origin minha-nova-feature
Abra um Pull Request

📫 Como Contribuir
Fork este repositório

Crie uma branch para sua feature:

bash

git checkout -b minha-nova-feature
Commit suas alterações:

bash

git commit -m 'Adiciona nova feature'
Push para a branch:

bash

git push origin minha-nova-feature
Abra um Pull Request

🤝 Suporte
Este projeto está licenciado sob a licença MIT. Para contribuir, reportar problemas ou sugerir melhorias, sinta-se à vontade para abrir uma issue ou enviar um pull request.

📞 Fique em Contato
Autor: Guilherme Di Franco
LinkedIn: Seu LinkedIn
Twitter: @seu_twitter
📝 Licença
Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

🎨 Capturas de Tela
Adicione algumas capturas de tela para ilustrar a aplicação.


📈 Status do Projeto

🔗 Links Úteis
Repositório no GitHub
Documentação do Prisma
Documentação do BullMQ
Swagger
NestJS Documentation
Neon PostgreSQL
Upstash Redis
