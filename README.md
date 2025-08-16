# PromptHub (Next.js)

Plataforma para gerenciamento e criação de prompts de IA com UI moderna, filtros por categorias/tags e editor com pré‑visualização.

## ✨ Recursos
- Catálogo de prompts com categorias, tags e busca em tempo real
- Drawer para usar prompt com variáveis dinâmicas
- Editor com pré‑visualização e cópia rápida
- Persistência local com Zustand (localStorage)
- UI baseada em Radix + Tailwind
- Efeito opcional de partículas neon (ver Variáveis de ambiente)

## 📦 Requisitos
- Node.js 18+
- npm 9+
- Windows, macOS ou Linux

## 🚀 Início rápido (dev)
```bash
# dentro do diretório do app
cd prompt-hub-nextjs
npm install
npm run dev
# abre em http://localhost:3000 (ou 3001 se 3000 estiver em uso)
```

Se o Next acusar “Found lockfile missing swc dependencies”, rode:
```bash
npm install
```
Em Windows com restrições, instale explicitamente o SWC da sua plataforma:
```bash
npm i -O @next/swc-win32-x64-msvc@15.4.6
```

## 🏭 Build de produção
```bash
npm run build
npm run start
# http://localhost:3000
```

## ⚙️ Variáveis de ambiente
Crie `.env.local` (ou use variável de ambiente) para habilitar scripts públicos opcionais.

```env
# Ativa scripts de performance e partículas neon
NEXT_PUBLIC_ENABLE_PERF_SCRIPTS=1
```
- Quando `=1`, o `layout.tsx` carrega: `scroll-optimization.js`, `performance-monitor.js` e `cyberpunk-particles.js`.
- Quando ausente ou `=0`, esses scripts não são carregados.

### Partículas neon
O arquivo `public/cyberpunk-particles.js` controla o efeito. Parâmetros úteis:
- `particleCount`: quantidade de partículas
- `opacity`: opacidade das partículas
- `connectionDistance`: distância para traçar linhas
- `maxFPS`: taxa máxima de atualização

O canvas é fixo, cobre a tela, tem `pointer-events: none` e `mix-blend-mode: screen` para não bloquear cliques.

## 🗂️ Estrutura
```
prompt-hub-nextjs/
  src/
    app/               # App Router (Next.js)
    components/ui/     # Componentes base (Radix + Tailwind)
    hooks/             # Hooks utilitários
    lib/               # Utilidades transversais (ex.: cn)
    prompt-hub/        # Domínio de prompts (componentes, store, tipos)
  public/
    cyberpunk-particles.js
    performance-monitor.js
    scroll-optimization.js
```

## 🧠 Estado e persistência
- Store: `src/prompt-hub/store/usePrompts.ts` (Zustand + persist)
- Hidratação segura: a página principal aguarda `hasHydrated` antes de renderizar para evitar mismatch SSR/CSR.

## 🧩 Acessibilidade
- Componentes Radix com semântica correta
- Correção de HTML inválido (evitado `<p>` contendo `<div>`, p.ex. trocando `DialogDescription` por `div` quando o conteúdo é rico)

## 🧪 Lint
```bash
npm run lint
```
Principais avisos que podem aparecer em dev (inofensivos):
- `[Violation] 'message' handler took …ms` (HMR/DevTools)
- `Hydration mismatch` quando extensões injetam DOM. Teste em janela anônima.

## 🛠️ Solução de problemas
- Extensões do navegador podem injetar atributos/estilos e causar “Hydration mismatch”. Teste em janela anônima/sem extensões.
- Se a porta 3000 estiver ocupada, o Next usará 3001. Para liberar a 3000 no Windows, finalize o processo que a ocupa.
- Erro de SWC/patch do lockfile: rode `npm install`. Em Windows, se persistir, instale o pacote SWC da plataforma (ver início rápido).

## 📑 Documentação adicional
- Detalhes de performance: `PERFORMANCE.md`

---
Feito com Next.js 15, Tailwind e Radix UI.
