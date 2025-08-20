'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Copy, Eye, Code, FileJson, Calendar, User, Tag } from 'lucide-react'
import type { N8nWorkflow } from '../types'

interface N8nWorkflowViewerProps {
  workflow: N8nWorkflow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function N8nWorkflowViewer({ workflow, open, onOpenChange }: N8nWorkflowViewerProps) {
  const [copied, setCopied] = useState(false)

  if (!workflow) return null

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(workflow.jsonContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([workflow.jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Marketing': 'bg-blue-500',
      'Automação': 'bg-green-500',
      'Integrações': 'bg-purple-500',
      'DevOps': 'bg-orange-500',
      'IA': 'bg-pink-500',
      'E-commerce': 'bg-indigo-500',
      'Analytics': 'bg-teal-500',
      'Comunicação': 'bg-cyan-500',
      'Financeiro': 'bg-emerald-500',
      'RH': 'bg-rose-500',
      'Outros': 'bg-gray-500'
    }
    return colors[category] || colors['Outros']
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#1a1f2e] border-[#2d3748] text-white">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {workflow.name}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-base leading-relaxed">
                {workflow.description}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getCategoryColor(workflow.category)} text-white border-0 px-3 py-1`}>
                {workflow.category}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#2d3748] border-[#4a5568]">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="json" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                <Code className="w-4 h-4 mr-2" />
                JSON
              </TabsTrigger>
              <TabsTrigger 
                value="metadata" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                <FileJson className="w-4 h-4 mr-2" />
                Metadados
              </TabsTrigger>
              <TabsTrigger 
                value="tags" 
                className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{workflow.downloads.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{workflow.votes}</div>
                    <div className="text-sm text-gray-400">Votos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{workflow.tags.length}</div>
                    <div className="text-sm text-gray-400">Tags</div>
                  </div>
                </div>

                {/* Descrição detalhada */}
                <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                  <h3 className="text-lg font-semibold text-white mb-3">Descrição Detalhada</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {workflow.description}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white border-0"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar JSON
                  </Button>
                  <Button
                    onClick={handleCopyJson}
                    variant="outline"
                    className="border-[#4a5568] text-gray-300 hover:bg-[#2d3748] hover:text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copiado!' : 'Copiar JSON'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="json" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Conteúdo JSON do Workflow</h3>
                  <Button
                    onClick={handleCopyJson}
                    size="sm"
                    variant="outline"
                    className="border-[#4a5568] text-gray-300 hover:bg-[#2d3748] hover:text-white"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
                <ScrollArea className="h-96 w-full">
                  <pre className="p-4 bg-[#0f1419] rounded-lg border border-[#4a5568] text-sm text-gray-300 overflow-x-auto">
                    <code>{JSON.stringify(JSON.parse(workflow.jsonContent), null, 2)}</code>
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="mt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-medium text-gray-300">Autor</span>
                    </div>
                    <div className="text-white font-medium">{workflow.author || 'Não informado'}</div>
                  </div>
                  
                  <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">Versão</span>
                    </div>
                    <div className="text-white font-medium">{workflow.version || '1.0.0'}</div>
                  </div>
                  
                  <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-gray-300">Criado em</span>
                    </div>
                    <div className="text-white font-medium">{formatDate(workflow.createdAt)}</div>
                  </div>
                  
                  <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-gray-300">Atualizado em</span>
                    </div>
                    <div className="text-white font-medium">{formatDate(workflow.updatedAt)}</div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                  <div className="flex items-center gap-2 mb-2">
                    <FileJson className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-gray-300">Caminho do Arquivo</span>
                  </div>
                  <div className="text-white font-mono text-sm bg-[#0f1419] p-2 rounded border border-[#4a5568]">
                    {workflow.filePath}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Tags do Workflow</h3>
                <div className="flex flex-wrap gap-2">
                  {workflow.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#4a5568] text-white border-[#6b7280] px-3 py-1 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="p-4 bg-[#2d3748] rounded-lg border border-[#4a5568]">
                  <h4 className="text-md font-medium text-white mb-2">Sobre as Tags</h4>
                  <p className="text-gray-300 text-sm">
                    As tags ajudam a categorizar e encontrar workflows relacionados. 
                    Use-as para filtrar workflows por funcionalidade, tecnologia ou domínio.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
