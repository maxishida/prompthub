import { useMemo } from 'react'
import { usePrompts } from '../store/usePrompts'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import type { Filters } from '../types'
const categories: Array<{ key: Filters['category']; label: string; color: string }> = [
  { key: 'All', label: 'Todos', color: 'from-green-400 to-emerald-400' },
  { key: 'Codar', label: 'Codar', color: 'from-green-400 to-cyan-400' },
  { key: 'Design', label: 'Design', color: 'from-lime-400 to-green-400' },
  { key: 'Vídeos', label: 'Vídeos', color: 'from-emerald-400 to-teal-400' },
  { key: 'Fotos', label: 'Fotos', color: 'from-green-400 to-lime-400' },
  { key: 'Tarefas', label: 'Tarefas', color: 'from-teal-400 to-green-400' },
  { key: 'Outros', label: 'Outros', color: 'from-cyan-400 to-emerald-400' },
  { key: 'Workflow N8n', label: 'Workflow N8n', color: 'from-cyan-400 to-blue-400' },
]

export function Sidebar() {
  const { items, filters, setFilters, favorites } = usePrompts()

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length }
    for (const p of items) map[p.category] = (map[p.category] || 0) + 1
    return map
  }, [items])

  return (
    <aside className="w-80 shrink-0 p-4 border-r bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] hologram-enhanced animated-border green-glow">
      <div className="mb-4">
        <div className="relative">
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value })}
            placeholder="Pesquisar prompts… (Ctrl+K)"
            className="neon-input font-rajdhani"
            aria-label="Pesquisar"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm uppercase tracking-widest text-green-400 font-orbitron neon-pulse">Categorias</h3>
        <div className="flex flex-col gap-1">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setFilters({ category: c.key })}
              className={cn(
                'neon-card flex items-center justify-between px-3 py-2 text-left font-rajdhani transition-all duration-300 hover:scale-105 hover:shadow-neon green-glow',
                filters.category === c.key && 'ring-2 ring-green-400 neon-pulse'
              )}
            >
              <span className="font-medium">{c.label}</span>
              <Badge className="neon-chip">{counts[c.key] || 0}</Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Seção especial para Workflows N8n */}
      <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-400 font-orbitron">Biblioteca N8n</h3>
        </div>
        <p className="text-xs text-cyan-300/80 mb-3 font-rajdhani">
          Mais de 2.000 workflows prontos para automação
        </p>
        <Link href="/n8n-workflows">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-0 font-rajdhani"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Explorar Workflows
          </Button>
        </Link>
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase tracking-widest text-green-400 mb-2 font-orbitron neon-pulse">Favoritos</h3>
        <div className="flex flex-wrap gap-2">
          {favorites.slice(0, 10).map((id) => {
            const p = items.find(i => i.id === id)
            if (!p) return null
            return <Badge key={id} className="neon-chip animate-fade-in green-glow" title={p.name}>{p.category}</Badge>
          })}
          {!favorites.length && <p className="text-sm text-green-400/70 font-rajdhani terminal-text neon-pulse">Nenhum favorito ainda.</p>}
        </div>
      </div>
    </aside>
  )
}
