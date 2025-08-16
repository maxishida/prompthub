import { Heart, Copy, Variable, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePrompts } from '../store/usePrompts'
import { copyToClipboard } from '../lib/utils'
import type { Prompt } from '../types'
import { PromptEditor } from './PromptEditor'
import { useState } from 'react'

export function PromptCard({ prompt, onOpen }: { prompt: Prompt; onOpen: (p: Prompt)=>void }) {
  const { toggleFavorite, favorites, addRecent, remove } = usePrompts()
  const [editorOpen, setEditorOpen] = useState(false)
  const isFav = favorites.includes(prompt.id)

  const doCopy = async () => {
    await copyToClipboard(prompt.content)
    addRecent(prompt.id)
  }

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o prompt "${prompt.name}"?`)) {
      remove(prompt.id)
    }
  }

  return (
    <div className="neon-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{prompt.name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {prompt.tags.slice(0,4).map(t => <Badge key={t} className="neon-chip">{t}</Badge>)}
          </div>
        </div>
        <div className="flex gap-1">
          <button aria-label={isFav? 'Remover dos favoritos':'Adicionar aos favoritos'}
            className={`p-2 rounded-md border ${isFav? 'text-rose-400 border-rose-500/40':'text-muted-foreground border-white/10'} hover:bg-white/5`}
            onClick={() => toggleFavorite(prompt.id)}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
          </button>
          <button aria-label="Excluir prompt"
            className="p-2 rounded-md border text-red-400 border-red-500/40 hover:bg-red-500/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-auto flex-wrap">
        <Button size="sm" variant="secondary" onClick={doCopy} className="neon-border"><Copy className="h-4 w-4 mr-1"/>Copiar</Button>
        <Button size="sm" variant="secondary" onClick={() => onOpen(prompt)} className="neon-border"><Variable className="h-4 w-4 mr-1"/>Usar</Button>
        <Button size="sm" variant="secondary" onClick={() => setEditorOpen(true)} className="neon-border"><Edit className="h-4 w-4 mr-1"/>Editar</Button>
      </div>
      
      <PromptEditor 
        open={editorOpen} 
        onOpenChange={setEditorOpen}
        prompt={prompt}
      />
    </div>
  )
}
