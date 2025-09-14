# API de Usuários - Express

Esta API permite registrar, logar e consultar usuários, com armazenamento em memória. Documentação disponível via Swagger.

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```cmd
   npm install express swagger-ui-express swagger-jsdoc
   ```

## Executando a API

- Para iniciar o servidor:
  ```cmd
  node server.js
  ```
- Para importar o app em testes:
  ```js
  const app = require('./app');
  ```

## Endpoints

- `POST /user/register` - Registra novo usuário
- `POST /user/login` - Realiza login
- `GET /user/users` - Lista usuários cadastrados
- `GET /api-docs` - Documentação Swagger

## Regras de Negócio
- Não é permitido registrar usuários duplicados
- Login exige usuário e senha

## Observações
- Os dados são armazenados apenas em memória (variáveis)
- Estrutura separada em controller, service e model
- Documentação automática via Swagger
