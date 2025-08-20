export type PromptCategory = "Codar"|"Design"|"Vídeos"|"Fotos"|"Tarefas"|"Outros"|"Workflow N8n";

export type N8nWorkflowCategory = "Marketing"|"Automação"|"Integrações"|"DevOps"|"IA"|"E-commerce"|"Analytics"|"Comunicação"|"Financeiro"|"RH"|"Outros";

export type Prompt = {
  id: string;
  name: string;
  category: PromptCategory;
  tags: string[];
  targetModel?: "openai"|"anthropic"|"google"|"local"|"generic";
  language?: "pt"|"en"|"es";
  variables?: Array<{ key: string; label?: string; required?: boolean; example?: string }>;
  content: string;     // markdown/texto do prompt
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type N8nWorkflow = {
  id: string;
  name: string;
  description: string;
  category: N8nWorkflowCategory;
  tags: string[];
  jsonContent: string; // Conteúdo JSON do workflow
  downloads: number;
  votes: number;
  author?: string;
  version?: string;
  createdAt: number;
  updatedAt: number;
  filePath: string; // Caminho do arquivo na pasta bibliotecaprompt
};

export type Filters = {
  q: string;
  category: 'All' | PromptCategory;
  tags: string[];
  model: 'all'|'openai'|'anthropic'|'google'|'local'|'generic';
  lang: 'all'|'pt'|'en'|'es';
};

export type N8nWorkflowFilters = {
  q: string;
  category: 'All' | N8nWorkflowCategory;
  tags: string[];
  sortBy: 'newest'|'downloads'|'votes'|'name';
  sortOrder: 'asc'|'desc';
};
