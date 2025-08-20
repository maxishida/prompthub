// Arquivo de teste para verificar a geração dos workflows
import { seedN8nWorkflows } from './n8n-seed';

console.log('=== TESTE DE GERAÇÃO DE WORKFLOWS ===');
console.log(`Total de workflows gerados: ${seedN8nWorkflows.length}`);

// Verificar categorias
const categories = seedN8nWorkflows.reduce((acc, workflow) => {
  acc[workflow.category] = (acc[workflow.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\n=== DISTRIBUIÇÃO POR CATEGORIA ===');
Object.entries(categories).forEach(([category, count]) => {
  console.log(`${category}: ${count} workflows`);
});

// Verificar autores
const authors = seedN8nWorkflows.reduce((acc, workflow) => {
  acc[workflow.author || 'Unknown'] = (acc[workflow.author || 'Unknown'] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\n=== TOP 10 AUTORES ===');
Object.entries(authors)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([author, count]) => {
    console.log(`${author}: ${count} workflows`);
  });

// Verificar tags únicas
const allTags = new Set(seedN8nWorkflows.flatMap(w => w.tags));
console.log(`\nTotal de tags únicas: ${allTags.size}`);

// Verificar estatísticas
const totalDownloads = seedN8nWorkflows.reduce((sum, w) => sum + w.downloads, 0);
const totalVotes = seedN8nWorkflows.reduce((sum, w) => sum + w.votes, 0);
const avgDownloads = totalDownloads / seedN8nWorkflows.length;
const avgVotes = totalVotes / seedN8nWorkflows.length;

console.log('\n=== ESTATÍSTICAS GERAIS ===');
console.log(`Total de downloads: ${totalDownloads.toLocaleString()}`);
console.log(`Total de votos: ${totalVotes.toLocaleString()}`);
console.log(`Média de downloads por workflow: ${avgDownloads.toFixed(0)}`);
console.log(`Média de votos por workflow: ${avgVotes.toFixed(0)}`);

// Verificar se há workflows duplicados
const names = seedN8nWorkflows.map(w => w.name);
const uniqueNames = new Set(names);
console.log(`\nWorkflows com nomes únicos: ${uniqueNames.size}/${names.length}`);

// Verificar se há IDs duplicados
const ids = seedN8nWorkflows.map(w => w.id);
const uniqueIds = new Set(ids);
console.log(`Workflows com IDs únicos: ${uniqueIds.size}/${ids.length}`);

console.log('\n=== TESTE CONCLUÍDO ===');
