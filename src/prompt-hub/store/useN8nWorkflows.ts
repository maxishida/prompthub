import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedN8nWorkflows } from '../data/n8n-seed'
import type { N8nWorkflow, N8nWorkflowFilters, N8nWorkflowCategory } from '../types'

interface N8nWorkflowsState {
  workflows: N8nWorkflow[]
  filters: N8nWorkflowFilters
  viewMode: 'grid' | 'list'
  
  // Ações
  setFilters: (filters: Partial<N8nWorkflowFilters>) => void
  setViewMode: (mode: 'grid' | 'list') => void
  addWorkflow: (workflow: Omit<N8nWorkflow, 'id'>) => void
  updateWorkflow: (id: string, updates: Partial<N8nWorkflow>) => void
  deleteWorkflow: (id: string) => void
  importWorkflows: (workflows: N8nWorkflow[]) => void
  
  // Computed values
  filtered: N8nWorkflow[]
  availableTags: string[]
  availableCategories: N8nWorkflowCategory[]
  totalWorkflows: number
  realWorkflows: number
  seedWorkflows: number
}

const defaultFilters: N8nWorkflowFilters = {
  categories: [],
  tags: [],
  sortBy: 'newest',
  searchQuery: ''
}

export const useN8nWorkflows = create<N8nWorkflowsState>()(
  persist(
    (set, get) => ({
      workflows: seedN8nWorkflows,
      filters: defaultFilters,
      viewMode: 'grid',

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }))
      },

      setViewMode: (mode) => {
        set({ viewMode: mode })
      },

      addWorkflow: (workflowData) => {
        const newWorkflow: N8nWorkflow = {
          ...workflowData,
          id: `workflow_${Date.now()}`,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
        set((state) => ({
          workflows: [...state.workflows, newWorkflow]
        }))
      },

      updateWorkflow: (id, updates) => {
        set((state) => ({
          workflows: state.workflows.map(workflow =>
            workflow.id === id
              ? { ...workflow, ...updates, updatedAt: Date.now() }
              : workflow
          )
        }))
      },

      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter(workflow => workflow.id !== id)
        }))
      },

      importWorkflows: (newWorkflows) => {
        set((state) => {
          // Evitar duplicatas baseado no nome
          const existingNames = new Set(state.workflows.map(w => w.name))
          const uniqueWorkflows = newWorkflows.filter(w => !existingNames.has(w.name))
          
          return {
            workflows: [...state.workflows, ...uniqueWorkflows]
          }
        })
      },

      get filtered() {
        const state = get()
        let filtered = state.workflows

        // Filtrar por busca
        if (state.filters.searchQuery) {
          const query = state.filters.searchQuery.toLowerCase()
          filtered = filtered.filter(workflow =>
            workflow.name.toLowerCase().includes(query) ||
            workflow.description.toLowerCase().includes(query) ||
            workflow.tags.some(tag => tag.toLowerCase().includes(query))
          )
        }

        // Filtrar por categorias
        if (state.filters.categories.length > 0) {
          filtered = filtered.filter(workflow =>
            state.filters.categories.includes(workflow.category)
          )
        }

        // Filtrar por tags
        if (state.filters.tags.length > 0) {
          filtered = filtered.filter(workflow =>
            state.filters.tags.some(tag => workflow.tags.includes(tag))
          )
        }

        // Ordenar
        filtered = [...filtered].sort((a, b) => {
          switch (state.filters.sortBy) {
            case 'newest':
              return b.createdAt - a.createdAt
            case 'downloads':
              return b.downloads - a.downloads
            case 'votes':
              return b.votes - a.votes
            case 'name':
              return a.name.localeCompare(b.name)
            default:
              return 0
          }
        })

        return filtered
      },

      get availableTags() {
        const state = get()
        const allTags = state.workflows.flatMap(workflow => workflow.tags)
        return [...new Set(allTags)].sort()
      },

      get availableCategories() {
        const state = get()
        const allCategories = state.workflows.map(workflow => workflow.category)
        return [...new Set(allCategories)].sort() as N8nWorkflowCategory[]
      },

      get totalWorkflows() {
        return get().workflows.length
      },

      get realWorkflows() {
        return get().workflows.filter(w => w.filePath && w.filePath.startsWith('/bibliotecaprompt')).length
      },

      get seedWorkflows() {
        return get().workflows.filter(w => !w.filePath || !w.filePath.startsWith('/bibliotecaprompt')).length
      }
    }),
    {
      name: 'n8n-workflows-storage',
      partialize: (state) => ({
        workflows: state.workflows,
        filters: state.filters,
        viewMode: state.viewMode
      })
    }
  )
)
