# Forma · Fake Store

Aplicativo acadêmico em **React Native com Expo e JavaScript**, com identidade visual minimalista. Usa **Axios** para consumir a Fake Store API e **React Navigation Native Stack** para navegar entre as telas.

[Repositório no GitHub](https://github.com/Vinicius-Hoffelder/forma-fake-store)

## Rodar o projeto

Requisitos: Node.js 24 LTS, npm e acesso à internet. Para testar no celular, instale uma versão do Expo Go compatível com o **Expo SDK 57**.

Baixe o projeto e execute:

```sh
git clone https://github.com/Vinicius-Hoffelder/forma-fake-store.git
cd forma-fake-store
npm ci
npm start
```

Escaneie o QR code com o Expo Go no Android ou com a câmera no iPhone. O computador e o celular devem estar na mesma rede Wi-Fi. No iPhone, entre com a mesma conta Expo no Expo Go e na CLI, usando `npx expo login` no computador.

Outras opções:

```sh
npm run android
npm run ios
npm run web
```

Android requer um emulador configurado ou um dispositivo conectado. O simulador iOS requer macOS e Xcode. A opção web abre o aplicativo no navegador.

Se a rede impedir a conexão entre o celular e o computador, use:

```sh
npx expo start --tunnel
```

As instruções de conexão estão na [documentação oficial do Expo](https://docs.expo.dev/get-started/start-developing/).

## Verificar usuários para login

Abra [GET https://fakestoreapi.com/users](https://fakestoreapi.com/users) no navegador, ou execute:

```sh
curl https://fakestoreapi.com/users
```

Escolha um usuário da resposta e use os valores dos campos `username` e `password` no formulário. Não é necessário criar uma conta.

Ao enviar o formulário, o aplicativo consulta `/users`, verifica se as credenciais correspondem a um usuário existente e somente depois envia `POST /auth/login`. O acesso aos produtos é liberado quando a API retorna um token válido. A sessão fica na memória: logout ou reinicialização do aplicativo exigem novo login. A Fake Store API oferece contas de demonstração para atividades e testes.

## Funcionalidades

- Login com campos obrigatórios de username e password.
- Produtos em `FlatList`, com imagem, nome e preço.
- Filtro de categoria inicialmente vazio; selecionar uma categoria consulta seu endpoint e limpar o filtro busca todos os produtos novamente.
- Detalhes com imagem, nome, categoria, descrição e preço, consultados pelo ID.
- Header da Home com Logout à esquerda, Produtos ao centro e Informações à direita.
- Tela Informações do Grupo com nomes e RAs.
- `ActivityIndicator` durante as requisições, alertas informativos em erros e opção de tentar novamente nas telas de dados.
- Estado e efeitos com `useState` e `useEffect`.

Os preços são formatados em real brasileiro (`pt-BR`, `BRL`), por exemplo `R$ 199,90`. A formatação usa o valor numérico recebido da API, sem conversão cambial.

## Endpoints usados

| Operação                 | Método | Endpoint                         |
| ------------------------ | ------ | -------------------------------- |
| Consultar usuários       | GET    | `/users`                         |
| Autenticar               | POST   | `/auth/login`                    |
| Listar todos os produtos | GET    | `/products`                      |
| Filtrar categoria        | GET    | `/products/category/{categoria}` |
| Consultar detalhes       | GET    | `/products/{id}`                 |

As categorias disponíveis no filtro são `electronics`, `jewelery`, `men's clothing` e `women's clothing`, com rótulos em português. O serviço também disponibiliza a consulta `/products/categories`.

## Testes

```sh
npm test
```

Os testes usam o executor nativo do Node.js e um adaptador Axios simulado, sem acesso à rede. Verificam a ordem da autenticação, credenciais inválidas, token ausente, filtro e sua limpeza, consulta por ID, falhas de HTTP/rede/timeout, cancelamento e formatação de preços.

## Integrantes

| Nome               | RA      |
| ------------------ | ------- |
| Vinicius Hoffelder | 1137833 |
| Victor Quadri      | 1136643 |
| Joao Buratti       | 1136821 |
| Eduardo Barreda    | 1138704 |

Projeto desenvolvido pelo grupo para o trabalho de consumo de API em React Native. 

