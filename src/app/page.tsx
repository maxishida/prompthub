'use client'

import { useEffect, useMemo, useState, useRef, startTransition } from 'react'
import { Sidebar as PHSidebar } from '@/prompt-hub/components/Sidebar'
import { Topbar } from '@/prompt-hub/components/Topbar'
import { PromptCard } from '@/prompt-hub/components/PromptCard'
import { PromptDrawer } from '@/prompt-hub/components/PromptDrawer'
import { usePrompts } from '@/prompt-hub/store/usePrompts'
import type { Prompt } from '@/prompt-hub/types'
import { Empty } from '@/prompt-hub/components/Empty'

export default function Home() {
  const { filtered, setFilters, filters, hasHydrated } = usePrompts()
  const [selected, setSelected] = useState<Prompt | undefined>()
  const [open, setOpen] = useState(false)

  const onOpen = (p: Prompt) => { setSelected(p); setOpen(true) }

  // postMessage: ouvir pai → iframe
  const msgTimerRef = useRef<number | null>(null)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const data = e.data || {}
      if (data?.__promptHub === true) {
        const incoming = data.payload
        if (msgTimerRef.current) {
          clearTimeout(msgTimerRef.current)
        }
        msgTimerRef.current = window.setTimeout(() => {
          try {
            const same = JSON.stringify(incoming) === JSON.stringify(filters)
            if (!same) {
              startTransition(() => setFilters(incoming))
            }
          } catch {
            startTransition(() => setFilters(incoming))
          }
        }, 50)
      }
    }
    window.addEventListener('message', onMsg)
    return () => {
      window.removeEventListener('message', onMsg)
      if (msgTimerRef.current) clearTimeout(msgTimerRef.current)
    }
  }, [setFilters, filters])

  // iframe → pai
  const lastSent = useRef<string>("")
  useEffect(() => {
    const payloadStr = JSON.stringify(filters)
    if (payloadStr !== lastSent.current) {
      lastSent.current = payloadStr
      try { window.parent?.postMessage({ __promptHub: true, type: 'filters', payload: filters }, '*') } catch {}
    }
  }, [filters])

  const grid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {filtered.map(p => <PromptCard key={p.id} prompt={p} onOpen={onOpen} />)}
    </div>
  ), [filtered])

  // Evitar hydration mismatch: renderiza esqueleto minimal até a persistência hidratar
  if (!hasHydrated) {
    return <div className="min-h-screen bg-[#0B1020] text-white" suppressHydrationWarning />
  }

  return (
    <div className="min-h-screen bg-[#0B1020] text-white" suppressHydrationWarning>
      <Topbar />
      <div className="flex">
        <PHSidebar />
        <main className="flex-1">
          {filtered.length ? grid : <Empty />}
        </main>
      </div>
      <PromptDrawer open={open} onOpenChange={setOpen} prompt={selected} />
    </div>
  )
}