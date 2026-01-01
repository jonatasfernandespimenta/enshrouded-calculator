# Enshrouded Crafting Calculator

Uma calculadora de crafting completa para o jogo Enshrouded, com cálculo recursivo de materiais, busca inteligente e tracking de progresso. Construída com Next.js, TypeScript, Tailwind CSS e shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)
![Tests Passing](https://img.shields.io/badge/tests-16%20passing-success?style=flat-square)

## 🚀 Funcionalidades

### ✨ Core Features
- **Cálculo Recursivo de Materiais**: Algoritmo determinístico que calcula toda a árvore de dependências
- **Multiplicação Correta**: Suporta receitas com `outputQuantity > 1` (ex: 2 barras por craft)
- **Busca Inteligente**: Autocomplete com Fuse.js, navegação por teclado (arrows, enter, esc)
- **Árvore Colapsável**: Visualize dependências com expand/collapse, expand all, collapse all
- **Tracking de Progresso**: Marque materiais coletados e veja progresso em tempo real
- **Persistência**: Estado salvo no localStorage (itens selecionados, progresso, preferências)

### 🎯 Filtros e Visualizações
- **Base Materials Only**: Filtre apenas materiais não-craftáveis
- **Group by Station**: Agrupe materiais por estação de crafting
- **Categorias Dinâmicas**: Navegue por categorias (Magical Items, Materials, Production Places)
- **Quantidade Ajustável**: Defina quantidade desejada e veja cálculos automáticos

### 🎨 UI/UX
- **Design Dark Mode**: Tema inspirado no Enshrouded com cores customizadas
- **Indicadores Visuais**: Cores distintas para estações (forge, kiln, alchemist, etc.)
- **Copiar Lista**: Botão para copiar lista de materiais para clipboard
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** - Framework React com App Router e Turbopack
- **TypeScript** - Tipagem estática completa
- **Tailwind CSS 4** - Estilização utility-first
- **shadcn/ui** - Componentes de UI acessíveis (Button, Input, Checkbox)
- **Material Symbols** - Ícones do Google

### Estado e Lógica
- **Zustand** - Gerenciamento de estado global com persistência
- **Fuse.js** - Busca fuzzy para autocomplete
- **Zod** - Validação de schemas e tipos runtime

### Scraping e Dados
- **Cheerio** - Parsing de HTML para scraping
- **Playwright** - Fallback para sites com JavaScript

### Testes
- **Vitest** - Framework de testes unitários (16 testes passando)

## 📦 Instalação

```bash
# Navegue até o diretório do projeto
cd enshrouded-calculator

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏭️ Estrutura do Projeto

```
enshrouded-calculator/
├── app/
│   ├── layout.tsx          # Layout principal com dark mode
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globais e tema
├── components/
│   ├── header.tsx          # Cabeçalho com busca
│   ├── sidebar.tsx         # Sidebar com categorias
│   ├── search-bar.tsx      # Busca com Fuse.js
│   ├── crafting-tree-view.tsx  # Árvore colapsável
│   ├── materials-list.tsx  # Lista de materiais
│   ├── recipes-provider.tsx # Provider para carregar dados
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── schemas.ts          # Schemas Zod
│   ├── resolveCrafting.ts  # Algoritmo de cálculo
│   ├── resolveCrafting.test.ts # Testes
│   └── store.ts            # Zustand store
├── scripts/
│   └── scrape-ign.ts       # Scraper do IGN Wiki
└── data/
    └── recipes.json        # Dados de receitas
```

## 🎨 Customização de Cores

O projeto utiliza um esquema de cores customizado inspirado no Enshrouded:

- **Primary**: `#13ec5b` (Verde brilhante)
- **Background Dark**: `#102216`
- **Surface Dark**: `#111813`
- **Surface Lighter**: `#1c2a21`
- **Border**: `#28392e`
- **Text Muted**: `#9db9a6`

Essas cores estão definidas em `app/globals.css` e podem ser ajustadas conforme necessário.

## 🎮 Como Usar

1. **Busque ou Navegue**: Use a busca (header) ou sidebar para encontrar itens
2. **Selecione um Item**: Clique em qualquer item craftável
3. **Ajuste Quantidade**: Defina quantos você quer craftar (input no topo da árvore)
4. **Explore a Árvore**: Clique nos nós para expand/collapse dependências
5. **Marque Progresso**: Use checkboxes na sidebar direita para marcar materiais coletados
6. **Copie Lista**: Botão COPY para copiar lista de materiais
7. **Filtre**: Toggle "Base materials only" para ver apenas materiais finais

### Atalhos de Teclado (Busca)
- **Arrow Down/Up**: Navegar resultados
- **Enter**: Selecionar item
- **Escape**: Fechar busca

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Lint
npm run lint
```

## 🔧 Adicionando Novos Componentes shadcn/ui

```bash
npx shadcn@latest add [component-name]
```

Exemplo:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

## 🎯 Próximos Passos

### Funcionalidades Implementadas ✅
- [x] Sistema de busca com autocomplete (Fuse.js)
- [x] Cálculo recursivo de materiais
- [x] Persistência no localStorage
- [x] Exportar lista (clipboard)
- [x] Filtros (base materials, by station)
- [x] Cálculo dinâmico de quantidades
- [x] Tracking de progresso
- [x] Scraper para IGN Wiki

### Roadmap Futuro 🛣️
- [ ] Expandir recipes.json com todos os itens do jogo
- [ ] Múltiplas receitas por item (recipe overrides UI)
- [ ] Deep links (/item/[id]?qty=5)
- [ ] Gráficos (Recharts): top materiais, por estação
- [ ] Item details modal (receita completa, "used by")
- [ ] Export para CSV/JSON
- [ ] Modo claro (light theme)
- [ ] Suporte para múltiplos idiomas
- [ ] PWA (Progressive Web App)
- [ ] Modo multiplayer (cálculo para grupo)

## 🐛 Troubleshooting

### Erro de porta em uso
Se a porta 3000 estiver em uso:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Cache do Next.js
Se houver problemas de build:
```bash
rm -rf .next
npm run dev
```

## 📄 Licença

Este projeto é um fan-made e não possui afiliação oficial com Enshrouded ou seus desenvolvedores (Keen Games GmbH).

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se livre para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

## 🙏 Agradecimentos

- **Keen Games GmbH** - Desenvolvedores do Enshrouded
- **Vercel** - Hospedagem e framework Next.js
- **shadcn** - Componentes UI de alta qualidade
- **React Flow** - Biblioteca poderosa para diagramas
