import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { copyToClipboard, applyVariables, detectVariables } from '../lib/utils'
import type { Prompt } from '../types'
import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function PromptDrawer({ open, onOpenChange, prompt }: { open: boolean; onOpenChange: (v:boolean)=>void; prompt?: Prompt }) {
  const [vars, setVars] = useState<Record<string,string>>({})
  const detected = useMemo(() => detectVariables(prompt?.content || ''), [prompt?.content])
  const filled = useMemo(() => prompt ? applyVariables(prompt.content, vars) : '', [prompt, vars])
  const [fillOpen, setFillOpen] = useState(false)

  const onCopy = async () => { if (filled) await copyToClipboard(filled) }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader>
          <DrawerTitle>{prompt?.name}</DrawerTitle>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
            {prompt?.tags.map(t => <Badge key={t} className="neon-chip">{t}</Badge>)}
          </div>
        </DrawerHeader>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="neon-card p-4 overflow-auto max-h-[60vh]" aria-label="Conteúdo do prompt">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{prompt?.content}</pre>
          </article>
          <section className="neon-card p-4">
            <h4 className="font-medium mb-2">Variáveis detectadas</h4>
            {detected.length ? (
              <div className="space-y-2">
                {detected.map(v => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-xs text-muted-foreground">{v.key}</label>
                    <Input value={vars[v.key] || ''} onChange={e=>setVars(s=>({...s,[v.key]:e.target.value}))} className="neon-input" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma variável {'{{}}'}.</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button onClick={()=>setFillOpen(true)} variant="secondary" className="neon-border">Preencher</Button>
              <Button onClick={onCopy} className="neon-border">Copiar</Button>
            </div>
          </section>

          <section className="md:col-span-2">
            <h4 className="font-medium mb-2">Pré‑visualização</h4>
            <div className="neon-card p-4 max-h-[30vh] overflow-auto">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">{filled}</pre>
            </div>
          </section>
        </div>
      </DrawerContent>

      <Dialog open={fillOpen} onOpenChange={setFillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preencher variáveis</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {detected.map(v => (
              <div key={v.key} className="space-y-1">
                <label className="text-xs text-muted-foreground">{v.key}</label>
                <Input value={vars[v.key] || ''} onChange={e=>setVars(s=>({...s,[v.key]:e.target.value}))} />
              </div>
            ))}
            <Button onClick={()=>setFillOpen(false)}>Aplicar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Drawer>
  )
}
