export type PromptCategory = "Codar"|"Design"|"Vídeos"|"Fotos"|"Tarefas"|"Outros";

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

export type Filters = {
  q: string;
  category: 'All' | PromptCategory;
  tags: string[];
  model: 'all'|'openai'|'anthropic'|'google'|'local'|'generic';
  lang: 'all'|'pt'|'en'|'es';
};
