# Cadastro de Conferencias

## Descrição
Rota que irá o cadastro de conferencia por usuário

## SUCCESS: Cadastro


## EXCEPTION: Falta alguma informação
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que algum campos esta `nulo` ou `vazio`
Então a rota retorna um HTTP response code `400` com o response `JSON`
  `{errorMessage: "O campo $ não foi preenchido", statusCode: 400}`

## EXCEPTION: Erro padrão
Dado que recebo o payload com as informações do usuário especificadas acima
Quando ao realizar o registro no banco de dados e ocorrer um erro
Então a rota retorna um HTTP response code `500` com response `JSON`
  `{errorMessage: "Ocorreu um erro: $", statusCode: 500}`