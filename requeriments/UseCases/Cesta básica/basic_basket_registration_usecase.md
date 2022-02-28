# Cadastro de cestas básicas

## Funcionalidade

Cadastrar, atualizar e deletar cestas básicas vinculadas ao usuário a fim de que cada um cadastre
conforme a sua realidade

## Cenário: Cadastro

Dado que acesso a rota de usuário

E passo o `id` do usuário e o parametro de cesta básica ex:`/<rotaUsuario>/<idUsuario>/<rotaCestaBasica>`

E que recebo o payload com as informações da cesta básica sendo elas:

```
 {
   "description": string,
   "tb_user_id": number,
   "products": [
     {
       "tb_product_id": number,
       "quantity": number,
       "priority": number
     }
   ]
 }
```

Quando verifico que o usuario existe

E valido os campos

E verifico que há produtos a serem cadastrados

Então a cesta básica é cadastrada

E é criado o vinculo com os produtos

E a rota retorna um HTTP response code `200` com o response `JSON`

```
{
    "tb_basic_basket_id": number, 
    "tb_user_id": number, 
    "responseInfo": {
        "statusCode": 200, 
        "msg": "Cesta básica cadastrada com sucesso"
    }
}
```

## Cenário: Atualização

Dado que acesso a rota de usuário

E passo o `id` do usuário e o parametro de cesta básica e o `tab_basic_basket_id` ex: `/<rotaUsuario>/<idUsuario>/<rotaCestaBasica>/<idCestaBasica>`

E que recebo o payload com as informações da cesta básicas informada acima

Quando verifico que o usuario existe

E verifico que a cesta básica existe

E valido os campos

E verifico que há produtos a serem cadastrados

Então os vinculos da cesta basica com os produtos são deletados e inseridos novamente

E a rota retorna um HTTP response code `200` com o response `JSON`

```
{
    "tb_basic_basket_id": number, 
    "tb_user_id": number, 
    "responseInfo": {
        "statusCode": 200, 
        "msg": "Cesta básica atualizada com sucesso"
    }
}
```

## Cenário: Exclusão

Dado que acesso a rota de usuário

E passo o `id` do usuário, o parametro de cesta básica e o `tab_basic_basket_id` ex: `/<rotaUsuario>/<idUsuario>/<rotaCestaBasica>/<idCestaBasica>`

Quando verifico que o usuario existe

E verifico que a cesta básica existe

Então a cesta básica é deletada

E os vinculos dos produtos também são deletados

E a rota retorna um HTTP response code `200` com o response `JSON`

```
{
    "responseInfo": {
        "statusCode": 200, 
        "msg": "Cesta básica deletada com sucesso"
    }
}
```

## Cenário: Cest básica não encontrada

Dado que recebo o payload com as informações da cesta básica especificadas acima

Quando verifico que o a cesta básica não existe

Então a rota retorna um HTTP response code `400` com o response `JSON`

```
{
  "errorMessage": "Cesta básica não entrontrado não encontrado", 
  "statusCode": 400
}
```

## Cenário: Usuário não encontrado

Dado que recebo o payload com as informações da cesta básica especificadas acima

Quando verifico que o usuário não existe

Então a rota retorna um HTTP response code `400` com o response `JSON`

```
{
  "errorMessage": "Usuário não encontrado", 
  "statusCode": 400
}
```

## Cenário: Falta alguma informação

Dado que recebo o payload com as informações da cesta básica especificadas acima

Quando verifico que algum campo esta `nulo` ou `vazio`

Então a rota retorna um HTTP response code `400` com o response `JSON`

```
{
  "errorMessage": "O campo <campo> não foi preenchido", 
  "statusCode": 400
}
```

## Cenário: Nenhum produto cadastrado

Dado que recebo o payload com as informações da cesta básica especificadas acima

Quando verifico que não foi passado nenhum produto

Então a rota retorna um HTTP response code `400` com o response `JSON`

```
{
  "errorMessage": "Não existem produtos cadastrados nesta cesta", 
  "statusCode": 400
}
```

## Cenário: Erro padrão

Dado que recebo o payload com as informações da cesta básica especificadas acima

Quando ao realizar o registro no banco de dados e ocorrer um erro

Então a rota retorna um HTTP response code `500` com response `JSON`

```
{
  "errorMessage": "Ocorreu um erro: <mensagem>", 
  "statusCode": 500
}
```
