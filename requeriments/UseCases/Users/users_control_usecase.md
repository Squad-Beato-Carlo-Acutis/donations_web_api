# Controles de usuario

## Funcionalidade:

Cadastrar, atualizar e deletar um usuário do sistema

## Cenário: Cadastro
Dado que acesso a rota de usuário
E que recebo o payload com as informações do usuário sendo elas:
```
{ 
  "email": string, 
  "pws": string, 
  "username": string
}
```
Quando finalizar a validação dos campos
E o campo `pws` ser criptografado
E finalizar o registro das informações no banco MYSQL
Então a rota retorna um HTTP response code `200` com o response `JSON`
```
{
  "id": number, 
  "email": string, 
  "responseInfo": {
    "statusCode": 200, 
    "msg": "Usuário cadastrado com sucesso"
  }
}
```

## Cenário: Falta alguma informação
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que algum campo esta `nulo` ou `vazio`
Então a rota retorna um HTTP response code `400` com o response `JSON`
```
{
  "errorMessage": "O campo <campo> não foi preenchido",
  "statusCode": 400
}
```

## Cenário: Erro padrão
Dado que recebo o payload com as informações do usuário especificadas acima
Quando ao realizar o registro no banco de dados e ocorrer um erro
Então a rota retorna um HTTP response code `500` com response `JSON`
```
{
  "errorMessage": "Ocorreu um erro: <mensagem>",
  "statusCode": 500
}
```
