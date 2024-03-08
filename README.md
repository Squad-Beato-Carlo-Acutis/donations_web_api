<h1 align="center">
    <img src="https://user-images.githubusercontent.com/54871916/131072118-025504ed-94c7-46f0-b527-43515359c942.png" width="250px" />
</h1>
<p align="center">🚀 API de integração do site de doações contido <a href="https://github.com/luizbp/doacoesWeb">nesse</a> repositório 🚀</p>

<p align="center"> 
  <img src="https://img.shields.io/github/package-json/v/Squad-Beato-Carlo-Acutis/donations_web_api" alt="Version">
  <img src="https://img.shields.io/github/license/Squad-Beato-Carlo-Acutis/donations_web_api" alt="Licence">
  <img src="https://img.shields.io/github/commit-activity/w/Squad-Beato-Carlo-Acutis/donations_web_api" alt="lask commit">
</p>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install)
- [XAMPP (para rodar o mysql server)](https://www.apachefriends.org/pt_br/index.html)

Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### Rodando o servidor local

```bash
# Clone este repositório
$ git clone https://github.com/Squad-Beato-Carlo-Acutis/donations_web_api.git

# Acesse a pasta do projeto no terminal
$ cd donations_web_api

# Instale as dependências
$ yarn
```

depois crie um arquivo na pasta raiz do projeto com o nome `.env` e copie o conteudo do arquivo `.env.example` sendo:

```bash
ENV_DATABASE_DIALECT= #banco ex: mysql
ENV_DATABASE_HOST= #host do banco ex: localhost
ENV_DATABASE_USERNAME= #username do banco
ENV_DATABASE_PASSWORD= #password do usuario
ENV_DATABASE_DATABASE= #banco onde vai ser criada as tabelas
ENV_SECRET_KEY= #uma chave para ser o token com no maximo 32 caracteres
ENV_ALGORITHM= #algoritmo de criptografia `aes-256-ctr`
ENV_TOKEN_EXPIRATION= #tempo de expiração do token em milissegundos
ENV_IMAGE_DIRECTORY= #diretório onde as imagems são salvas
```

logo após configurar o arquivo

```bash
# Execute as migrations para configurar o banco de dados
yarn sequelize db:migrate

# Execute a aplicação em modo de desenvolvimento
$ yarn dev

# O servidor inciará na porta:3333 - caso queira alterar, altere no arquivo app/server.ts
```

### Utilizando o docker (NEW)

Primeiro configure as variaveis de ambiente que são iguais as informadas acima no arquivo `compose.yaml`

Para buildar a imagem tanto do MYSQL que é necessário para rodar o app, quanto a do próprio app, basta executar o comando abaixo:

**_Atenção, é necessário ter o `docker` rodando na sua maquina_**

```bash

docker compose up -d

```
