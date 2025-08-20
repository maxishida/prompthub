import type { N8nWorkflow } from "../types";

// Timestamp fixo para evitar problemas de hidratação
const FIXED_TIMESTAMP = 1704067200000; // 2024-01-01 00:00:00 UTC
let idCounter = 1;

const mk = (
  name: string, 
  category: N8nWorkflow["category"], 
  description: string, 
  tags: string[], 
  jsonContent: string,
  extra?: Partial<N8nWorkflow>
): N8nWorkflow => ({
  id: `workflow_${idCounter++}`,
  name,
  description,
  category,
  tags,
  jsonContent,
  downloads: Math.floor(Math.random() * 2000) + 100,
  votes: Math.floor(Math.random() * 100) + 10,
  author: extra?.author || 'N8n Community',
  version: extra?.version || '1.0.0',
  createdAt: FIXED_TIMESTAMP + (Math.random() * 90 * 24 * 60 * 60 * 1000), // Últimos 90 dias
  updatedAt: FIXED_TIMESTAMP + (Math.random() * 30 * 24 * 60 * 60 * 1000), // Últimos 30 dias
  filePath: `/workflows/${category.toLowerCase()}/${name.toLowerCase().replace(/[^a-z0-9]/gi, '-')}.json`,
  ...extra
});

// Templates de workflows JSON reais (simplificados)
const workflowTemplates = {
  marketing: [
    {
      name: "Email Marketing Automation",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.start", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.httpRequest", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.sendEmail", "position": [400, 0]}
      ]
    },
    {
      name: "Lead Scoring System",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.webhook", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.function", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.if", "position": [400, 0]}
      ]
    }
  ],
  
  automation: [
    {
      name: "Data Processing Pipeline",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.start", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.csv", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.function", "position": [400, 0]}
      ]
    },
    {
      name: "File Backup System",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.cron", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.moveFiles", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.notify", "position": [400, 0]}
      ]
    }
  ],
  
  integrations: [
    {
      name: "API Integration Hub",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.webhook", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.httpRequest", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.respondToWebhook", "position": [400, 0]}
      ]
    },
    {
      name: "Database Sync",
      nodes: [
        {"id": "1", "type": "n8n-nodes-base.cron", "position": [0, 0]},
        {"id": "2", "type": "n8n-nodes-base.mysql", "position": [200, 0]},
        {"id": "3", "type": "n8n-nodes-base.postgres", "position": [400, 0]}
      ]
    }
  ]
};

// Arrays de variações para gerar workflows únicos
const workflowVariations = {
  marketing: {
    prefixes: [
      "Automação de", "Sistema de", "Pipeline de", "Workflow de", "Gestão de",
      "Otimização de", "Análise de", "Segmentação de", "Personalização de"
    ],
    subjects: [
      "Email Marketing", "Lead Nurturing", "Social Media", "Campanhas", "Funil de Conversão",
      "Retargeting", "A/B Testing", "Analytics", "Segmentação", "Engajamento"
    ],
    suffixes: [
      "com IA", "Multi-canal", "Inteligente", "Automatizado", "Otimizado",
      "Real-time", "Personalizado", "Escalável", "Integrado", "Avancado"
    ],
    descriptions: [
      "Sistema completo para automação de campanhas com segmentação inteligente e métricas detalhadas.",
      "Workflow avançado para nutrição de leads com comportamento dinâmico e personalização.",
      "Pipeline automatizado para gestão de redes sociais com agendamento inteligente.",
      "Sistema de análise de campanhas com insights preditivos e otimização automática.",
      "Workflow de conversão com funil dinâmico e segmentação comportamental."
    ]
  },
  
  automation: {
    prefixes: [
      "Automação de", "Pipeline de", "Sistema de", "Workflow de", "Processamento de",
      "Gestão de", "Monitoramento de", "Backup de", "Sincronização de"
    ],
    subjects: [
      "Dados", "Arquivos", "Backup", "Monitoramento", "Processos",
      "Sistemas", "Servidores", "Logs", "Métricas", "Alertas"
    ],
    suffixes: [
      "Inteligente", "Automático", "Real-time", "Escalável", "Seguro",
      "Otimizado", "Integrado", "Robusto", "Eficiente", "Confiável"
    ],
    descriptions: [
      "Pipeline completo para processamento, limpeza e transformação de dados com validação automática.",
      "Sistema de backup automático com compressão, criptografia e verificação de integridade.",
      "Workflow de monitoramento com alertas inteligentes e escalação automática.",
      "Pipeline de sincronização de dados entre múltiplos sistemas com tratamento de erros.",
      "Sistema de automação de processos com logs detalhados e notificações."
    ]
  },
  
  integrations: {
    prefixes: [
      "Integração de", "Sincronização de", "Hub de", "Gateway de", "Conector de",
      "Bridge de", "API de", "Webhook de", "Sync de"
    ],
    subjects: [
      "APIs", "Sistemas", "CRMs", "Bancos de Dados", "Serviços",
      "Aplicações", "Plataformas", "Ferramentas", "Serviços Web"
    ],
    suffixes: [
      "Bidirecional", "Real-time", "Seguro", "Escalável", "Robusto",
      "Inteligente", "Automático", "Integrado", "Otimizado", "Confiável"
    ],
    descriptions: [
      "Hub centralizado para integração com múltiplos serviços externos com rate limiting.",
      "Sistema de sincronização bidirecional com mapeamento de campos e resolução de conflitos.",
      "Gateway para webhooks com roteamento inteligente e validação de payload.",
      "Conector universal para múltiplas APIs com autenticação e tratamento de erros.",
      "Bridge de dados entre sistemas heterogêneos com transformação automática."
    ]
  },
  
  devops: {
    prefixes: [
      "Pipeline de", "Sistema de", "Workflow de", "Automação de", "Gestão de",
      "Orquestração de", "Deploy de", "Monitoramento de", "Configuração de"
    ],
    subjects: [
      "CI/CD", "Containers", "Kubernetes", "Docker", "Infraestrutura",
      "Deploy", "Monitoramento", "Logs", "Métricas", "Alertas"
    ],
    suffixes: [
      "Automático", "Escalável", "Seguro", "Robusto", "Eficiente",
      "Integrado", "Otimizado", "Confiável", "Flexível", "Adaptativo"
    ],
    descriptions: [
      "Pipeline completo de integração e entrega contínua com testes automatizados.",
      "Sistema de orquestração para containers com auto-scaling e health checks.",
      "Workflow de deploy automatizado com rollback e monitoramento em tempo real.",
      "Sistema de gestão de configurações de infraestrutura com versionamento.",
      "Pipeline de monitoramento com alertas inteligentes e escalação automática."
    ]
  },
  
  ai: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Integração de", "Processamento de",
      "Análise de", "Chatbot de", "IA de", "Machine Learning de"
    ],
    subjects: [
      "IA", "Chatbot", "Processamento de Imagens", "NLP", "Análise de Sentimentos",
      "Computer Vision", "Machine Learning", "Reconhecimento de Voz", "OCR"
    ],
    suffixes: [
      "Inteligente", "Avançado", "Real-time", "Preciso", "Adaptativo",
      "Integrado", "Otimizado", "Escalável", "Confiável", "Inovador"
    ],
    descriptions: [
      "Chatbot inteligente integrado com OpenAI GPT para atendimento ao cliente.",
      "Pipeline de processamento de imagens com detecção de objetos e OCR.",
      "Sistema de análise de sentimentos com processamento de linguagem natural.",
      "Workflow de machine learning com treinamento automático e inferência.",
      "Sistema de reconhecimento de voz com transcrição e análise automática."
    ]
  },
  
  ecommerce: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Gestão de", "Processamento de",
      "Automação de", "Integração de", "Sincronização de", "Analytics de"
    ],
    subjects: [
      "E-commerce", "Pedidos", "Inventário", "Pagamentos", "Vendas",
      "Estoque", "Logística", "Faturamento", "Relatórios", "Métricas"
    ],
    suffixes: [
      "End-to-End", "Multi-canal", "Real-time", "Escalável", "Integrado",
      "Automático", "Otimizado", "Inteligente", "Confiável", "Eficiente"
    ],
    descriptions: [
      "Sistema completo de processamento de pedidos com integração de pagamentos.",
      "Workflow de gestão de inventário com sincronização multi-canal.",
      "Pipeline de analytics para vendas com relatórios automáticos.",
      "Sistema de logística automatizada com rastreamento em tempo real.",
      "Workflow de faturamento com integração contábil e relatórios."
    ]
  },
  
  analytics: {
    prefixes: [
      "Pipeline de", "Sistema de", "Workflow de", "Processamento de", "Análise de",
      "Gestão de", "Coleta de", "Transformação de", "Visualização de"
    ],
    subjects: [
      "Dados", "Analytics", "Métricas", "KPIs", "Relatórios",
      "Dashboards", "Business Intelligence", "Data Mining", "Machine Learning"
    ],
    suffixes: [
      "Real-time", "Automático", "Inteligente", "Escalável", "Integrado",
      "Otimizado", "Confiável", "Eficiente", "Flexível", "Adaptativo"
    ],
    descriptions: [
      "Pipeline de dados para análise de métricas com transformação automática.",
      "Sistema de business intelligence com dashboards interativos e KPIs.",
      "Workflow de analytics em tempo real para dados de streaming.",
      "Pipeline de data mining com algoritmos de machine learning.",
      "Sistema de visualização de dados com gráficos dinâmicos e relatórios."
    ]
  },
  
  communication: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Gestão de", "Automação de",
      "Integração de", "Sincronização de", "Roteamento de", "Notificação de"
    ],
    subjects: [
      "Comunicação", "Notificações", "Mensagens", "Emails", "SMS",
      "Push Notifications", "Chat", "Videoconferência", "Colaboração"
    ],
    suffixes: [
      "Multi-canal", "Inteligente", "Automático", "Real-time", "Escalável",
      "Integrado", "Personalizado", "Seguro", "Confiável", "Eficiente"
    ],
    descriptions: [
      "Sistema de notificações para múltiplos canais com templates personalizáveis.",
      "Workflow de comunicação automatizada com roteamento inteligente.",
      "Pipeline de mensagens com entrega garantida e confirmação.",
      "Sistema de chat integrado com múltiplas plataformas.",
      "Workflow de videoconferência com agendamento automático."
    ]
  },
  
  financial: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Gestão de", "Processamento de",
      "Automação de", "Integração de", "Sincronização de", "Análise de"
    ],
    subjects: [
      "Financeiro", "Pagamentos", "Faturas", "Contabilidade", "Relatórios",
      "Reconciliação", "Auditoria", "Compliance", "Treasury", "Risk Management"
    ],
    suffixes: [
      "Automático", "Seguro", "Compliance", "Real-time", "Escalável",
      "Integrado", "Auditável", "Confiável", "Eficiente", "Transparente"
    ],
    descriptions: [
      "Sistema de reconciliação automática de transações financeiras.",
      "Workflow de processamento de faturas com validação automática.",
      "Pipeline de relatórios financeiros com agregação de dados.",
      "Sistema de compliance automatizado com auditoria em tempo real.",
      "Workflow de gestão de risco com alertas automáticos."
    ]
  },
  
  hr: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Gestão de", "Automação de",
      "Processo de", "Integração de", "Sincronização de", "Análise de"
    ],
    subjects: [
      "RH", "Onboarding", "Férias", "Performance", "Recrutamento",
      "Treinamento", "Folha de Pagamento", "Benefícios", "Compliance"
    ],
    suffixes: [
      "Automático", "Integrado", "Escalável", "Compliance", "Eficiente",
      "Personalizado", "Seguro", "Confiável", "Flexível", "Adaptativo"
    ],
    descriptions: [
      "Sistema de onboarding automatizado para novos funcionários.",
      "Workflow de gestão de férias com aprovação automática.",
      "Pipeline de avaliação de performance com ciclos automatizados.",
      "Sistema de recrutamento com triagem automática de candidatos.",
      "Workflow de treinamento com acompanhamento de progresso."
    ]
  },
  
  other: {
    prefixes: [
      "Sistema de", "Workflow de", "Pipeline de", "Gestão de", "Automação de",
      "Processo de", "Integração de", "Sincronização de", "Monitoramento de"
    ],
    subjects: [
      "Tickets", "Projetos", "Documentos", "Auditoria", "Segurança",
      "Compliance", "Qualidade", "Manutenção", "Suporte", "Helpdesk"
    ],
    suffixes: [
      "Automático", "Inteligente", "Escalável", "Seguro", "Eficiente",
      "Integrado", "Otimizado", "Confiável", "Flexível", "Adaptativo"
    ],
    descriptions: [
      "Sistema de tickets para suporte técnico com roteamento automático.",
      "Workflow de gestão de projetos com dependências e marcos.",
      "Pipeline de auditoria automatizada com coleta de logs.",
      "Sistema de segurança com monitoramento em tempo real.",
      "Workflow de compliance com validação automática."
    ]
  }
};

// Função para gerar workflows únicos
function generateUniqueWorkflows(): N8nWorkflow[] {
  const workflows: N8nWorkflow[] = [];
  const categories: N8nWorkflow["category"][] = [
    'Marketing', 'Automação', 'Integrações', 'DevOps', 'IA', 
    'E-commerce', 'Analytics', 'Comunicação', 'Financeiro', 'RH', 'Outros'
  ];
  
  const authors = [
    'N8n Community', 'Marketing Team', 'DevOps Team', 'AI Team', 'Data Team',
    'Engineering Team', 'Platform Team', 'Integration Team', 'Security Team',
    'Operations Team', 'Support Team', 'QA Team', 'Product Team', 'Design Team',
    'Community Contributor', 'Enterprise User', 'Startup Team', 'Consulting Firm'
  ];
  
  const versions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0', '2.1.0', '2.2.0', '3.0.0'];
  
  // Gerar 2000 workflows únicos
  for (let i = 0; i < 2000; i++) {
    const category = categories[i % categories.length];
    const variation = workflowVariations[category.toLowerCase() as keyof typeof workflowVariations];
    
    if (!variation) continue;
    
    // Selecionar elementos aleatórios com mais variação
    const prefix = variation.prefixes[Math.floor(Math.random() * variation.prefixes.length)];
    const subject = variation.subjects[Math.floor(Math.random() * variation.subjects.length)];
    const suffix = variation.suffixes[Math.floor(Math.random() * variation.suffixes.length)];
    const description = variation.descriptions[Math.floor(Math.random() * variation.descriptions.length)];
    
    // Gerar nome único com variação adicional
    const name = `${prefix} ${subject} - ${suffix} ${i > 0 ? `v${Math.floor(i / 100) + 1}` : ''}`.trim();
    
    // Gerar tags únicas com mais variedade
    const baseTags = [category, subject.split(' ')[0], 'Automação'];
    const additionalTags = [
      'Workflow', 'N8n', 'Integração', 'API', 'Webhook', 'Database', 'Cloud',
      'Real-time', 'Escalável', 'Seguro', 'Otimizado', 'Inteligente', 'Enterprise',
      'Open Source', 'Community', 'Production Ready', 'Best Practice', 'Template'
    ];
    
    const tags = [
      ...baseTags,
      ...additionalTags.slice(0, Math.floor(Math.random() * 5) + 2)
    ];
    
    // Selecionar template JSON
    const templateKey = category.toLowerCase() as keyof typeof workflowTemplates;
    const templates = workflowTemplates[templateKey] || workflowTemplates.automation;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Gerar JSON único com variações
    const jsonContent = JSON.stringify({
      ...template,
      name: name,
      id: `workflow_${i + 1}`,
      version: versions[Math.floor(Math.random() * versions.length)],
      metadata: {
        generated: true,
        category: category,
        tags: tags,
        complexity: Math.floor(Math.random() * 5) + 1,
        estimatedTime: Math.floor(Math.random() * 120) + 30
      }
    }, null, 2);
    
    // Criar workflow com dados mais realistas
    const workflow = mk(
      name,
      category,
      description,
      tags,
      jsonContent,
      {
        author: authors[Math.floor(Math.random() * authors.length)],
        version: versions[Math.floor(Math.random() * versions.length)],
        downloads: Math.floor(Math.random() * 5000) + 50, // Mais downloads realistas
        votes: Math.floor(Math.random() * 200) + 5,      // Mais votos realistas
        createdAt: FIXED_TIMESTAMP + (Math.random() * 365 * 24 * 60 * 60 * 1000), // Último ano
        updatedAt: FIXED_TIMESTAMP + (Math.random() * 90 * 24 * 60 * 60 * 1000)   // Últimos 90 dias
      }
    );
    
    workflows.push(workflow);
  }
  
  return workflows;
}

// Gerar os 2000 workflows únicos
export const seedN8nWorkflows: N8nWorkflow[] = generateUniqueWorkflows();
