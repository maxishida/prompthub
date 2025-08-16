import type { Prompt } from "../types";
import { detectVariables } from "../lib/utils";

// Fixed timestamp to avoid hydration mismatches
const FIXED_TIMESTAMP = 1704067200000; // 2024-01-01 00:00:00 UTC
let idCounter = 1;

const mk = (name: string, category: Prompt["category"], content: string, tags: string[], extra?: Partial<Prompt>): Prompt => ({
  id: `prompt_${idCounter++}`, name, category, content, tags,
  variables: detectVariables(content).map(v => ({ key: v.key })),
  createdAt: FIXED_TIMESTAMP, updatedAt: FIXED_TIMESTAMP, language: 'pt', targetModel: 'generic', ...extra
});

// 36 prompts (6 por categoria)
export const seedPrompts: Prompt[] = [
  // Codar
  mk("Gerar endpoint REST seguro (NestJS)", "Codar", `Crie um endpoint REST seguro em NestJS.
Requisitos:
- Recurso: {{recurso}}
- Métodos: GET, POST, PUT, DELETE
- Autenticação: JWT + RBAC (roles: admin,user)
- Validação com Zod
- Testes e2e resumidos
Saída em passos numerados.`, ["API","Segurança","NestJS"], { targetModel: 'openai' }),
  mk("Especificação OpenAPI 3 a partir de requisitos", "Codar", `Transforme requisitos em OpenAPI 3.0.
Entradas: {{titulo}}, {{descricao}}, {{entidades}}
Inclua schemas, responses e exemplos mínimos.`, ["OpenAPI","Arquitetura"]),
  mk("Refatoração com justificativas de complexidade", "Codar", `Refatore o código fornecido destacando:
- Acoplamento, coesão e complexidade ciclomática
- Sugira padrões (ex.: Strategy, Factory)
- Mostre diff resumido
Código:
{{codigo}}`, ["Refatoração","Padrões"]),
  mk("Checklist de PR (backend)", "Codar", `Gere checklist sucinto para revisão de PR.
Contexto: {{contexto}}
Itens: testes, logs, erros, transações, segurança, docs.`, ["Processo","Qualidade"]),
  mk("SQL otimizado com índices", "Codar", `Otimize consulta SQL.
Tabela(s): {{tabelas}}
Filtro: {{filtro}}
Retorne query otimizada e índices recomendados.`, ["SQL","Performance"]),
  mk("Estruturar monorepo (pnpm)", "Codar", `Proponha estrutura mínima para monorepo pnpm workspaces.
Pacotes: {{pacotes}}
Inclua scripts e padrões de commit.`, ["DevOps","Monorepo"]),

  // Design
  mk("Briefing landing page neon", "Design", `Crie briefing de landing page estilo neon escuro.
Produto: {{produto}}
Público: {{publico}}
Inclua: sections, herói, CTA, paleta ciano→magenta, tipografia.`, ["UI","Neon"]),
  mk("Guia de tom/voz para marca", "Design", `Crie guia de tom e voz.
Marca: {{marca}}
Tom: {{tom}}
Inclua do/don't e exemplos curtos.`, ["Branding","Conteúdo"]),
  mk("Checklist UX de formulário", "Design", `Checklist UX para formulário.
Contexto: {{contexto}}
Cobrir: rótulos, validação, acessibilidade, estados.`, ["UX","Acessibilidade"]),
  mk("Paleta dark+neon", "Design", `Gere paleta dark+neon com 5 cores e variações.
Tema: {{tema}}
Forneça em HSL e tokens CSS.`, ["Cores","Token"]),
  mk("Wireframe de dashboard", "Design", `Liste blocos e hierarquia para dashboard.
Objetivo: {{objetivo}}
Inclua grid e prioridades visuais.`, ["UX","Layout"]),
  mk("Microcopys para onboarding", "Design", `Escreva microcopys amigáveis.
Produto: {{produto}}
3 passos, mensagens de erro e sucesso.`, ["Texto","Onboarding"]),

  // Vídeos
  mk("Roteiro Shorts 60s", "Vídeos", `Crie roteiro de vídeo curto (60s).
Tema: {{tema}}
Estrutura: gancho 5s, valor, CTA final.
Formato bullets.`, ["YouTube","Shorts"]),
  mk("Gancho em 5s + CTA", "Vídeos", `Gere 5 opções de gancho (<=5s) + CTA.
Assunto: {{assunto}}`, ["Gancho","CTA"]),
  mk("Storyboard simples (6 cenas)", "Vídeos", `Storyboard de 6 cenas com descrição breve.
Tema: {{tema}}
Inclua enquadramento e texto na tela.`, ["Storyboard","Social"]),
  mk("Script para anúncio 15s", "Vídeos", `Escreva script de 15s para anúncio.
Produto: {{produto}}
Público: {{publico}}
Tom: {{tom}}`, ["Ads","Curto"]),
  mk("Lista de B‑rolls", "Vídeos", `Sugira lista de B‑rolls.
Tema: {{tema}}
Estilo: {{estilo}}`, ["Filmagem","Plano"]),
  mk("Calendário de conteúdo semanal", "Vídeos", `Planeje 7 ideias para a semana.
Nicho: {{nicho}}
Objetivo: {{objetivo}}`, ["Planejamento","Social"]),

  // Fotos
  mk("Ficha de estilos — Luz/Ângulo/Paleta", "Fotos", `Monte ficha de estilos para ensaio.
Tema: {{tema}}
Defina luz, ângulo, paleta e exemplos.`, ["Estilos","Ensaio"]),
  mk("Prompt pack: cyberpunk realista", "Fotos", `Crie 10 prompts de foto estilo cyberpunk realista.
Assuntos: {{assuntos}}
Formato: bullets curtos.`, ["Cyberpunk","Pack"]),
  mk("Tabela de estilos fotográficos", "Fotos", `Tabela com 8 estilos: descrição, luz, lente, paleta.`, ["Tabela","Referência"]),
  mk("Guia de estúdio minimal", "Fotos", `Guia para estúdio minimal.
Equipamentos: {{equipamentos}}`, ["Estúdio","Minimal"]),
  mk("Moodboard automático", "Fotos", `Descreva moodboard com 6 blocos.
Tema: {{tema}}`, ["Moodboard","Inspiração"]),
  mk("Legenda para carrossel IG", "Fotos", `Escreva legenda de carrossel (5 slides) com CTA.
Tema: {{tema}}`, ["Social","Texto"]),

  // Tarefas
  mk("Decomposição PREVC", "Tarefas", `Aplique PREVC (Problema, Resultado, Etapas, Verificação, Conclusão).
Tema: {{tema}}`, ["Gestão","Planejamento"]),
  mk("Template de release", "Tarefas", `Template de release com seções.
Projeto: {{projeto}}
Deadline: {{deadline}}`, ["Release","Template"]),
  mk("Relatório diário (dev)", "Tarefas", `Modelo: Feito, Em progresso, Bloqueios, Próximo.
Projeto: {{projeto}}`, ["Relatório","Dev"]),
  mk("Plano de sprint", "Tarefas", `Plano de sprint de 2 semanas.
Objetivos: {{objetivos}}`, ["Agile","Sprint"]),
  mk("Matriz de prioridades", "Tarefas", `Monte matriz Urgente/Importante para tarefas.
Lista: {{lista}}`, ["Produtividade","Prioridades"]),
  mk("Roteiro de reunião", "Tarefas", `Roteiro com pauta, tempo e responsáveis.
Tema: {{tema}}`, ["Reunião","Pauta"]),

  // Outros
  mk("Pesquisa de público", "Outros", `Esboce pesquisa com 10 perguntas.
Público: {{publico}}`, ["Pesquisa","Formulário"]),
  mk("Mapa mental rápido", "Outros", `Crie mapa mental textual com 4 níveis.
Tema: {{tema}}`, ["Ideação","Mapa"]),
  mk("Resumo executivo", "Outros", `Resuma projeto em 6 bullets.
Projeto: {{projeto}}`, ["Resumo","Executivo"]),
  mk("OKRs trimestrais", "Outros", `Defina 3 OKRs trimestrais com KRs mensuráveis.
Área: {{area}}`, ["OKR","Gestão"]),
  mk("Canvas de proposta de valor", "Outros", `Preencha canvas com dores, ganhos e tarefas.
Produto: {{produto}}`, ["Estratégia","Canvas"]),
  mk("E‑mail cold outreach", "Outros", `Escreva e‑mail curto de prospecção.
Persona: {{persona}}`, ["Vendas","Email"]),
];
