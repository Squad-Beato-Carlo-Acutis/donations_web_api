
 
## Conceito:
Criar uma ferramenta de doações que irá possibilitar que a sociedade contabilize as doações de alimento, e através do estoque gerado, disponibilizar uma plataforma para que as pessoas que queiram doar possam visualizar qual alimento está em falta, deixando um fluxo contínuo de doações assertivas

## Funcionalidades

### Cadastro de sociedade São Vicente de Paulo:
- Cadatrar um `email` e uma `senha` para o usuário admin responsável pela sociedade;

### Cadastro de conferências
- Desd: Cadastrar uma ou mais conferencias vinculadas a uma sociedade (usuário):
  - Nome da conferencia
  - link do avatar
  - texto sobre
  - titulo do endereço
  - endereço
  - horário de funcionamento

### Cadastro de produtos:
- Descrição do produto
- Unidade de Medida

### Cadastro de cesta básica:
- Descrição da cesta básica
- Relação de produtos que a compõe

### Cadastro de cestas utilizadas:
- Cadastrar a quantidade de cestas básicas necessarias para suprir as familias assistidas pela sociedade:
  - id da cesta;
  - quantidade
- Tambem cadastrar os produtos avulsos necessarios para suprir a necessidade das familias;
  - id do produto;
  - quantidade

### Estoque

#### Entrada de Estoque:
- Tela de lançamento de novos produtos doados;
- Funcionalidade de lançamento por um arquivo Excel com um modelo pré-definido (essa funcionalidade foi apontada pelo “cliente” como de grande valor, e até supôs a forma da utilização)
o	Cada conferência (unidade de cada paróquia) não terá acesso ao sistema de cadastro direto, pois o acesso será centralizado na secretaria da sociedade. A ideia é que a secretária irá mandar um Form (Google Forms ou outros) para que cada paróquia cadastre os itens contabilizados na semana e com a geração do Excel desses dados, ela consiga importar para o sistema.

#### Saída de estoque:
- O lançamento poderá ser feito da seguinte forma:
  - Por meio das cestas básicas cadastradas, ou seja, seleciona um tipo de cesta básica e a quantidade, que o sistema dará a saída automaticamente dos itens
  - Terá também uma opção para fazer o lançamento de saída pontual, ou seja, supondo que sobrou duas latas de milho, ou a família precise de um item a mais do que tem nos itens da cesta básica, será possível o lançamento de saída daquele item igual um carrinho de compras, selecionando o item e a quantidade. Pode ser mais de um item.

### Modelo
- Data da movimentação
- Descrição da movimentação
- id do produto
- quantidade
- tipo de movimentação (E/S)

### Controle de Estoque:	
- Este controle de estoque ficará no portal de transparência. 
  - Nele mostraremos os saldos de estoque de cada mercadoria. 
  - Para cada saldo de mercadoria faremos o detalhamento com a devida identificação de compra ou doação Entrada e Saída

### Geração de Relatórios:
- Relação de entrada e saída por período (Mês, semana, todo período);

### Registro de log de Operações
- Registro alterado;
- Usuário de alteração;
- Log de acesso a plataforma;
- Log de quem e quando e que tipo de relatório foi gerado

### Site institucional:
- Colocar informações sobre a instituição, como foto, um texto breve sobre o que é, e o que faz a sociedade.
- Colocar imagens de campanhas ou divulgações de eventos e afins.
- Espaço para colocar local e horário de fazer a doação e uma integração com o Google maps;
- Ter um local onde a pessoa que visita a página de doação, ter acesso a um link que leve as outras conferências cadastradas nessa sociedade listando-as por nome e bairro, facilitando a pessoa a encontrar uma conferência perto da sua residência.
Dashboard:
- Ter um “arrecadometrô “, onde mostra como foram as doações nos últimos 5 meses



### Demais informações:
- Criar um folder(panfletos) para divulgar nas missas, que terá o site e um QR Code para redirecionar para o site (divulgação).
- Divulgar nas redes sociais uma arte com o link do site;
