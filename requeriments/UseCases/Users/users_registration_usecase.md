# Cadastro de clientes

## Descrição
Rota que irá receber um payload com as informações do usuario

## SUCCESS: Cadastro
Dado que recebo o payload com as informações do usuário sendo elas:
  `{ email: string, pws: string, name_user: string}`
Quando finalizar a validação dos campos
E finalizar o registro das informações no banco MYSQL
Então a rota retorna um HTTP response code `200` com o response `JSON` 
  `{id: number, email: string, statusCode: number}`

## EXCEPTION: Falta alguma informação
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que algum campos esta `nulo` ou `vazio`
Então a rota retorna um HTTP response code `400` com o response `JSON`
  `{errorMessage: string, statusCode: number}`

## EXCEPTION: Erro ao registrar no banco
Dado que recebo o payload com as informações do usuário especificadas acima
Quando ao realizar o registro no banco de dados e ocorrer um erro
Então a rota retorna um HTTP response code `400` com response `JSON`
  `{errorMessage: string, statusCode: number}`