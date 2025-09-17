# API de Agendamento do Salão de Beleza

Esta API permite registrar, logar e consultar usuários, além de agendar horários para serviços em um salão de beleza. Documentação disponível via Swagger.

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

- `POST /usuario/registrarUsuario` - Registra novo usuário
- `POST /usuario/logarUsuario` - Realiza login
- `GET /usuario/consultarUsuarios` - Lista usuários cadastrados
- `POST /agendamento/marcar` - Marcar agendamento (login obrigatório)
- `PUT /agendamento/desmarcar` - Desmarcar agendamento (login obrigatório)
- `GET /agendamento/horariosDisponiveis` - Listar próximos 5 dias úteis e horários disponíveis
- `GET /agendamento/horariosAgendados/:date` - Listar agendamentos por data
- `GET /api-docs` - Documentação Swagger

## Regras de Negócio
- Não é permitido registrar usuários duplicados
- Login exige usuário e senha
- Só é possível marcar/desmarcar agendamento se estiver logado
- Não é possível agendar o mesmo serviço para o mesmo cliente no mesmo dia e horário
- Não é possível agendar horário já ocupado

## Observações
- Os dados são armazenados apenas em memória (variáveis)
- Estrutura separada em controller, service e model
- Documentação automática via Swagger

## Exemplo de agendamento
```json
{
  "nomeCliente": "Jessica",
  "telefoneCliente": "51982844440",
  "dataAgendada": "17/09/2025",
  "horarioAgendado": "09:00",
  "servico": "CORTE"
}
```

## Exemplo de resposta ao marcar agendamento
```json
{
  "message": "Agendamento realizado com sucesso!",
  "agendamento": {
    "nomeCliente": "Jessica",
    "telefoneCliente": "51982844440",
    "dataAgendada": "17/09/2025",
    "horarioAgendado": "09:00",
    "servico": "CORTE"
  }
}
```

## Exemplo de resposta ao desmarcar agendamento
```json
{
  "message": "Horário agendado foi desmarcado."
}
```
