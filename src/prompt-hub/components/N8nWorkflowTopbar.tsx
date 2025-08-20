'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Upload, 
  Download, 
  Settings, 
  RefreshCw, 
  FileText,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'

interface N8nWorkflowTopbarProps {
  onImportWorkflows: () => void
  onCreateWorkflow: () => void
  onRefresh: () => void
  onSettings: () => void
  onViewModeChange: (mode: 'grid' | 'list') => void
  viewMode: 'grid' | 'list'
  totalWorkflows: number
  realWorkflows: number
  seedWorkflows: number
}

export function N8nWorkflowTopbar({
  onImportWorkflows,
  onCreateWorkflow,
  onRefresh,
  onSettings,
  onViewModeChange,
  viewMode,
  totalWorkflows,
  realWorkflows,
  seedWorkflows
}: N8nWorkflowTopbarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a] border-b border-[#00ff88] p-4 shadow-[0_0_20px_rgba(0,255,136,0.1)]">
      <div className="flex items-center justify-between">
        {/* Lado esquerdo - Estatísticas e busca */}
        <div className="flex items-center gap-6">
          {/* Estatísticas rápidas */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] border-0 shadow-[0_0_10px_rgba(0,255,136,0.3)]">
                {totalWorkflows.toLocaleString()}
              </Badge>
              <span className="text-sm text-[#00ff88] font-medium">Total</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-[#00ffff] to-[#0088ff] text-[#0a0a0a] border-0 shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                {realWorkflows.toLocaleString()}
              </Badge>
              <span className="text-sm text-[#00ffff] font-medium">Reais</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-[#ff0088] to-[#ff00ff] text-[#0a0a0a] border-0 shadow-[0_0_10px_rgba(255,0,136,0.3)]">
                {seedWorkflows.toLocaleString()}
              </Badge>
              <span className="text-sm text-[#ff0088] font-medium">Seed</span>
            </div>
          </div>

          {/* Barra de busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff88] w-4 h-4" />
            <Input
              placeholder="Buscar workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-[#1a1a1a]/80 border-[#00ff88] text-[#00ff88] placeholder:text-[#00ff88]/50 focus:border-[#00ffff] focus:ring-[#00ffff]/20 focus:bg-[#1a1a1a] transition-all duration-300"
            />
          </div>
        </div>

        {/* Lado direito - Ações e controles */}
        <div className="flex items-center gap-3">
          {/* Controles de visualização */}
          <div className="flex items-center gap-1 bg-[#1a1a1a]/80 rounded-lg p-1 border border-[#2a2a2a]">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={viewMode === 'grid' 
                ? 'bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] hover:from-[#00ffff] hover:to-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-[#00ff88] hover:text-[#00ffff] hover:bg-[#00ff88]/10'
              }
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={viewMode === 'list' 
                ? 'bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] hover:from-[#00ffff] hover:to-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                : 'text-[#00ff88] hover:text-[#00ffff] hover:bg-[#00ff88]/10'
              }
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Botões de ação */}
          <Button
            onClick={onImportWorkflows}
            variant="outline"
            size="sm"
            className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all duration-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>

          <Button
            onClick={onCreateWorkflow}
            variant="outline"
            size="sm"
            className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar
          </Button>

          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(255,170,0,0.3)] transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button
            onClick={onSettings}
            variant="outline"
            size="sm"
            className="border-[#ff0088] text-[#ff0088] hover:bg-[#ff0088] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(255,0,136,0.3)] transition-all duration-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Config
          </Button>
        </div>
      </div>

      {/* Barra de progresso da integração */}
      {realWorkflows > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-[#00ff88] mb-2">
            <span>Progresso da Integração</span>
            <span>{Math.round((realWorkflows / (realWorkflows + seedWorkflows)) * 100)}%</span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-2 border border-[#00ff88]">
            <div 
              className="bg-gradient-to-r from-[#00ff88] to-[#00ffff] h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,255,136,0.5)]"
              style={{ width: `${(realWorkflows / (realWorkflows + seedWorkflows)) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#00ff88]/70 mt-1">
            <span>Workflows reais integrados: {realWorkflows}</span>
            <span>Workflows seed: {seedWorkflows}</span>
          </div>
        </div>
      )}
    </div>
  )
}
