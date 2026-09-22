# AltoTech Manager

Sistema web de gestão para empresas juniores: gestão anual com metas, funil
comercial, projetos com orçamento de horas, lançamento de horas por tipo,
fluxo de caixa e os relatórios da prestação de contas — em um só lugar.

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

Enquanto a autenticação real não está ligada, o login aceita quatro usuários de
exemplo — todos com a senha `altotech`. A tela de login lista os quatro e
preenche o formulário com um clique.

Há um por tipo de permissão, de propósito: dá para ver o menu e os botões
mudarem conforme quem entra.

| E-mail | Cargo | O que vê a mais |
| --- | --- | --- |
| tobias@altotech.ej.br | Presidência | Tudo, incluindo metas e financeiro |
| caio@altotech.ej.br | Diretoria de Projetos | Quadro, alocação e a semana de qualquer membro |
| sofia@altotech.ej.br | Diretoria Financeira | Contas e fluxo de caixa |
| beatriz@altotech.ej.br | Trainee | Só as próprias horas |

### Começar do zero

Os dados de exemplo existem para que nenhuma tela apareça vazia, mas eles também
escondem como o sistema se comporta no primeiro dia de uma EJ. Em
**Como funciona → Testar o sistema do zero** há dois botões: **Zerar os dados**
apaga tudo que está gravado neste navegador, e **Restaurar a demonstração** traz
de volta o exemplo. Dá para ir e voltar quantas vezes quiser.

Zerar grava uma coleção vazia em cada registro em vez de apagar a chave: chave
ausente faz o repositório cair no seed de novo, que é justamente a outra ação. A
lista de coleções não é escrita à mão — cada repositório se registra ao ser
construído em [`createMockRepository`](src/services/mock/createMockRepository.ts),
então um registro novo nunca fica de fora de um reset.

A sessão e o tema não são tocados, e o login de demonstração continua valendo: ele
é uma identidade, não um cadastro de membro. A mesma tela lista, logo abaixo, a
ordem em que um sistema vazio precisa ser preenchido — gestão, membros, clientes,
funil, projeto, alocação, horas, caixa, calendário, painel — porque
cada passo depende do que o anterior criou.

## Estrutura

```
public/              robots.txt, sitemap.xml e a verificação do Google (copiados para dist/)
index.html           metas de SEO e o JSON-LD (FAQPage + SoftwareApplication)
src/
  app/               App, providers (QueryClient + sessão) e o mapa de rotas
  config/
    env/             todas as variáveis de ambiente lidas em um lugar só
    routes.ts        os caminhos das rotas (fora de app/, que importa as páginas)
  domain/
    types/           modelo de domínio (Cycle, Membership, Deal, Allocation…)
    constants/       rótulos, tons e limiares de cada enum (os rótulos são exibidos)
    rules/           predicados do domínio (negociação em aberto, projeto que conta…)
    access/          quem pode o quê: cargo × diretoria × posse do registro
  lib/
    http/            cliente da API: base URL, bearer token, erros
    date/            aritmética de datas YYYY-MM-DD sem fuso (semana, período)
    money/           centavos: conversão, leitura de campo e divisão em parcelas
    format/          formatação pt-BR (moeda, data, horas, percentual)
    utils/           utilidades sem dependência (cn, setField)
    hooks/           hooks genéricos (useNameLookup)
  services/
    types.ts         interfaces da camada de dados (repositórios + relatórios)
    mock/            dados de demonstração e o motor de relatórios (o que roda hoje)
    aws/             mesmas interfaces, implementadas contra a API
    dataLayer.ts     escolhe o adaptador conforme VITE_DATA_SOURCE
  queries/           hooks TanStack Query (useProjects, useCreateClient…), queryKeys
                     e createEntityQueries, que monta os cinco hooks de cada registro
  stores/
    auth/            estado global de autenticação em Zustand
    theme/           preferência de tema (sistema / claro / escuro)
  auth/
    services/        contrato de autenticação, mock e stub do Cognito
    components/      RequireAuth (guard) e SessionLoader (restaura a sessão)
  components/
    ui/              Button, Field, Modal, Sheet, Table, Badge, Avatar,
                     MetricCard, ProgressBar, Skeleton, ThemeToggle, Note…
                     cada um em sua pasta, mais ListState e FormDialog
    ui/icons/        os oito glifos de linha, no mesmo viewBox
    layout/          AppLayout (coluna fixa + sheet no celular), Brand, PageHeader,
                     NoCycle (a tela antes de existir uma gestão)
    reports/         widgets de indicador compartilhados entre telas
  pages/             landing (com sections/), login, dashboard, cycle, calendar,
                     projects, allocation, timeEntries, approvals, funnel, clients,
                     finance, members, reports, guide, notFound
  stories/           fixtures, decorators e tokens compartilhados pelo Storybook
.storybook/          configuração do Storybook
```

> Para **onde escrever cada arquivo** ao mexer no projeto — a ordem dos passos,
> as regras inegociáveis e o que não fazer — veja
> [DESENVOLVIMENTO.md](DESENVOLVIMENTO.md).

### Convenção de pastas

Quando um arquivo teria dentro dele constantes, tipos/interfaces e componentes ou
funções ao mesmo tempo, ele vira uma pasta com um arquivo para cada parte e um
`index.ts` que reexporta o conjunto:

```
components/ui/Button/
  Button.tsx      componente
  constants.ts    BUTTON_VARIANT_CLASSES
  types.ts        ButtonProps, ButtonVariant — lidos também por constants.ts
  index.ts        reexporta os três
```

Assim o import fica `import { Button } from '@/components/ui'` em vez de apontar
para o arquivo interno.

### Anatomia de uma tela

Toda tela do sistema segue a mesma divisão, que é a convenção de pastas acima
aplicada a uma página:

```
pages/dashboard/
  hooks.ts             tudo que a tela precisa saber: consultas, derivações,
                       estado local e efeitos — devolvidos em um objeto tipado
  types.ts             o contrato desse objeto
  constants.ts         rótulos de coluna, formulário vazio, limiares
  DashboardPage.tsx    só a composição: chama o hook e arruma as seções
  GoalsCard.tsx        uma seção, que recebe o que precisa por props
  DeadlinesCard.tsx
  …
```

O arquivo `<Tela>Page.tsx` não chama consulta, não ordena, não filtra e não
guarda estado. Ele lê como um índice do que a tela mostra — e nenhum dos doze
passa de 200 linhas, a maioria fica abaixo de 120.

A separação paga em três frentes: o componente de seção pode ir para o Storybook
sem arrastar a árvore de consultas junto; a derivação fica testável sem montar
React; e quem abre a tela para mudar um texto não precisa ler a lógica de dados
para encontrá-lo.

Duas peças tornam isso possível sem repetição. `ListState` e `QueryState` recebem
a **consulta inteira** — `query={projects}` em vez de `pending` e `error`
separados, que sempre vinham da mesma leitura e podiam ser trocados por engano —
e decidem entre carregando, erro, vazio e conteúdo. O tipo que elas aceitam,
`Loadable<T>`, é declarado na camada de UI e não importa nada do TanStack Query,
então uma tela pode entregar um valor que ela mesma combinou.

A separação vale enquanto a parte tem mais de um leitor. A interface de props que
só o próprio componente usa fica no arquivo do componente — `Badge.tsx` declara
`BadgeProps`, e o `index.ts` reexporta a partir dele. Um `types.ts` de quatro
linhas com um leitor só é um arquivo a abrir sem nada em troca.

### Rotas

| Rota | O que é |
| --- | --- |
| `/` | Landing pública (SEO, FAQ, JSON-LD) |
| `/login` | Acesso ao sistema |
| `/app` | Painel: metas da gestão, prazos, carga da equipe e caixa |
| `/app/gestao` | Gestão anual e suas metas |
| `/app/calendario` | Reuniões, capacitações, eventos e prazos da gestão |
| `/app/projetos` | Quadro de projetos com consumo de horas e margem |
| `/app/alocacao` | Capacidade da equipe: planejado × realizado |
| `/app/horas` | Grade semanal de lançamento de horas |
| `/app/funil` | Funil comercial com origem e motivo de perda |
| `/app/clientes` | Cadastro de clientes e prospecção |
| `/app/financeiro` | Contas a receber e a pagar, com fluxo de caixa |
| `/app/membros` | Pessoas e o cargo que cada uma ocupa na gestão |
| `/app/relatorios` | Consolidado para a prestação de contas |
| `/app/como-funciona` | Manual e roadmap do sistema, para quem for usá-lo |

O menu esconde a tela que o cargo não pode abrir — `/app/financeiro` só aparece
para quem tem a permissão correspondente.


---

## Modelo de domínio

O sistema não é um CRUD por diretoria. Ele modela o ciclo de valor de uma EJ, que
atravessa todas elas:

```
lead → negociação → contrato → projeto → alocação → horas → entrega
     → recebimento → indicadores da gestão
```

Sete decisões sustentam esse modelo, e são as difíceis de reverter depois:

**1. A gestão (`Cycle`) é a dimensão central.** Uma EJ troca a diretoria inteira
todo ano, e a gestão é justamente esse ano: tem diretoria e metas próprias. Um cargo, uma meta ou um faturamento só significam alguma coisa dentro
da gestão a que pertencem, então todo relatório é lido nesse recorte e a virada
de diretoria não sobrescreve nada.

Duas coisas ela deliberadamente **não** tem. Não tem **nome**: nenhuma EJ batiza
suas gestões, elas dizem "a gestão de 2026", então o rótulo é lido de `startsAt`
por `describeCycle` em vez de ser um campo que alguém digita e que pode acabar
discordando das datas ao lado. E não tem **data de fim ao abrir**: a diretoria
não sabe o dia em que entrega o bastão — depende de quando a eleição seguinte
acontece —, então `endsAt` é `null` enquanto ela corre e é carimbado no dia em
que é encerrada. Enquanto está aberta, o "ritmo do ano" que o painel compara as
metas contra é medido até o fim do ano civil (`cycleEnd`, em `domain/rules`), o
que erra para o lado conservador: nunca diz que a diretoria está adiantada
quando não está.

**2. A posição não é coluna de `Member`.** Quem a pessoa é (`Member`) e o que ela
faz nesta gestão (`Membership`: cargo, diretoria, carga semanal) são registros
separados. O consultor de 2025 que vira diretor financeiro em 2026 são duas
posições, não um campo sobrescrito — e o relatório da gestão passada continua
dizendo o que era verdade na época.

A `Membership` também guarda **quando** a pessoa assumiu, e o cálculo de
aproveitamento conta a partir daí. Um trainee admitido em agosto deve oito
semanas de horas; medi-lo contra o ano inteiro o reportaria como ocioso na
primeira semana — exatamente a pessoa sobre quem a gestão de pessoas não pode
receber alarme falso.

**3. Planejado e realizado são entidades distintas.** `Allocation` é quanto se
espera de alguém por semana em um projeto; `TimeEntry` é o que a pessoa lançou.
Enquanto os dois eram a mesma coisa, sobrecarga e ociosidade só apareciam quando
alguém pedia para sair.

**4. Hora tem tipo, e a folha é um guia — não um ponto.** Metade do esforço de
uma EJ não é hora de projeto: é reunião de diretoria, capacitação, prospecção.
Sem `TimeEntryCategory` esse trabalho some do relatório.

O que a `TimeEntry` deliberadamente **não** tem é trilha de aprovação. Ela já
teve — `draft` → `submitted` → `approved`, com `approvedBy` — e o custo disso
era maior que o ganho: uma fila esperando assinatura de diretor produz atraso,
e atraso produz gente reconstituindo a semana de memória na sexta-feira. A folha
existe para a EJ se enxergar, não para ser fiscalizada. Toda hora lançada entra
no relatório na hora, e o número é tão honesto quanto quem o digitou — que era o
que ele ia ser de qualquer jeito.

**5. Lançamento financeiro não depende de projeto.** `FinanceEntry` tem
`projectId` e `clientId` opcionais, e a maior parte do dinheiro de uma EJ não
passa por contrato nenhum: os salgados do coffee break, a mensalidade dos
membros, a contribuição à federação, a premiação de um desafio. Dinheiro que não
tem onde ser registrado acaba no caderno de alguém, então o formulário abre com
"sem vínculo" e pede o projeto por último.

Duas coisas andam junto com isso. `memberId` guarda **quem pagou do próprio
bolso** ou recebeu em nome da EJ — é o que torna o reembolso uma consulta em vez
de uma conversa no grupo. E `receiptRef` guarda a nota fiscal, o recibo ou o
link de onde o arquivo está: texto livre, porque o arquivo em si precisa de um
armazenamento que o sistema ainda não tem, e quem presta contas precisa apontar
para o papel hoje. Um gasto que já aconteceu é registrado em um passo só, com a
data em que o dinheiro se moveu.

**6. Dinheiro é inteiro, em centavos.** Todo valor monetário é `…Cents`. Um
contrato de R$ 11.500 dividido em três parcelas não fecha em ponto flutuante; o
arredondamento acontece uma vez só, em [`src/lib/money`](src/lib/money), na borda
onde alguém digita o valor.

**7. O calendário é registro da gestão, não uma cópia de datas.** `CalendarEvent`
pertence a um ciclo como qualquer outro registro, então o calendário da diretoria
que passou o bastão continua legível em vez de vazar para o da próxima. Duas
consequências disso aparecem na tela: compromisso desmarcado é **cancelado, não
apagado** — fica riscado no mês, porque quem reservou a noite precisa ver o que
houve com ela, e um registro que some parece defeito. E as **entregas dos projetos
são derivadas**, desenhadas a partir de `Project.dueAt` em vez de redigitadas: a
data pertence ao projeto, e uma cópia seria a primeira a discordar do quadro
quando o prazo mudasse. Quando a entrega já foi marcada como compromisso de
verdade — com pauta, sala e responsável — o marcador derivado sai de cena, para o
mesmo prazo não aparecer duas vezes no mesmo dia.

### Permissões

Três eixos, não um nível de confiança
([`src/domain/access/`](src/domain/access)): o **cargo** (presidência, diretoria,
gerente…), a **diretoria** que a pessoa dirige — o financeiro não manda no quadro
de projetos — e a **posse do registro**, que é o que garante que todo membro
mexe nas próprias horas. A regra fica em uma tabela só, e a navegação esconde o
que o usuário não pode abrir.

---

## Aparência

### Tema claro e escuro

Cada token em [`src/index.css`](src/index.css) é um **papel**, não uma cor:
`papel` é a página, `tinta` é o texto, `linha` é a borda. Por isso o tema escuro
é uma troca de valores em um arquivo só — nenhuma tela do sistema carrega classe
`dark:`, e uma tela nova nasce funcionando nos dois temas sem esforço.

Os dois valores de cada papel ficam na **mesma linha**, via `light-dark()`:

```css
--papel: light-dark(#f4f4f8, #131220);
```

que é também a forma que se quer na hora de conferir se um par ainda contrasta.
Trocar de tema é só estreitar o `color-scheme` — `:root[data-theme="dark"]` não
redeclara nenhuma cor. A Lightning CSS, que o Vite já usa, faz o downlevel
automático para navegadores sem suporte.

Duas exceções pedem um token próprio, e é onde a maioria dos temas escuros
quebra: `violeta` é lido como texto e borda, enquanto `violeta-forte` é uma
superfície que carrega texto branco. No claro são a mesma cor; no escuro
precisam se separar, porque um violeta legível sobre um cartão escuro é claro
demais para ficar atrás de tipo branco. O mesmo vale para o vermelho da ação
destrutiva.

São três estados, não um interruptor: **Sistema**, **Claro** e **Escuro**.
"Sistema" não grava nada no `<html>` — deixa a media query decidir, então a
página acompanha o leitor se ele trocar o tema do sistema operacional com a aba
aberta. A escolha fica em [`src/stores/theme/`](src/stores/theme) e um script
inline no `index.html` a carimba **antes da primeira pintura**, para quem
escolheu escuro nunca levar um flash branco ao abrir.

### Escala tipográfica

Nove degraus (`text-2xs` a `text-3xl`), e nada entre eles. As telas carregavam
vinte e duas medidas arbitrárias — `0.74rem` ao lado de `0.76rem` ao lado de
`0.78rem` —, o que o olho lê como ruído: ele passa o tempo remedindo o que está
vendo em vez de assentar numa hierarquia. A escala está documentada na story
**Documentação → Design tokens → Escala tipográfica**.

Junto disso saiu o `uppercase` dos rótulos de métrica, cabeçalhos de tabela e
títulos de coluna. Caixa-alta em 12px é mais lenta de ler e não era hierarquia
nenhuma — só barulho repetido em toda tela.

### Tipografia da página pública

A landing usa uma terceira fonte, `font-destaque` (Plus Jakarta Sans), nos títulos
grandes — e só ali. Uma geométrica larga no peso mais alto é o que dá à página a
presença de produto pago: ali o título carrega a página sozinho, tarefa que a
grotesca mais estreita da interface só cumpriria gritando.

São dois pesos: 800 na capa e 700 nos títulos de seção. Nenhuma tela do sistema
a carrega.

### Largura de leitura

O conteúdo do sistema é limitado a 1200px pela utilidade `leitura`. Sem isso,
num monitor largo uma tabela ou um parágrafo se estica até a borda e o olho
perde a linha em que estava no caminho de volta. Tabelas largas continuam
rolando dentro do próprio container.

### Carregamento

Nenhuma tela mostra spinner: o lugar do conteúdo é ocupado por um **skeleton**
com a forma do que vem — a moldura da tabela, os quatro cartões de indicador, as
barras de meta. O ganho não é estético: o leitor já sabe o que está chegando, e a
página não pula quando os números chegam, então não há nada para reler.

Os blocos são `aria-hidden` e cada composição carrega um `role="status"` só, para
o leitor de tela ouvir uma frase em vez de uma dúzia de caixas vazias. A animação
morre sozinha sob `prefers-reduced-motion`.

O único spinner que sobrou está em `RequireAuth`, restaurando a sessão — ali
ainda não se sabe que tela virá, então não há forma a imitar.

### Ícones

Oito glifos desenhados inline em [`src/components/ui/icons/`](src/components/ui/icons),
todos no mesmo `viewBox` e com a mesma espessura de traço. Setas vindas de três
fontes diferentes nunca se alinham entre si, e as setas de texto (`←`, `→`) que
havia antes mudavam de forma conforme a fonte do sistema.

### Barra lateral

Ela concentra navegação e identidade: grupos por diretoria, e no rodapé o nome,
a foto (ou as iniciais), o cargo na gestão, o seletor de tema e o **sair da
conta** em vermelho.

O título de grupo e o item de menu tinham a mesma cor, e era isso que fazia
"COMERCIAL" parecer clicável. Agora o item é a coisa de maior contraste da barra
e o título a de menor, com um filete separando cada grupo — a hierarquia é lida
antes de qualquer texto.

No celular a mesma barra vira um **sheet** que entra por cima da página, em vez
de empurrar o conteúdo para baixo. É um `<dialog>` nativo, como o `Modal`: Escape
fecha, o foco fica preso dentro e o que está atrás vira inerte — sair da tabulação
de um menu aberto para a página de baixo é como alguém se perde no celular. O
markup é o mesmo do desktop ([`SidebarContent`](src/components/layout/AppLayout/SidebarContent.tsx)):
dois menus separados divergem, e o que ninguém está olhando é o que fica com o
link removido.

## Dados e estado

Duas bibliotecas, com responsabilidades separadas:

**TanStack Query** cuida de tudo que vem de fora — cache, deduplicação,
`isPending` / `isError`, revalidação e invalidação após uma mutação. Os hooks
ficam em [`src/queries/`](src/queries) e são a única porta de entrada das páginas
para os dados:

```tsx
const projects = useProjects()            // { data, isPending, isError, error }
const createProject = useCreateProject()  // o cache se invalida sozinho ao concluir
```

As chaves de cache são montadas em [`src/queries/queryKeys.ts`](src/queries/queryKeys.ts),
para que invalidar `queryKeys.projects.all` alcance também as consultas filtradas.

Nenhuma mutação lista o que invalidar. Toda escrita aqui mexe no que as listas *e*
os relatórios derivam — um lançamento de horas move o painel, um cliente novo move
o quadro —, então a invalidação é um padrão do QueryClient
([`src/app/providers/queryClient.ts`](src/app/providers/queryClient.ts)) em vez de
um par de `invalidateQueries` copiado em cada hook, onde esquecer a metade dos
relatórios deixava os números velhos sem nada para acusar.

**Todo recorte por gestão mora no repositório.** Cada registro pertence a um
ciclo, e perguntar "quais são os desta gestão?" é `listBy({ cycleId })` — nunca
um `.filter()` na tela. Antes de existir para projetos e negociações, esse filtro
estava copiado em nove lugares, e como `x.cycleId === undefined` é silenciosamente
`false`, cada tela precisava de um booleano extra só para não anunciar lista vazia
enquanto o ciclo carregava. Os hooks `useCycleProjects` / `useCycleDeals` /
`useCycleMemberships` recebem o id e ficam desabilitados até ele chegar, o que
mantém o esqueleto na tela sem nenhum encanamento.

Só que "ainda carregando" e "esta EJ não tem gestão nenhuma" são estados
diferentes que chegam iguais na tela, e no segundo a consulta nunca é enviada —
o esqueleto ficaria para sempre, que é exatamente o primeiro dia de uma
instalação nova. Por isso `useActiveCycle` devolve um terceiro campo, `missing`,
lido em um lugar só: [`RequireCycle`](src/app/routes/RequireCycle.tsx), a rota
que embrulha as oito telas com recorte de gestão e mostra
[`NoCycle`](src/components/layout/NoCycle) no lugar delas. É a mesma forma do
`RequireAuth`, e pela mesma razão: decidir quais telas podem ser abertas é
assunto do mapa de rotas, não de oito componentes que precisam lembrar.

A guarda também fica na frente do botão de criar — um projeto salvo com
`cycleId` vazio não pertence a gestão alguma, e nenhum relatório o encontra de
novo. Abrir a gestão, cadastrar cliente, lançar as próprias horas e ler o manual
ficam de fora dela: funcionam desde o primeiro dia.

As perguntas que o sistema faz sobre um registro — se uma negociação está em
aberto, se um projeto conta para os números da gestão, se um compromisso segue de pé —
ficam em [`src/domain/rules/`](src/domain/rules). Cada uma delas já tinha sido
respondida à mão em três lugares diferentes.

Os dez registros (gestões, membros, posições, clientes, negociações, projetos,
alocações, horas, lançamentos financeiros e compromissos) falam com a mesma
interface `CrudRepository`, então seus hooks saem de
[`createEntityQueries`](src/queries/createEntityQueries.ts) — `useList`,
`useDetail`, `useCreate`, `useUpdate` e `useRemove` — em vez de dez módulos quase
iguais. O que cada um tem de próprio entra por cima: `changeStatus` no projeto,
`changeStage` na negociação, `review` nas horas, `settle` no financeiro,
`cancel` no compromisso.

Os agregados (painel, metas, margem, capacidade, funil, caixa) não são somados no
navegador: são um `ReportService` separado. Um ano de lançamentos não cabe
em um `fetch` de lista, e os números precisam bater com os que o relatório final
imprime.

### Telas de registro

As telas de cadastro repetiam a mesma sequência à mão: carregando → erro → vazio →
conteúdo, e abrir diálogo → validar → aguardar a mutação → fechar ou mostrar o
erro. Duas peças concentram isso, e as páginas ficam com a tabela e o formulário:

```tsx
<ListState query={clients} rows={visibleClients} empty={<EmptyState … />}>
  {(rows) => <Table …>}
</ListState>
```

`ListState` decide entre os quatro estados de forma exclusiva — antes, com a
consulta em erro, `data` vinha indefinido e `[].length === 0` fazia o "nenhum
registro cadastrado" aparecer embaixo da mensagem de erro em parte das telas.

`useFormDialog` guarda o rascunho, a validação e a falha; `FormDialog` desenha o
diálogo. Juntos substituem a cópia que cada tela carregava. Criar e editar são o
mesmo diálogo, distinguidos por `editing` — a tela de gestões chegou a ter dois,
o que virou duas cópias do mapeamento de campos e dois diálogos idênticos no
markup, diferindo só na mutation que chamavam.

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

`npm run storybook` abre o catálogo em `localhost:6006` — 110 stories cobrindo os
componentes do projeto, agrupadas em **Documentação**, **UI**, **Layout**,
**Relatórios** e **Páginas**.

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
que a interface sabe sobre dados está em
[`src/services/types.ts`](src/services/types.ts), e tudo o que ela sabe sobre
login está em [`src/auth/services/types.ts`](src/auth/services/types.ts). Existem
duas implementações de cada um, escolhidas por uma variável de ambiente.

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
