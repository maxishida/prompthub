'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Download, 
  Star, 
  Edit3, 
  Trash2,
  MoreVertical
} from 'lucide-react'
import { N8nWorkflowViewer } from './N8nWorkflowViewer'
import type { N8nWorkflow } from '../types'

interface N8nWorkflowCardProps {
  workflow: N8nWorkflow
  onEdit?: (workflow: N8nWorkflow) => void
  onDelete?: (workflowId: string) => void
}

export function N8nWorkflowCard({ workflow, onEdit, onDelete }: N8nWorkflowCardProps) {
  const [showViewer, setShowViewer] = useState(false)
  const [showActions, setShowActions] = useState(false)

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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Marketing': '📢',
      'Automação': '⚡',
      'Integrações': '🔗',
      'DevOps': '🐳',
      'IA': '🤖',
      'E-commerce': '🛒',
      'Analytics': '📊',
      'Comunicação': '💬',
      'Financeiro': '💰',
      'RH': '👥',
      'Outros': '🔧'
    }
    return icons[category] || '📋'
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Marketing': 'from-pink-500 to-rose-500',
      'Automação': 'from-cyan-500 to-blue-500',
      'Integrações': 'from-purple-500 to-indigo-500',
      'DevOps': 'from-emerald-500 to-teal-500',
      'IA': 'from-violet-500 to-purple-500',
      'E-commerce': 'from-orange-500 to-red-500',
      'Analytics': 'from-blue-500 to-cyan-500',
      'Comunicação': 'from-green-500 to-emerald-500',
      'Financeiro': 'from-yellow-500 to-orange-500',
      'RH': 'from-indigo-500 to-blue-500',
      'Outros': 'from-gray-500 to-slate-500'
    }
    return colors[category] || 'from-gray-500 to-slate-500'
  }

  return (
    <>
      <div className="group relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 hover:scale-[1.02]">
        {/* Botão de ações */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            className="h-8 w-8 p-0 bg-[#1a1a1a]/80 border border-[#2a2a2a] hover:bg-[#00ff88]/10 hover:border-[#00ff88] text-[#00ff88] hover:text-[#00ff88]"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
          
          {/* Menu de ações */}
          {showActions && (
            <div className="absolute right-0 top-10 bg-[#0a0a0a] border border-[#00ff88] rounded-lg shadow-xl z-10 min-w-[120px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(workflow)}
                className="w-full justify-start rounded-none border-b border-[#2a2a2a] hover:bg-[#00ff88]/10 text-[#00ff88] hover:text-[#00ff88]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(workflow.id)}
                className="w-full justify-start rounded-none hover:bg-[#ff0066]/10 text-[#ff0066] hover:text-[#ff0066]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          )}
        </div>

        {/* Header do card */}
        <div className="mb-3">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-2xl">{getCategoryIcon(workflow.category)}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#00ff88] text-lg truncate group-hover:text-[#00ffff] transition-colors">
                {workflow.name}
              </h3>
              <p className="text-[#888888] text-sm line-clamp-2 group-hover:text-[#aaaaaa] transition-colors">
                {workflow.description}
              </p>
            </div>
          </div>
          
          {/* Badge de categoria */}
          <Badge 
            className={`bg-gradient-to-r ${getCategoryColor(workflow.category)} text-white border-0 px-3 py-1 text-xs font-medium`}
          >
            {workflow.category}
          </Badge>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {workflow.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#00ff88] text-xs rounded-md hover:border-[#00ff88] hover:bg-[#00ff88]/10 transition-colors"
              >
                {tag}
              </span>
            ))}
            {workflow.tags.length > 4 && (
              <span className="px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] text-xs rounded-md">
                +{workflow.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#00ff88]">
              <Download className="w-4 h-4" />
              <span>{workflow.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-[#ffaa00]">
              <Star className="w-4 h-4" />
              <span>{workflow.votes.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-[#888888] text-xs">
            v{workflow.version}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button
            onClick={() => setShowViewer(true)}
            variant="outline"
            size="sm"
            className="flex-1 bg-[#1a1a1a] border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,136,0.5)] transition-all duration-300"
          >
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          <Button
            onClick={handleDownload}
            size="sm"
            className="bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] hover:from-[#00ffff] hover:to-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] transition-all duration-300 font-semibold"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>

        {/* Informações adicionais */}
        <div className="mt-3 pt-3 border-t border-[#2a2a2a] text-xs text-[#666666]">
          <div className="flex items-center justify-between">
            <span>Por: {workflow.author}</span>
            <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Modal de visualização */}
      {showViewer && (
        <N8nWorkflowViewer
          workflow={workflow}
          open={showViewer}
          onOpenChange={setShowViewer}
        />
      )}
    </>
  )
}
