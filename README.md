# Crispy Spoon

## Descrição:

Este projeto é a solução em código para o desafio descrito aqui: 
[Desafio Backend - Regras](https://gist.github.com/elrafa-sg/e5c4f9ace0b63d05d4fcfa5fcd45848b)

#### Principais Tecnologias utilizadas:
- [Hono](https://hono.dev)
- [Prisma](https://www.prisma.io)
- [BullMQ](https://docs.bullmq.io)
- [Redis](https://redis.io)
- [Docker](https://www.docker.com)
- [Swagger](https://swagger.io)
- [Zod](https://zod.dev)

## Como usar:

1. Clone o repositório:
   ```
   git clone git@github.com:elrafa-sg/crispy-spoon.git
   ```
2. Dentro da pasta do projeto, instale as dependências\*:
   ```
   yarn install
   ```
3. Configure o acesso ao banco de dados no arquivo .env-sample e renomeie-o para .env

4. Execute os containers utilizados pelo projeto:
   ```
   docker-compose up
   ```

5. Instale o banco de dados:
   ```
   npx prisma migrate dev
   ```

7. Execute o projeto:
   ```
   yarn dev
   ```

8. Execute os testes do projeto (opcional):
   ```
   yarn test
   ```

9. Verifique a cobertura de codigo dos testes (opcional):
   ```
   yarn test:coverage
   ```

#### \* Certifique-se de ter o [Node.js](https://nodejs.org) e [Yarn](https://yarnpkg.com) instalados.
#### \*\* Se preferir utilizar outro gerenciador de pacotes, basta substituir nos comandos anteriores o nome 'yarn' pelo nome do gerenciador de pacotes utilizado.

## Documentação da API:

1. A documentação pode ser acessada após a execução do projeto na rota url:porta/swagger 
(ex: http://localhost:3000/docs)
