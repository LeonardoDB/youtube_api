# Youtube API

## Clone the repository:

- Primeiramente você deverá clonar o projeto;

```
$ git clone https://github.com/LeonardoDB/youtube_api.git
$ cd youtube_api
```

Após clonado você deverá rodar o comando yarn para instalar todas as dependências, após ter finalizado basta rodar yarn dev:server para inicializar a aplicação.

```
$ yarn
$ yarn dev:server
```

🚀 Server started on port 3333

## Routes List:

**⚠️ Dentro do projeto tem um arquivo chamado Insomnia_2021-02-01, ele pode ser utilizado para importar as routes para o Insomnia.**

### Search

| Method     | URI      | Data                                                             |
| ---------- | -------- | ---------------------------------------------------------------- |
| `GET/HEAD` | `search` | `{"term": "flamengo"} or {"term": "flamengo","dailyTime": "20"}` |

Get videos:

- http://localhost:3333/search?term=flamengo
- http://localhost:3333/search?term=flamengo&dailyTime=20
