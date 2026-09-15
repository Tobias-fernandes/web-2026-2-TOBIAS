# AltoTech Manager

Sistema web de gestão para empresas juniores: projetos, horas de membros,
clientes e relatórios em um só lugar.

Projeto da disciplina de Desenvolvimento Web — Bacharelado em Tecnologia da
Informação, UFERSA, Campus Pau dos Ferros.

**Publicado em:** https://tobias.feliz.web.ufersa.dev.br/

---

## Tecnologias

| Camada | Escolha |
| --- | --- |
| Build | Vite 8 |
| Interface | React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Rotas | React Router 7 |
| Dados assíncronos | TanStack Query 5 |
| Estado global | Zustand 5 |
| Catálogo de componentes | Storybook 10 |
| Hospedagem | AWS Amplify Hosting (site estático) |

O código é escrito em inglês — nomes de arquivos, variáveis, tipos e comentários.
As únicas strings em português são as que o usuário lê: rótulos, textos de tela e
os caminhos das rotas (que já estão indexados).

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
npm run preview    # serve o dist/ gerado

npm run storybook        # catálogo de componentes em http://localhost:6006
npm run build-storybook  # gera storybook-static/
```

### Acessos de demonstração

Enquanto a autenticação real não está ligada, o login aceita três usuários de
exemplo — todos com a senha `altotech`. A tela de login lista os três e preenche
o formulário com um clique.

| E-mail | Cargo |
| --- | --- |
| tobias@altotech.ej.br | Presidência |
| larissa@altotech.ej.br | Diretoria |
| beatriz@altotech.ej.br | Trainee |

## Estrutura

```
public/              robots.txt, sitemap.xml e a verificação do Google (copiados para dist/)
index.html           metas de SEO e o JSON-LD (FAQPage + SoftwareApplication)
src/
  app/               App, providers (QueryClient + sessão) e o mapa de rotas
  config/env/        todas as variáveis de ambiente lidas em um lugar só
  domain/
    types/           modelo de domínio (Project, Member, Client, TimeEntry…)
    constants/       rótulos e tons de cada enum, em português (são exibidos)
  lib/
    http/            cliente da API: base URL, bearer token, erros
    format/          formatação pt-BR (moeda, data, horas, percentual)
    utils/           utilidades sem dependência (cn)
  services/
    types.ts         interfaces da camada de dados
    mock/            dados de demonstração (o que roda hoje)
    aws/             mesmas interfaces, implementadas contra a API
    dataLayer.ts     escolhe o adaptador conforme VITE_DATA_SOURCE
  queries/           hooks TanStack Query (useProjects, useCreateClient…) + queryKeys
  stores/auth/       estado global de autenticação em Zustand (store, selectors, hooks)
  auth/
    services/        contrato de autenticação, mock e stub do Cognito
    components/      RequireAuth (guard) e SessionLoader (restaura a sessão)
  components/
    ui/              Button, Field, Modal, Table, Badge… cada um em sua pasta
    layout/          AppLayout, Brand, PageHeader
  pages/             landing, login, dashboard, projects, timeEntries,
                     clients, members, reports, notFound
  stories/           fixtures, decorators e tokens compartilhados pelo Storybook
.storybook/          configuração do Storybook
```

### Convenção de pastas

Quando um arquivo teria dentro dele constantes, tipos/interfaces e componentes ou
funções ao mesmo tempo, ele vira uma pasta com um arquivo para cada parte e um
`index.ts` que reexporta o conjunto:

```
components/ui/Button/
  Button.tsx      componente
  constants.ts    BUTTON_VARIANT_CLASSES
  types.ts        ButtonProps, ButtonVariant
  index.ts        reexporta os três
```

Assim o import fica `import { Button } from '@/components/ui'` em vez de apontar
para o arquivo interno.

### Rotas

| Rota | O que é |
| --- | --- |
| `/` | Landing pública (SEO, FAQ, JSON-LD) |
| `/login` | Acesso ao sistema |
| `/app` | Painel com os indicadores da gestão |
| `/app/projetos` | Painel de projetos por situação |
| `/app/horas` | Lançamento e filtro de horas |
| `/app/clientes` | Cadastro de clientes e prospecção |
| `/app/membros` | Equipe, cargos e carga horária |
| `/app/relatorios` | Consolidado para a prestação de contas |

---

## Dados e estado

Duas bibliotecas, com responsabilidades separadas:

**TanStack Query** cuida de tudo que vem de fora — cache, deduplicação,
`isPending` / `isError`, revalidação e invalidação após uma mutação. Os hooks
ficam em [`src/queries/`](src/queries) e são a única porta de entrada das páginas
para os dados:

```tsx
const projects = useProjects()          // { data, isPending, isError, error }
const createProject = useCreateProject()  // invalida projetos e relatórios ao concluir
```

As chaves de cache são montadas em [`src/queries/queryKeys.ts`](src/queries/queryKeys.ts),
para que invalidar `queryKeys.projects.all` alcance também as consultas filtradas.

**Zustand** guarda o estado global que não vem de requisição: a sessão do usuário,
em [`src/stores/auth/`](src/stores/auth). Como não é um contexto React, código
fora da árvore de componentes também lê o estado — é assim que o cliente HTTP pega
o token, sem provider nenhum:

```ts
const token = useAuthStore.getState().session?.accessToken
```

Nos componentes, use os hooks de seleção (`useCurrentUser`, `useSignIn`,
`useSignOut`) em vez do store inteiro: cada um assina uma fatia só e re-renderiza
apenas quando aquela fatia muda.

---

## Storybook

`npm run storybook` abre o catálogo em `localhost:6006` — 78 stories cobrindo os
23 componentes do projeto, agrupadas em **Documentação**, **UI**, **Layout** e
**Páginas**.

As stories ficam ao lado do componente que documentam, seguindo a mesma convenção
de pastas do resto do projeto:

```
components/ui/Button/
  Button.tsx
  constants.ts
  types.ts
  index.ts
  Button.stories.tsx   ← fora do index.ts: é ferramenta, não API pública
```

O que é compartilhado entre stories mora em [`src/stories/`](src/stories), também
dividido por responsabilidade:

| Pasta | O que tem |
| --- | --- |
| `stories/fixtures/` | Objetos de domínio de exemplo (`activeClient`, `overdueProject`…) |
| `stories/decorators/` | `withRouter`, `withQueryClient`, `withAuthenticatedUser`, `withAppSurface` |
| `stories/tokens/` | Referência visual da paleta e da tipografia |

Os fixtures são separados do seed em `src/services/mock` de propósito: assim,
mexer nos dados de demonstração não muda silenciosamente o que uma story mostra.
Cada um existe para exercitar um estado visual — um projeto atrasado, um lead sem
CNPJ, um membro afastado.

Componentes que dependem de contexto recebem um decorator em vez de mocks
espalhados: `Brand` e `AppLayout` ganham um `MemoryRouter`, e `AppLayout` também
tem o store Zustand populado por `withAuthenticatedUser()`, que aceita outro
usuário para conferir como o cargo aparece no topo.

Handlers usam `fn()` de `storybook/test`, então aparecem no painel **Actions** e
podem ser inspecionados como spies.

> **Mantenha `storybook-static/` no `.gitignore`.** O Tailwind varre a pasta do
> projeto e pula o que está ignorado pelo git. Se o build do Storybook ficar
> rastreado, os nomes de classe dentro dele entram na varredura e incham o CSS de
> produção em ~6 kB (medido). Com ele ignorado, os arquivos `.stories.tsx`
> custam só ~0,3 kB (≈60 B gzip) — a mesma folha de estilo serve o app e o
> Storybook, sem gambiarra.

## Integração com a AWS

A aplicação já está dividida para receber o backend sem tocar nas telas. Tudo o
que a interface sabe sobre dados está em `src/services/contracts.ts`, e tudo o
que ela sabe sobre login está em `src/auth/contracts.ts`. Existem duas
implementações de cada um, escolhidas por uma variável de ambiente.

### 1. Dados

Cadastre no console do Amplify (**App settings → Environment variables**):

```
VITE_DATA_SOURCE=aws
VITE_API_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod
```

Os endpoints esperados estão documentados no topo de
[`src/services/aws/apiDataLayer.ts`](src/services/aws/apiDataLayer.ts). Se a API responder em
outro formato, a tradução é feita ali — nenhuma página muda.

### 2. Autenticação (Cognito)

1. Criar um User Pool e um App Client **sem client secret** (app público).
2. `npm i aws-amplify` e configurar no `main.tsx`.
3. Preencher os corpos de [`src/auth/services/cognitoAuthService.ts`](src/auth/services/cognitoAuthService.ts) —
   o passo a passo está no comentário do próprio arquivo.
4. Cadastrar as variáveis:

```
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

`VITE_DATA_SOURCE=aws` liga os dois de uma vez: os dados passam a vir da API e o
login passa pelo Cognito.

> Só variáveis com o prefixo `VITE_` chegam ao navegador — e tudo que chega lá é
> público. Nunca coloque chave secreta, senha ou credencial da AWS nelas.

---

## Deploy no Amplify

O [`amplify.yml`](amplify.yml) já faz `npm ci` + `npm run build` e publica
`dist/`. Duas configurações são feitas **no console**, não no arquivo:

### Rewrite de SPA (obrigatório)

Sem isso, recarregar a página em `/app/projetos` devolve 404, porque esse arquivo
não existe no bucket. Em **Hosting → Rewrites and redirects → Manage redirects**,
use o editor de texto e cole:

```json
[
  {
    "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|xml|webmanifest|html)$)([^.]+$)/>",
    "target": "/index.html",
    "status": "200",
    "condition": null
  },
  {
    "source": "/<*>",
    "target": "/index.html",
    "status": "404-200",
    "condition": null
  }
]
```

A primeira regra desvia para o `index.html` tudo que não tiver extensão de
arquivo — as rotas do sistema. A segunda é a padrão do Amplify e serve de rede
de segurança. **A ordem importa:** o Amplify avalia de cima para baixo, e a
curinga `/<*>` precisa ficar por último.

**A lista de extensões protege arquivos que precisam ser servidos como si
mesmos.** Um rewrite `200` não verifica se o arquivo existe: ele reescreve tudo
que casar com o padrão. Sem `html` na lista, a verificação do Search Console
(`public/google*.html`) passa a devolver o HTML da aplicação e o Google perde a
verificação do domínio. `xml` protege o `sitemap.xml` pelo mesmo motivo.
Ao adicionar um arquivo estático com extensão nova em `public/`, acrescente a
extensão aqui também.

Para conferir depois de publicar:

```bash
curl -s https://SEU-DOMINIO/google*.html | grep google-site-verification
curl -s https://SEU-DOMINIO/sitemap.xml  | head -3
```

### Cabeçalhos

O [`customHttp.yml`](customHttp.yml) na raiz define o cache dos assets com hash e
a revalidação do `index.html`. O Amplify o aplica automaticamente no deploy.

---

## SEO

- As metas, o canonical e os **dois blocos JSON-LD** (`FAQPage` e
  `SoftwareApplication`) ficam estáticos no `index.html`, e não injetados por
  JavaScript — o Google lê o rich result sem depender de renderizar o bundle.
- As perguntas visíveis na landing vêm de
  [`src/pages/landing/constants.ts`](src/pages/landing/constants.ts). **Ao alterar uma
  pergunta, altere também o JSON-LD no `index.html`** — o Google compara os dois.
- `public/google35c43343fb1111f2.html` é a verificação do Search Console e é
  copiado para `dist/` sem alteração. Não renomeie nem apague.
- `public/sitemap.xml` lista hoje apenas a raiz. As rotas de `/app` exigem login
  e ficam de fora de propósito.
