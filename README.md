<h1 id="header" align="center">Pokemon Go API</h1>
<p align="center">Projeto simples de API Rest para consumo de "recursos Pokemons"</p>

## Sumário

1. [O que consegui fazer?](#o-que-consegui-fazer)
2. [O que eu gostaria de ter feito a mais?](#o-que-eu-gostaria-de-ter-feito-a-mais)
3. [Comandos úteis](#comandos-úteis)
4. [Como testar?](#como-testar)
5. [Documentação da API](#documentação-da-api)
6. [Observações finais](#observações-finais)

## O que consegui fazer?

* [x] Testes end-to-end (teste da API feitos com TDD)
* [x] Testes de integração (teste dos casos de uso)
* [x] Validação de inputs nas rotas (com Zod)
* [x] Tratamento de erros personalizado com middleware de formatação e modulo "express-async-errors"
* [x] Servir o banco de dados com o Docker
* [x] Implementar repositórios com ORM (Prisma)
* [x] Implementar repositórios com o driver do Postgres sem ORM
* [x] Lidar com SQL Injection usando instruções preparadas no driver Postgres e Prisma ORM

## O que eu gostaria de ter feito a mais?

* Melhorar o retorno de recursos que são paginados. A rota que retorna todos os Pokemons permite que seja feita paginação por meio das query strings `offset` e `limit`, mas, apesar de o retorno ser paginado, ele não está informando nada sobre a paginação, e isso não traz uma boa experiência com o uso da API.
* Documentação da API com Swagger
* Seeds para popular o banco de dados com o arquivo "pokemons.json"
* Testes para mais cenários (ex.: testes para casos de erros `400` lançados após a validação com o Zod)
* Remover responsabilidades dos arquivos de rota, levar para controllers (rotas > controllers > casos de uso)
* Criar entidade de domínio "Pokemon". Acabei não criando por pensar que ficaria anêmico (sem comportamento) e que seria praticamente um DTO

## Comandos úteis

* `docker compose up` - baixa uma imagem mínima do postgresql, cria um container e inicializa o serviço de banco de dados
* `npm run test:ui` - executa todos os testes e abre uma interface gráfica  no navegador para mostra os resultados
* `npm run test:integration` - executa apenas os testes de integração
* `npm run test:e2e` - executa apenas os testes end-to-end
* `npm run dev` - inicializa o servidor de desenvolvimento com ts-node
* `npm run build` - compila todo código typescript e gera o diretório `dist` com o código javascript de produção
* `npm run start` - inicializa o servidor de produção
* `npm run xlsx-to-json ` - executa uma cli com node para adicionar o caminho para um arquivo .xlsx e gerar um arquivo .json
* `npm run prisma:studio` - abre uma interface gráfica no navegador para manipular o banco de dados
* `npm run prisma:migrate dev --name start` - cria a tabela pokemons no banco de dados

## Como testar?

1. `npm install` - instale as dependências do projeto
2. `docker compose up`
3. `npm run prisma:migrate dev --name start`
5. `npm run dev`
6. `npm run test:ui` - verifique se os testes estão passando
7. `npm run prisma:studio` - verifique o banco de dados

## Documentação da API

### Rotas e respostas as solicitações

Uma pequena documentação dos recursos disponíveis com exemplos de filtros, respontas, status code e corpo de solicitações.

URL base: `http://localhost:3000`

**clique nas rotas para ver os detalhes**

<details>
  <summary><code>POST /api/uploads</code></summary>
  </br>
  <p>Insere os registros de Pokemons na base de dados a partir de um arquivo .xlsx.</p>
  <h4>content-type: multipart/form-data</h4>
  <p>A partir de um cliente HTTP use o tipo de Multipart Form com o método POST. Selecione o arquivo .xslx e envie a solicitação.</p>

  **exemplo de solicitação com cURL**

  ~~~sh
  curl --request POST \
  --url http://localhost:3000/api/uploads \
  --header 'content-type: multipart/form-data' \
  --form file=path/to/file.xlsx
  ~~~

  **exemplo de resposta da solicitação**

  ~~~json
  // 201 Created
  {}
  ~~~
</details>
<details>
  <summary><code>GET /api/pokemons</code></summary>
  </br>
  <p>Retorna todos os Pokemons com paginação e filtros.</p>
  <h4>query string params</h4>

  * `?limit=`: *integer* - quantidade de Pokemons por busca (valor padrão = 100)
  * `?offset=`: *integer* - quantidade de Pokemons que quer pular na busca (valor padrão = 0)
  * `?generation=`: *integer* - geração do Pokemon
  * `?evolution_stage=`: *string* | *integer* - estágio evolutivo do Pokemon
  * `?name=`: *string* - buscar pelo nome do Pokemon (considera letras e nomes incompletos)
  * `?type_1=`: *string* - busca pelo tipo principal do Pokemon
  * `?type_2=`: *string* - busca pelo tipo secundário do Pokemon

  **exemplo de solicitação com cURL**

  ~~~sh
  curl --request GET \
  --url 'http://localhost:3000/api/pokemons?name=pikachu&generation=1'
  ~~~

  **exemplo de resposta da solicitação**

  ~~~json
  // 200 OK
  [
    {
      "id": 25,
      "name": "Pikachu",
      "pokedex_ref": 25,
      "image_name": "25",
      "generation": 1,
      "evolution_stage": "1",
      "evolved": 0,
      "family_id": 10,
      "type_1": "electric",
      "type_2": null,
      "weather_1": "Rainy",
      "weather_2": null,
      "stat_total": 283,
      "attack": 112,
      "defense": 101,
      "stamina": 70,
      "legendary": 0
    }
  ]
  ~~~
</details>
<details>
  <summary><code>GET /api/pokemons/{id}</code></summary>
  </br>
  <p>Retorna um Pokemon da base de dados, selecionado pelo seu identificador único.</p>
  <h4>url path params</h4>

  * `id`: *integer* - identificador único do Pokemon

  **exemplo de solicitação com cURL**

  ~~~sh
  curl --request GET \
  --url http://localhost:3000/api/pokemons/25
  ~~~

  **exemplo de resposta da solicitação**

  ~~~json
  // 200 OK
  {
    "id": 25,
    "name": "Pikachu",
    "pokedex_ref": 25,
    "image_name": "25",
    "generation": 1,
    "evolution_stage": "1",
    "evolved": 0,
    "family_id": 10,
    "type_1": "electric",
    "type_2": null,
    "weather_1": "Rainy",
    "weather_2": null,
    "stat_total": 283,
    "attack": 112,
    "defense": 101,
    "stamina": 70,
    "legendary": 0
  }
  ~~~

  <h4>Não encontrou o Pokemon</h4>

  **exemplo de solicitação com cURL**

  ~~~sh
  curl --request GET \
  --url http://localhost:3000/api/pokemons/1000
  ~~~

  **exemplo de resposta da solicitação**

  ~~~json
  // 404 Not Found
  {
    "statusCode": 404,
    "error": "pokemon not found 🔎"
  }
  ~~~
</details>
<details>
  <summary><code>GET /api/pokemons/pokedex/{pokedex_ref}</code></summary>
  </br>
  <p>Retorna um ou mais variantes de um mesmo Pokemon da base de dados, selecionado pela sua referência ou código da pokedex.</p>
  <h4>url path params</h4>

  * `pokedex_ref`: *integer* - referência ou código do Pokemon na pokedex

  **exemplo de solicitação com cURL**

  ~~~sh
  curl --request GET \
  --url http://localhost:3000/api/pokemons/pokedex/386
  ~~~

  **exemplo de resposta da solicitação**

  ~~~json
  // 200 OK
  [
    {
      "id": 386,
      "name": "Deoxys Defense",
      "pokedex_ref": 386,
      "image_name": "386-defense",
      "generation": 3,
      "evolution_stage": "1",
      "evolved": 0,
      "family_id": null,
      "type_1": "psychic",
      "type_2": null,
      "weather_1": "Windy",
      "weather_2": null,
      "stat_total": 574,
      "attack": 144,
      "defense": 330,
      "stamina": 100,
      "legendary": 2
    },
    {
      "id": 387,
      "name": "Deoxys Normal",
      "pokedex_ref": 386,
      "image_name": "386",
      "generation": 3,
      "evolution_stage": "1",
      "evolved": 0,
      "family_id": null,
      "type_1": "psychic",
      "type_2": null,
      "weather_1": "Windy",
      "weather_2": null,
      "stat_total": 560,
      "attack": 345,
      "defense": 115,
      "stamina": 100,
      "legendary": 2
    },
    {
      "id": 388,
      "name": "Deoxys Attack",
      "pokedex_ref": 386,
      "image_name": "386-attack",
      "generation": 3,
      "evolution_stage": "1",
      "evolved": 0,
      "family_id": null,
      "type_1": "psychic",
      "type_2": null,
      "weather_1": "Windy",
      "weather_2": null,
      "stat_total": 560,
      "attack": 414,
      "defense": 46,
      "stamina": 100,
      "legendary": 2
    },
    {
      "id": 389,
      "name": "Deoxys Speed",
      "pokedex_ref": 386,
      "image_name": "386-speed",
      "generation": 3,
      "evolution_stage": "1",
      "evolved": 0,
      "family_id": null,
      "type_1": "psychic",
      "type_2": null,
      "weather_1": "Windy",
      "weather_2": null,
      "stat_total": 548,
      "attack": 230,
      "defense": 218,
      "stamina": 100,
      "legendary": 2
    }
  ]
  ~~~
</details>

## Observações finais

1. Não adicionei todas as colunas da planilha de Pokemons ao banco de dados. Fiz isso porque pensei que para validar o desafio uma abordagem com menos colunas já seria o suficiente, dado que a única diferença seria mapear mais colunas.

2. É possível variar a implementação do repositório à partir do arquivos de rotas

Exemplo do arquivo [src/infra/http/routes/uploads/index.ts](./src/infra/http/routes/uploads/index.ts)

~~~ts
  // trocando o repositório do prisma pelo repositório do driver do postgresql
  // const pokemonRepository = new PrismaPokemonRepositoryDatabase()
  const databaseConnection = new PgAdapter()
  const pokemonRepository = new PokemonRepositoryDatabase(databaseConnection)
  const uploadFile = new UploadFile(pokemonRepository)
  const { buffer } = req.file
  await uploadFile.execute(buffer)
  res.status(201).json({})
~~~

[⬆️ topo](#header)
