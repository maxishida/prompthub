import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Save, Eye, Copy, Wand2 } from 'lucide-react'
import { usePrompts } from '../store/usePrompts'
import { id, now, detectVariables, applyVariables, copyToClipboard } from '../lib/utils'
import type { Prompt, PromptCategory } from '../types'

const categories: PromptCategory[] = ['Codar', 'Design', 'Vídeos', 'Fotos', 'Tarefas', 'Outros']
const models = ['generic', 'openai', 'anthropic', 'google', 'local']


interface PromptEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt?: Prompt
}

export function PromptEditor({ open, onOpenChange, prompt }: PromptEditorProps) {
  const { upsert } = usePrompts()
  const [formData, setFormData] = useState<Partial<Prompt>>({
    name: '',
    category: 'Outros',
    content: '',
    tags: [],
    targetModel: 'generic',
    language: 'pt',
    notes: ''
  })
  const [newTag, setNewTag] = useState('')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    if (prompt) {
      setFormData(prompt)
    } else {
      setFormData({
        name: '',
        category: 'Outros',
        content: '',
        tags: [],
        targetModel: 'generic',
        language: 'pt',
        notes: ''
      })
    }
    setVariables({})
    setPreviewMode(false)
  }, [prompt, open])

  const detectedVars = detectVariables(formData.content || '')
  const previewContent = applyVariables(formData.content || '', variables)

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.content?.trim()) return
    
    const promptData: Prompt = {
      id: prompt?.id || id(),
      name: formData.name.trim(),
      category: formData.category as PromptCategory,
      content: formData.content.trim(),
      tags: formData.tags || [],
      targetModel: formData.targetModel,
      language: formData.language,
      notes: formData.notes?.trim(),
      variables: detectedVars.map(v => ({ key: v.key })),
      createdAt: prompt?.createdAt || now(),
      updatedAt: now()
    }
    
    upsert(promptData)
    onOpenChange(false)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }))
  }

  const copyPreview = async () => {
    await copyToClipboard(previewContent)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            {prompt ? 'Editar Prompt' : 'Novo Prompt'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1">
            {/* Editor Panel */}
            <div className="space-y-4">
              <div className="neon-card p-4 space-y-4">
                <h3 className="font-semibold text-lg text-primary">Informações Básicas</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Prompt *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Gerar código React..."
                    className="neon-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as PromptCategory }))}>
                      <SelectTrigger className="neon-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo Alvo</Label>
                    <Select value={formData.targetModel} onValueChange={(value) => setFormData(prev => ({ ...prev, targetModel: value as Prompt['targetModel'] }))}>
                      <SelectTrigger className="neon-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(model => (
                          <SelectItem key={model} value={model}>
                            {model === 'generic' ? 'Genérico' : model.charAt(0).toUpperCase() + model.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={formData.language} onValueChange={(value) => setFormData(prev => ({ ...prev, language: value as Prompt['language'] }))}>
                    <SelectTrigger className="neon-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Português</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Adicionar tag..."
                      className="neon-input flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm" className="neon-border">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map(tag => (
                      <Badge key={tag} className="neon-chip cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="neon-card p-4 space-y-4">
                <h3 className="font-semibold text-lg text-primary">Conteúdo do Prompt *</h3>
                <Textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Escreva seu prompt aqui...\n\nUse {{variavel}} para criar variáveis dinâmicas.\n\nExemplo:\nCrie um componente React para {{funcionalidade}} com as seguintes características:\n- {{caracteristica1}}\n- {{caracteristica2}}"
                  className="neon-input min-h-[200px] font-mono text-sm"
                />
                
                {detectedVars.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-primary">Variáveis Detectadas: {detectedVars.length}</Label>
                    <div className="flex flex-wrap gap-2">
                      {detectedVars.map(v => (
                        <Badge key={v.key} className="neon-chip">{v.key}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="neon-card p-4 space-y-4">
                <h3 className="font-semibold text-lg text-primary">Notas (Opcional)</h3>
                <Textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Adicione notas, instruções de uso, exemplos..."
                  className="neon-input min-h-[80px]"
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-4">
              <div className="neon-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-primary">Pré-visualização</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode ? 'default' : 'secondary'}
                      size="sm"
                      onClick={() => setPreviewMode(!previewMode)}
                      className="neon-border"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {previewMode ? 'Editor' : 'Preview'}
                    </Button>
                    {previewMode && (
                      <Button onClick={copyPreview} size="sm" className="neon-border">
                        <Copy className="h-4 w-4 mr-1" />Copiar
                      </Button>
                    )}
                  </div>
                </div>

                {!previewMode ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-lg border border-primary/20">
                      <h4 className="font-medium mb-2">{formData.name || 'Nome do Prompt'}</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="neon-chip">{formData.category}</Badge>
                        {formData.tags?.slice(0, 3).map(tag => (
                          <Badge key={tag} className="neon-chip">{tag}</Badge>
                        ))}
                      </div>
                      <pre className="whitespace-pre-wrap text-sm font-mono bg-background/50 p-3 rounded border">
                        {formData.content || 'Conteúdo do prompt aparecerá aqui...'}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detectedVars.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-primary">Preencher Variáveis:</Label>
                        {detectedVars.map(v => (
                          <div key={v.key} className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{v.key}</Label>
                            <Input
                              value={variables[v.key] || ''}
                              onChange={(e) => setVariables(prev => ({ ...prev, [v.key]: e.target.value }))}
                              placeholder={`Valor para ${v.key}...`}
                              className="neon-input"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-4 bg-muted/20 rounded-lg border border-primary/20">
                      <h4 className="font-medium mb-2 text-primary">Resultado Final:</h4>
                      <pre className="whitespace-pre-wrap text-sm font-mono bg-background/50 p-3 rounded border max-h-[300px] overflow-auto">
                        {previewContent || 'Preencha as variáveis para ver o resultado...'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {detectedVars.length > 0 && `${detectedVars.length} variável(is) detectada(s)`}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name?.trim() || !formData.content?.trim()}
              className="neon-border"
            >
              <Save className="h-4 w-4 mr-1" />
              {prompt ? 'Atualizar' : 'Salvar'} Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}