# Enshrouded Crafting Calculator

Uma calculadora visual de crafting para o jogo Enshrouded, com árvore de dependências interativa construída com Next.js, React Flow, Tailwind CSS e shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)

## 🚀 Funcionalidades

- **Árvore de Crafting Interativa**: Visualize toda a cadeia de dependências de crafting usando React Flow
- **Catálogo de Itens**: Navegue por categorias de itens (Armas, Armaduras, Itens Mágicos, etc.)
- **Lista de Materiais**: Acompanhe todos os materiais necessários com checkboxes
- **Progresso de Coleta**: Visualize o progresso de coleta de materiais com indicador circular
- **Design Dark Mode**: Interface escura temática inspirada no jogo Enshrouded
- **Nós Customizados**: Três tipos de nós (Target, Sub-craft, Raw Material) com estilos distintos
- **Zoom e Pan**: Navegue pela árvore com zoom e arrastar
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela

## 🛠️ Tecnologias

- **Next.js 16** - Framework React com App Router e Turbopack
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização utility-first
- **shadcn/ui** - Componentes de UI acessíveis (Button, Input, Checkbox)
- **React Flow (@xyflow/react)** - Biblioteca para criação de fluxos e diagramas interativos
- **Material Symbols** - Ícones do Google

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

## 🏗️ Estrutura do Projeto

```
enshrouded-calculator/
├── app/
│   ├── layout.tsx          # Layout principal com dark mode e fontes
│   ├── page.tsx            # Página principal com layout
│   └── globals.css         # Estilos globais e tema customizado
├── components/
│   ├── header.tsx          # Cabeçalho com navegação e busca
│   ├── sidebar.tsx         # Sidebar com catálogo de itens
│   ├── crafting-tree.tsx   # Componente principal da árvore React Flow
│   ├── materials-list.tsx  # Lista de materiais com checkboxes
│   └── nodes/
│       └── crafting-node.tsx  # Nó customizado do React Flow
└── components/ui/          # Componentes shadcn/ui
    ├── button.tsx
    ├── input.tsx
    └── checkbox.tsx
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

1. **Navegue pelo Catálogo**: Use a sidebar esquerda para explorar categorias de itens
2. **Visualize a Árvore**: A área central mostra a árvore de dependências de crafting
3. **Controles de Zoom**: Use os botões no topo direito para zoom in/out ou centralizar
4. **Marque Materiais**: Use a sidebar direita para marcar materiais coletados
5. **Acompanhe Progresso**: Veja o indicador circular de progresso de coleta

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

- [ ] Adicionar banco de dados com todos os itens do jogo
- [ ] Implementar sistema de busca funcional
- [ ] Salvar progresso localmente (localStorage)
- [ ] Exportar lista de materiais (clipboard/arquivo)
- [ ] Adicionar filtros por estação de crafting
- [ ] Implementar cálculo dinâmico de quantidades
- [ ] Adicionar tooltips com informações detalhadas dos itens
- [ ] Suporte para múltiplos idiomas
- [ ] Modo multiplayer para calcular materiais em grupo
- [ ] Integração com API do jogo (se disponível)

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
