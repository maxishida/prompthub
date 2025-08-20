import type { N8nWorkflow, N8nWorkflowCategory } from '../types'

export interface WorkflowFileInfo {
  fileName: string
  filePath: string
  category: string
  action: string
  type: string
  trigger: string
  size: number
  lastModified: Date
}

export interface ParsedWorkflow {
  fileInfo: WorkflowFileInfo
  workflow: N8nWorkflow
  isValid: boolean
  errors: string[]
}

/**
 * Analisa o nome do arquivo para extrair informações sobre o workflow
 * Formato esperado: [ID]_[Categoria]_[Ação]_[Tipo]_[Trigger].json
 */
export function parseFileName(fileName: string): WorkflowFileInfo | null {
  try {
    // Remove extensão .json
    const nameWithoutExt = fileName.replace(/\.json$/, '')
    
    // Divide por underscore
    const parts = nameWithoutExt.split('_')
    
    if (parts.length < 4) {
      return null
    }
    
    const [id, category, action, type, ...triggerParts] = parts
    const trigger = triggerParts.join('_') || 'Unknown'
    
    return {
      fileName,
      filePath: `/bibliotecaprompt/${fileName}`,
      category: category || 'Unknown',
      action: action || 'Unknown',
      type: type || 'Unknown',
      trigger: trigger || 'Unknown',
      size: 0,
      lastModified: new Date()
    }
  } catch (error) {
    console.error('Erro ao analisar nome do arquivo:', fileName, error)
    return null
  }
}

/**
 * Mapeia categorias dos arquivos para nossas categorias padrão
 */
export function mapToStandardCategory(fileCategory: string): N8nWorkflowCategory {
  const categoryMap: Record<string, N8nWorkflowCategory> = {
    // Marketing
    'Marketing': 'Marketing',
    'Mautic': 'Marketing',
    'Mailchimp': 'Marketing',
    'HubSpot': 'Marketing',
    
    // Automação
    'Manual': 'Automação',
    'Schedule': 'Automação',
    'Wait': 'Automação',
    'Cron': 'Automação',
    
    // Integrações
    'Webhook': 'Integrações',
    'HTTP': 'Integrações',
    'API': 'Integrações',
    'Splitout': 'Integrações',
    'Splitinbatches': 'Integrações',
    
    // DevOps
    'GitHub': 'DevOps',
    'Docker': 'DevOps',
    'Kubernetes': 'DevOps',
    'Travisci': 'DevOps',
    'Circleci': 'DevOps',
    
    // IA
    'Openai': 'IA',
    'OpenAI': 'IA',
    'Huggingface': 'IA',
    'Anthropic': 'IA',
    
    // E-commerce
    'Shopify': 'E-commerce',
    'WooCommerce': 'E-commerce',
    'WooCommerceTool': 'E-commerce',
    
    // Analytics
    'GoogleAnalytics': 'Analytics',
    'GoogleSheets': 'Analytics',
    'GoogleDrive': 'Analytics',
    'GoogleCalendar': 'Analytics',
    'GoogleDocs': 'Analytics',
    'GoogleTasks': 'Analytics',
    
    // Comunicação
    'Slack': 'Comunicação',
    'Telegram': 'Comunicação',
    'Discord': 'Comunicação',
    'Mattermost': 'Comunicação',
    'Teams': 'Comunicação',
    'WhatsApp': 'Comunicação',
    
    // Financeiro
    'Stripe': 'Financeiro',
    'PayPal': 'Financeiro',
    'QuickBooks': 'Financeiro',
    'Wise': 'Financeiro',
    
    // RH
    'Asana': 'RH',
    'Mondaycom': 'RH',
    'ClickUp': 'RH',
    'Trello': 'RH',
    'Jira': 'RH',
    
    // Outros
    'Notion': 'Outros',
    'Airtable': 'Outros',
    'WordPress': 'Outros',
    'Zendesk': 'Outros',
    'PostgreSQL': 'Outros',
    'MongoDB': 'Outros',
    'Redis': 'Outros',
    'MySQL': 'Outros',
    'Supabase': 'Outros',
    'Firebase': 'Outros'
  }
  
  return categoryMap[fileCategory] || 'Outros'
}

/**
 * Gera tags baseadas no conteúdo do workflow
 */
export function generateTagsFromWorkflow(workflowData: any, fileInfo: WorkflowFileInfo): string[] {
  const tags: string[] = []
  
  // Tags baseadas no arquivo
  tags.push(fileInfo.category)
  tags.push(fileInfo.action)
  tags.push(fileInfo.type)
  tags.push(fileInfo.trigger)
  
  // Tags baseadas no conteúdo do workflow
  if (workflowData.nodes) {
    workflowData.nodes.forEach((node: any) => {
      if (node.type) {
        const nodeType = node.type.replace('n8n-nodes-base.', '')
        tags.push(nodeType)
      }
    })
  }
  
  // Tags baseadas em propriedades específicas
  if (workflowData.active) tags.push('Ativo')
  if (workflowData.settings) tags.push('Configurado')
  if (workflowData.versionId) tags.push('Versionado')
  
  // Remove duplicatas e limita a 8 tags
  return [...new Set(tags)].slice(0, 8)
}

/**
 * Valida se um workflow JSON é válido
 */
export function validateWorkflow(workflowData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!workflowData) {
    errors.push('Workflow data está vazio')
    return { isValid: false, errors }
  }
  
  if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
    errors.push('Workflow não possui nodes válidos')
  }
  
  if (!workflowData.connections && !workflowData.connections) {
    errors.push('Workflow não possui conexões válidas')
  }
  
  if (workflowData.nodes && workflowData.nodes.length === 0) {
    errors.push('Workflow não possui nodes')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Converte um arquivo de workflow para nosso formato padrão
 */
export function convertToStandardWorkflow(
  workflowData: any, 
  fileInfo: WorkflowFileInfo,
  fileContent: string
): N8nWorkflow {
  const validation = validateWorkflow(workflowData)
  const standardCategory = mapToStandardCategory(fileInfo.category)
  const tags = generateTagsFromWorkflow(workflowData, fileInfo)
  
  // Gera um ID único baseado no nome do arquivo
  const id = `real_${fileInfo.fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
  
  // Gera nome legível
  const name = `${fileInfo.category} - ${fileInfo.action} ${fileInfo.type}`
  
  // Gera descrição baseada no conteúdo
  const description = `Workflow ${fileInfo.category} para ${fileInfo.action} via ${fileInfo.type}`
  
  return {
    id,
    name,
    description,
    category: standardCategory,
    tags,
    jsonContent: fileContent,
    downloads: Math.floor(Math.random() * 100) + 1, // Simulado inicialmente
    votes: Math.floor(Math.random() * 50) + 1,      // Simulado inicialmente
    author: 'Biblioteca Real',
    version: '1.0.0',
    createdAt: fileInfo.lastModified.getTime(),
    updatedAt: fileInfo.lastModified.getTime(),
    filePath: fileInfo.filePath
  }
}

/**
 * Lê e analisa um arquivo de workflow
 */
export async function readWorkflowFile(filePath: string): Promise<ParsedWorkflow | null> {
  try {
    // Em um ambiente real, isso seria uma chamada para ler o arquivo
    // Por enquanto, retornamos null para indicar que precisa ser implementado
    console.log('Lendo arquivo:', filePath)
    
    return null
  } catch (error) {
    console.error('Erro ao ler arquivo:', filePath, error)
    return null
  }
}

/**
 * Lista todos os arquivos de workflow disponíveis
 */
export async function listAvailableWorkflows(): Promise<WorkflowFileInfo[]> {
  try {
    // Em um ambiente real, isso seria uma chamada para listar arquivos
    // Por enquanto, retornamos array vazio
    console.log('Listando workflows disponíveis...')
    
    return []
  } catch (error) {
    console.error('Erro ao listar workflows:', error)
    return []
  }
}
