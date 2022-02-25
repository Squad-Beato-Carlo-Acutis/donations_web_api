# Validação de usuário e liberação de token para login

## Descrição
Rota que irá realizar o login do usuário no sistema.

## SUCCESS: Validação
Dado que recebo o payload com as informações do usuário sendo elas:
  `{ email: string, pws: string}`
Quando finalizar a validação dos campos
E o campo `pws` ser criptografado com alguma tecnologia de criptografia segura
E verificar se o usuario com esse `email` e `pws` estão cadastrados no banco na `tab_users`
Então vai ser gerado um token de acesso com expiração em `X` horas
E a rota retorna um HTTP response code `200` com o response `JSON`
  `{token: string}`

## EXCEPTION: Falta alguma informação
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que algum campos esta `nulo` ou `vazio`
Então a rota retorna um HTTP response code `400` com o response `JSON`
  `{errorMessage: "O campo $ não foi preenchido", statusCode: 400}`

## EXCEPTION: Usuario não encontrado
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que o usuario não existe
Então a rota retorna um HTTP response code `406` com o response `JSON`
  `{errorMessage: "Usuário não encontrado", statusCode: 406}`

## EXCEPTION: Erro padrão
Dado que recebo o payload com as informações do usuário especificadas acima
Quando ao realizar o registro no banco de dados e ocorrer um erro
Então a rota retorna um HTTP response code `500` com response `JSON`
  `{errorMessage: "Ocorreu um erro: $", statusCode: 500}`