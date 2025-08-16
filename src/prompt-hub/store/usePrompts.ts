import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Filters, Prompt } from '../types'
import { seedPrompts } from '../data/seed'
import { filterPrompts } from '../lib/utils'

export type PromptState = {
  items: Prompt[]
  favorites: string[]
  recent: string[]
  filters: Filters
  filtered: Prompt[]
  setFilters: (p: Partial<Filters>) => void
  toggleFavorite: (id: string) => void
  addRecent: (id: string) => void
  upsert: (p: Prompt) => void
  remove: (id: string) => void
  importMany: (ps: Prompt[]) => void
  hasHydrated: boolean
}

const initialFilters: Filters = {
  q: '', category: 'All', tags: [], model: 'all', lang: 'all'
}

export const usePrompts = create<PromptState>()(persist((set) => ({
  items: seedPrompts,
  favorites: [],
  recent: [],
  filters: initialFilters,
  filtered: seedPrompts,
  hasHydrated: true,
  setFilters: (p) => set(state => {
    const filters = { ...state.filters, ...p }
    const filtered = filterPrompts(state.items, filters)
    return { filters, filtered }
  }),
  toggleFavorite: (id) => set(state => {
    const favoritesSet = new Set(state.favorites)
    if (favoritesSet.has(id)) {
      favoritesSet.delete(id)
    } else {
      favoritesSet.add(id)
    }
    return { favorites: Array.from(favoritesSet) }
  }),
  addRecent: (id) => set(state => {
    const list = [id, ...state.recent.filter(i => i !== id)].slice(0, 20)
    return { recent: list }
  }),
  upsert: (p) => set(state => {
    const idx = state.items.findIndex(i => i.id === p.id)
    const items = [...state.items]
    if (idx >= 0) items[idx] = p; else items.unshift(p)
    return { items, filtered: filterPrompts(items, state.filters) }
  }),
  remove: (id) => set(state => {
    const items = state.items.filter(i => i.id !== id)
    return { items, filtered: filterPrompts(items, state.filters) }
  }),
  importMany: (ps) => set(state => {
    const items = [...ps, ...state.items]
    return { items, filtered: filterPrompts(items, state.filters) }
  })
}), { 
  name: 'prompt-hub',
  storage: createJSONStorage(() => {
    // Only use localStorage on client side
    if (typeof window !== 'undefined') {
      return localStorage
    }
    // Return a no-op storage for server side
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }),
  onRehydrateStorage: () => (state, error) => {
    // Marcar como hidratado assim que o persist terminar (com sucesso ou erro)
    try {
      usePrompts.setState({
        hasHydrated: true,
        filtered: filterPrompts(state?.items ?? seedPrompts, state?.filters ?? initialFilters)
      })
    } catch {
      usePrompts.setState({ hasHydrated: true })
    }
  }
}))

// Marcar quando a hidratação do persist terminar para evitar mismatches de SSR/CSR
;(usePrompts as any)?.persist?.onFinishHydration?.((state: PromptState) => {
  usePrompts.setState({ hasHydrated: true, filtered: filterPrompts(state.items, state.filters) })
})
