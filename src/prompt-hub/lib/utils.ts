import type { Prompt } from "../types";

export const now = () => Date.now();

// Use a counter-based ID generator to avoid hydration mismatches
let idCounter = 1000;
export function id() {
  return `id_${idCounter++}`;
}

export function detectVariables(text: string): Array<{ key: string; required?: boolean; example?: string }> {
  const set = new Set<string>();
  const re = /\{\{\s*([a-zA-Z0-9_\-\.]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) set.add(m[1]);
  return Array.from(set).map((key) => ({ key }));
}

export function applyVariables(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_\-\.]+)\s*\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function filterPrompts(prompts: Prompt[], params: {
  q?: string; category?: string; tags?: string[]; model?: string; lang?: string;
}) {
  const { q = "", category, tags = [], model, lang } = params;
  const ql = q.trim().toLowerCase();
  return prompts.filter(p => {
    if (category && category !== 'All' && p.category !== category) return false;
    if (model && model !== 'all' && p.targetModel && p.targetModel !== model) return false;
    if (lang && lang !== 'all' && p.language && p.language !== lang) return false;
    if (tags.length && !tags.every(t => p.tags.includes(t))) return false;
    if (ql) {
      const hay = `${p.name} ${p.content} ${p.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(ql)) return false;
    }
    return true;
  });
}

export function withNotes(refined: string, notes?: string) {
  return notes ? `${refined}\n\nNotas:\n- ${notes}` : refined;
}
