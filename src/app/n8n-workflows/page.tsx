'use client'

import { useState } from 'react'
import { N8nWorkflowSidebar } from '@/prompt-hub/components/N8nWorkflowSidebar'
import { N8nWorkflowCard } from '@/prompt-hub/components/N8nWorkflowCard'
import { N8nWorkflowTopbar } from '@/prompt-hub/components/N8nWorkflowTopbar'
import { ImportWorkflowsModal } from '@/prompt-hub/components/ImportWorkflowsModal'
import { useN8nWorkflows } from '@/prompt-hub/store/useN8nWorkflows'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Eye
} from 'lucide-react'
import type { N8nWorkflow } from '@/prompt-hub/types'

export default function N8nWorkflowsPage() {
  const {
    workflows,
    filtered,
    filters,
    viewMode,
    availableTags,
    availableCategories,
    totalWorkflows,
    realWorkflows,
    seedWorkflows,
    setFilters,
    setViewMode,
    deleteWorkflow,
    updateWorkflow,
    importWorkflows
  } = useN8nWorkflows()

  const [currentPage, setCurrentPage] = useState(1)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState<N8nWorkflow | null>(null)
  const itemsPerPage = 12

  // Calcular paginação
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentWorkflows = filtered.slice(startIndex, endIndex)

  // Handlers
  const handleFiltersChange = (newFilters: Partial<typeof filters>) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset para primeira página
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  const handleImportWorkflows = async (selectedFiles: string[]) => {
    // Simular importação de workflows
    const mockWorkflows: N8nWorkflow[] = selectedFiles.map((fileName, index) => ({
      id: `imported_${Date.now()}_${index}`,
      name: `Workflow Importado - ${fileName}`,
      description: `Workflow importado automaticamente de ${fileName}`,
      category: 'Outros' as const,
      tags: ['Importado', 'Automático'],
      jsonContent: JSON.stringify({ name: fileName, imported: true }, null, 2),
      downloads: 0,
      votes: 0,
      author: 'Sistema de Importação',
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      filePath: `/bibliotecaprompt/${fileName}`
    }))

    importWorkflows(mockWorkflows)
    setImportModalOpen(false)
  }

  const handleCreateWorkflow = () => {
    // Implementar criação de workflow
    console.log('Criar novo workflow')
  }

  const handleRefresh = () => {
    // Implementar refresh
    console.log('Atualizar biblioteca')
  }

  const handleSettings = () => {
    // Implementar configurações
    console.log('Abrir configurações')
  }

  const handleEditWorkflow = (workflow: N8nWorkflow) => {
    setEditingWorkflow(workflow)
    // Aqui você pode abrir um modal de edição
    console.log('Editar workflow:', workflow.name)
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    if (confirm('Tem certeza que deseja excluir este workflow? Esta ação não pode ser desfeita.')) {
      deleteWorkflow(workflowId)
    }
  }

  // Navegação de páginas
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  // Gerar botões de página
  const getPageButtons = () => {
    const buttons = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => goToPage(i)}
          className={i === currentPage 
            ? 'bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] hover:from-[#00ffff] hover:to-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
            : 'border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,136,0.3)]'
          }
        >
          {i}
        </Button>
      )
    }

    return buttons
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] text-white">
      {/* Topbar */}
      <N8nWorkflowTopbar
        onImportWorkflows={() => setImportModalOpen(true)}
        onCreateWorkflow={handleCreateWorkflow}
        onRefresh={handleRefresh}
        onSettings={handleSettings}
        onViewModeChange={handleViewModeChange}
        viewMode={viewMode}
        totalWorkflows={totalWorkflows}
        realWorkflows={realWorkflows}
        seedWorkflows={seedWorkflows}
      />

      <div className="flex">
        {/* Sidebar */}
        <N8nWorkflowSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableTags={availableTags}
          availableCategories={availableCategories}
        />

        {/* Conteúdo principal */}
        <div className="flex-1 p-6">
          {/* Estatísticas rápidas */}
          <div className="mb-6 p-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#00ff88]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#00ff88]" />
                  <span className="text-[#00ff88] font-medium">
                    {filtered.length.toLocaleString()} workflows encontrados
                  </span>
                </div>
                <div className="text-[#00ff88]/70">
                  Página {currentPage} de {totalPages}
                </div>
              </div>
              <div className="text-[#00ff88]/70 text-sm">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filtered.length)} de {filtered.length}
              </div>
            </div>
          </div>

          {/* Grid de workflows */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {currentWorkflows.map((workflow) => (
              <N8nWorkflowCard
                key={workflow.id}
                workflow={workflow}
                onEdit={handleEditWorkflow}
                onDelete={handleDeleteWorkflow}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {getPageButtons()}

              <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Modal de importação */}
          <ImportWorkflowsModal
            open={importModalOpen}
            onOpenChange={setImportModalOpen}
            onImport={handleImportWorkflows}
          />
        </div>
      </div>
    </div>
  )
}
