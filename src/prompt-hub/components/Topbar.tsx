import { Button } from '@/components/ui/button'
import { usePrompts } from '../store/usePrompts'
import { id, now } from '../lib/utils'
import type { Prompt } from '../types'
import { PromptEditor } from './PromptEditor'
import { useState } from 'react'

export function Topbar() {
  const { importMany } = usePrompts()
  const [editorOpen, setEditorOpen] = useState(false)

  const exportJson = () => {
    const data = localStorage.getItem('prompt-hub')
    if (!data) return
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-hub-${new Date().toISOString().slice(0,10)}.json`
    a.click(); URL.revokeObjectURL(url)
  }

  const importJson = async () => {
    const input = document.createElement('input')
    input.type = 'file'; input.accept = 'application/json'
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return
      const text = await file.text()
      try {
        const parsed = JSON.parse(text)
        const state = parsed.state?.state || parsed
        const items: Prompt[] = state.items?.map((p: Prompt) => ({ ...p, id: p.id || id(), createdAt: p.createdAt || now(), updatedAt: now() }))
        importMany(items)
      } catch (e) { console.error(e) }
    }
    input.click()
  }

  const openEditor = () => {
    setEditorOpen(true)
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 sticky top-0 z-10 bg-background/80 backdrop-blur border-b hologram-enhanced animated-border">
        <Button onClick={openEditor} className="neon-button font-orbitron font-semibold tracking-wide hover:scale-105 transition-all duration-300">Novo Prompt</Button>
        <Button variant="secondary" onClick={importJson} className="neon-button font-rajdhani hover:scale-105 transition-all duration-300">Importar JSON</Button>
        <Button variant="secondary" onClick={exportJson} className="neon-button font-rajdhani hover:scale-105 transition-all duration-300">Exportar</Button>
      </div>
      
      <PromptEditor 
        open={editorOpen} 
        onOpenChange={setEditorOpen}
      />
    </>
  )
}
