## Desafio 06: Banco de dados e upload de arquivos no Node.js

## **🚀 Sobre o desafio**

Essa é uma aplicação que armazena transações financeiras de entrada e saída e permiti o cadastro e a listagem dessas transações, além de permitir a geração de relatórios a partir do envio de um arquivo csv.

### **🖥 Instalação**

```
    /* Clonar o repositório */
    git clone https://github.com/Jonathan-Sales/gostack11-nodejs-typeorm-e-upload.git

    /* Instalar as dependências */
    yarn

    /* Iniciar o servidor */
    yarn dev:server
```

- Para rodar os testes, execute o comando abaixo:

```
    yarn test
```

### **Rotas da aplicação**

- **`POST /transactions`**: A rota recebe `title`, `value`, `type`, e `category` dentro do corpo da requisição, sendo o `type` o tipo da transação, que deve ser `income` para entradas (depósitos) e `outcome` para saídas (retiradas). Ao cadastrar uma nova transação, ela é armazenada dentro do banco de dados.

- **`GET /transactions`**: Essa rota retorna uma listagem com todas as transações que foram cadastradas até agora, junto com o valor da soma de entradas, retiradas e total de crédito. Essa rota retorna um objeto com o seguinte formato:

  ```
  {
    "transactions": [
      {
        "id": "uuid",
        "title": "Salário",
        "value": 4000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Salary"
        }
      },
      {
        "id": "uuid",
        "title": "Freela",
        "value": 2000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Others"
        }
      },
      {
        "id": "uuid",
        "title": "Pagamento da fatura",
        "value": 4000,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Others"
        }
      },
      {
        "id": "uuid",
        "title": "Cadeira Gamer",
        "value": 1200,
        "type": "outcome",
        "category": {
          "id": "uuid",
          "title": "Recreation"
        }
      }
    ],
    "balance": {
      "income": 6000,
      "outcome": 5200,
      "total": 800
    }
  }
  ```

- **`DELETE /transactions/:id`**: Rota para deletar uma transação com o `id` presente nos parâmetros da rota.

- **`POST /transactions/import`**: A rota permiti a importação de um arquivo com formato `.csv` contendo as mesmas informações necessárias para criação de uma transação `id`, `title`,`value`, `type`, `category_id`, `created_at`, `updated_at`, onde cada linha do arquivo CSV deve ser um novo registro para o banco de dados, e por fim retorna todas as transactions que foram importadas para o banco de dados.

## **📝 Licença**

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/Rocketseat/bootcamp-gostack-desafios/blob/master/desafio-01/LICENSE.md) para mais detalhes.
