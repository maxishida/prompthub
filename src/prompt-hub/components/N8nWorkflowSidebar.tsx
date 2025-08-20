'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Filter, 
  Zap,
  X,
  Star
} from 'lucide-react'
import type { N8nWorkflow, N8nWorkflowFilters, N8nWorkflowCategory } from '../types'

interface N8nWorkflowSidebarProps {
  filters: N8nWorkflowFilters
  onFiltersChange: (filters: N8nWorkflowFilters) => void
  availableTags: string[]
  availableCategories: N8nWorkflowCategory[]
}

export function N8nWorkflowSidebar({ 
  filters, 
  onFiltersChange, 
  availableTags, 
  availableCategories 
}: N8nWorkflowSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryToggle = (category: N8nWorkflowCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    
    onFiltersChange({ ...filters, tags: newTags })
  }

  const handleSortChange = (sortBy: 'newest' | 'downloads' | 'votes' | 'name') => {
    onFiltersChange({ ...filters, sortBy })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      tags: [],
      sortBy: 'newest',
      searchQuery: ''
    })
    setSearchQuery('')
  }

  const getCategoryColor = (category: N8nWorkflowCategory) => {
    const colors: Record<N8nWorkflowCategory, string> = {
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
    <div className="w-80 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] border-r border-[#00ff88] p-6 shadow-[5px_0_20px_rgba(0,255,136,0.1)]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#00ff88] mb-2 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </h2>
        <p className="text-[#00ff88]/70 text-sm">
          Organize e encontre seus workflows
        </p>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff88] w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#00ff88] rounded-lg text-[#00ff88] placeholder:text-[#00ff88]/50 focus:border-[#00ffff] focus:ring-[#00ffff]/20 focus:outline-none transition-all duration-300"
          />
        </div>
      </div>

      {/* Botão limpar filtros */}
      {(filters.categories.length > 0 || filters.tags.length > 0) && (
        <div className="mb-6">
          <Button
            onClick={clearAllFilters}
            variant="outline"
            size="sm"
            className="w-full border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(255,0,102,0.3)] transition-all duration-300"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Categorias */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#00ff88] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Categorias
        </h3>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              onClick={() => handleCategoryToggle(category)}
              className={`w-full justify-start text-left h-auto py-2 px-3 rounded-lg transition-all duration-300 ${
                filters.categories.includes(category)
                  ? `bg-gradient-to-r ${getCategoryColor(category)} text-[#0a0a0a] shadow-[0_0_10px_rgba(0,255,136,0.3)]`
                  : 'text-[#00ff88] hover:text-[#00ffff] hover:bg-[#00ff88]/10'
              }`}
            >
              <span className="flex-1">{category}</span>
              {filters.categories.includes(category) && (
                <Badge className="ml-2 bg-[#0a0a0a]/20 text-[#0a0a0a] border-0">
                  ✓
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#00ff88] mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Tags
        </h3>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {availableTags.map((tag) => (
              <Button
                key={tag}
                variant="ghost"
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className={`w-full justify-start text-left h-auto py-2 px-3 rounded-lg transition-all duration-300 ${
                  filters.tags.includes(tag)
                    ? 'bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                    : 'text-[#00ff88] hover:text-[#00ffff] hover:bg-[#00ff88]/10'
                }`}
              >
                <span className="flex-1">{tag}</span>
                {filters.tags.includes(tag) && (
                  <Badge className="ml-2 bg-[#0a0a0a]/20 text-[#0a0a0a] border-0">
                    ✓
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Ordenação */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#00ff88] mb-3">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { value: 'newest' as const, label: 'Mais Recentes' },
            { value: 'downloads' as const, label: 'Mais Baixados' },
            { value: 'votes' as const, label: 'Mais Votados' },
            { value: 'name' as const, label: 'Nome A-Z' }
          ].map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => handleSortChange(option.value)}
              className={`w-full justify-start text-left h-auto py-2 px-3 rounded-lg transition-all duration-300 ${
                filters.sortBy === option.value
                  ? 'bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] shadow-[0_0_10px_rgba(0,255,136,0.3)]'
                  : 'text-[#00ff88] hover:text-[#00ffff] hover:bg-[#00ff88]/10'
              }`}
            >
              {option.label}
              {filters.sortBy === option.value && (
                <Badge className="ml-auto bg-[#0a0a0a]/20 text-[#0a0a0a] border-0">
                  ✓
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Resumo dos filtros */}
      <div className="mt-auto p-4 bg-[#1a1a1a]/50 border border-[#00ff88]/30 rounded-lg">
        <h4 className="text-sm font-medium text-[#00ff88] mb-2">Resumo dos Filtros</h4>
        <div className="space-y-1 text-xs text-[#00ff88]/70">
          <div className="flex justify-between">
            <span>Categorias:</span>
            <span className="text-[#00ff88] font-medium">{filters.categories.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Tags disponíveis:</span>
            <span className="text-[#00ff88] font-medium">{availableTags.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Ordenação:</span>
            <span className="text-[#00ff88] font-medium">
              {filters.sortBy === 'newest' && 'Mais Recentes'}
              {filters.sortBy === 'downloads' && 'Mais Baixados'}
              {filters.sortBy === 'votes' && 'Mais Votados'}
              {filters.sortBy === 'name' && 'Nome A-Z'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
