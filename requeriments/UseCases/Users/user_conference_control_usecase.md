# Cadastro de conferencias

## Funcionalidade: 
Cadastrar novas conferencias e vinculalas ao o usuario

## Cenário: Cadastro
Dado que acesso a rota de usuário 
E passo o `id` do usuário e o parametro de conferencia ex:`/<rotaUsuario>/<idUsuario>/<rotaConferencia>`
E que recebo o payload com as informações da conferencia sendo elas:
 `{"description": string, "link_avatar": string, "about": string, "title_addres": string, "address": string, "opening_hours": string }`
Quando valido os campos
E verifico que o usuario existe
Então a rota retorna um HTTP response code `200` com o response `JSON`
  `{userId: number, conferenceId: number, responseInfo: {statusCode: 200, msg: "Conferencia cadastrada com sucesso"}}`


## Cenário: Falta alguma informação
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que algum campo esta `nulo` ou `vazio`
Então a rota retorna um HTTP response code `400` com o response `JSON`
  `{errorMessage: "O campo <campo> não foi preenchido", statusCode: 400}`

## Cenário: Usuário não encontrado
Dado que recebo o payload com as informações do usuário especificadas acima
Quando verifico que o usuário não existe
Então a rota retorna um HTTP response code `400` com o response `JSON`
  `{errorMessage: "Usuário não encontrado", statusCode: 400}`

## Cenário: Erro padrão
Dado que recebo o payload com as informações do usuário especificadas acima
Quando ao realizar o registro no banco de dados e ocorrer um erro
Então a rota retorna um HTTP response code `500` com response `JSON`
  `{errorMessage: "Ocorreu um erro: <mensagem>", statusCode: 500}`