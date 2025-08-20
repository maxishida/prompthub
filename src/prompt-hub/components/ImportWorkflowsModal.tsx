'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  FolderOpen,
  X,
  RefreshCw
} from 'lucide-react'

interface ImportWorkflowsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (selectedFiles: string[]) => void
}

interface WorkflowFileInfo {
  fileName: string
  filePath: string
  category: string
  action: string
  type: string
  trigger: string
  size: number
  lastModified: Date
}

export function ImportWorkflowsModal({ open, onOpenChange, onImport }: ImportWorkflowsModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [files, setFiles] = useState<WorkflowFileInfo[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [importProgress, setImportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)

  // Simular scan da pasta bibliotecaprompt
  useEffect(() => {
    if (open && files.length === 0) {
      handleScanFolder()
    }
  }, [open])

  const handleScanFolder = async () => {
    setIsScanning(true)
    setScanProgress(0)
    
    // Simular progresso do scan
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setScanProgress(i)
    }

    // Simular arquivos encontrados
    const mockFiles: WorkflowFileInfo[] = [
      {
        fileName: '001_Marketing_Email_Automation_Webhook.json',
        filePath: '/bibliotecaprompt/001_Marketing_Email_Automation_Webhook.json',
        category: 'Marketing',
        action: 'Email',
        type: 'Automation',
        trigger: 'Webhook',
        size: 24576,
        lastModified: new Date(Date.now() - 86400000)
      },
      {
        fileName: '002_Automation_Data_Processing_Manual.json',
        filePath: '/bibliotecaprompt/002_Automation_Data_Processing_Manual.json',
        category: 'Automação',
        action: 'Data Processing',
        type: 'Automation',
        trigger: 'Manual',
        size: 18432,
        lastModified: new Date(Date.now() - 172800000)
      },
      {
        fileName: '003_Integrations_API_Sync_Scheduled.json',
        filePath: '/bibliotecaprompt/003_Integrations_API_Sync_Scheduled.json',
        category: 'Integrações',
        action: 'API Sync',
        type: 'Integration',
        trigger: 'Scheduled',
        size: 32768,
        lastModified: new Date(Date.now() - 259200000)
      },
      {
        fileName: '004_DevOps_Deployment_Webhook.json',
        filePath: '/bibliotecaprompt/004_DevOps_Deployment_Webhook.json',
        category: 'DevOps',
        action: 'Deployment',
        type: 'Automation',
        trigger: 'Webhook',
        size: 20480,
        lastModified: new Date(Date.now() - 345600000)
      },
      {
        fileName: '005_IA_Image_Processing_Manual.json',
        filePath: '/bibliotecaprompt/005_IA_Image_Processing_Manual.json',
        category: 'IA',
        action: 'Image Processing',
        type: 'AI',
        trigger: 'Manual',
        size: 40960,
        lastModified: new Date(Date.now() - 432000000)
      }
    ]

    setFiles(mockFiles)
    setIsScanning(false)
    setScanProgress(100)
  }

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map(f => f.fileName)))
    }
  }

  const handleFileToggle = (fileName: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(fileName)) {
      newSelected.delete(fileName)
    } else {
      newSelected.add(fileName)
    }
    setSelectedFiles(newSelected)
  }

  const handleImport = async () => {
    if (selectedFiles.size === 0) return

    setIsImporting(true)
    setImportProgress(0)

    // Simular progresso da importação
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setImportProgress(i)
    }

    // Chamar função de importação
    onImport(Array.from(selectedFiles))
    
    setIsImporting(false)
    setImportProgress(0)
    setSelectedFiles(new Set())
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#00ff88] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00ff88] flex items-center gap-3">
            <Upload className="w-6 h-6" />
            Importar Workflows N8n
          </DialogTitle>
          <DialogDescription className="text-[#00ff88]/70">
            Escaneie e importe workflows da pasta bibliotecaprompt
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scanner */}
          <div className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#00ff88]/30 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#00ff88] flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Scanner de Pasta
              </h3>
              <Button
                onClick={handleScanFolder}
                disabled={isScanning}
                variant="outline"
                size="sm"
                className="border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all duration-300"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Escaneando...' : 'Escanear'}
              </Button>
            </div>

            {isScanning && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-[#00ff88]">
                  <span>Escaneando pasta bibliotecaprompt...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2 bg-[#1a1a1a] border border-[#00ff88]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ffff] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                    style={{ width: `${scanProgress}%` }}
                  />
                </Progress>
              </div>
            )}

            {!isScanning && files.length > 0 && (
              <div className="text-[#00ff88] text-sm">
                ✅ {files.length} arquivos encontrados na pasta bibliotecaprompt
              </div>
            )}
          </div>

          {/* Lista de arquivos */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#00ff88]">
                  Arquivos Disponíveis ({files.length})
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#00ff88]/70">
                    {selectedFiles.size} de {files.length} selecionados
                  </span>
                  <Button
                    onClick={handleSelectAll}
                    variant="outline"
                    size="sm"
                    className="border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all duration-300"
                  >
                    {selectedFiles.size === files.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </Button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {files.map((file) => (
                  <div
                    key={file.fileName}
                    className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedFiles.has(file.fileName)
                        ? 'border-[#00ff88] bg-[#00ff88]/10 shadow-[0_0_10px_rgba(0,255,136,0.2)]'
                        : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#00ff88]/50 hover:bg-[#00ff88]/5'
                    }`}
                    onClick={() => handleFileToggle(file.fileName)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.fileName)}
                        onChange={() => handleFileToggle(file.fileName)}
                        className="mt-1 w-4 h-4 text-[#00ff88] bg-[#1a1a1a] border-[#00ff88] rounded focus:ring-[#00ff88] focus:ring-2"
                        aria-label={`Selecionar ${file.fileName}`}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-[#00ff88]" />
                          <h4 className="font-medium text-[#00ff88] truncate">
                            {file.fileName}
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="text-[#00ff88]/70">Categoria:</span>
                            <Badge className={`ml-2 bg-gradient-to-r ${getCategoryColor(file.category)} text-[#0a0a0a] border-0`}>
                              {file.category}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-[#00ff88]/70">Ação:</span>
                            <span className="ml-2 text-[#00ff88]">{file.action}</span>
                          </div>
                          <div>
                            <span className="text-[#00ff88]/70">Tipo:</span>
                            <span className="ml-2 text-[#00ff88]">{file.type}</span>
                          </div>
                          <div>
                            <span className="text-[#00ff88]/70">Trigger:</span>
                            <span className="ml-2 text-[#00ff88]">{file.trigger}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-[#00ff88]/70">
                          <span>Tamanho: {formatFileSize(file.size)}</span>
                          <span>Modificado: {file.lastModified.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progresso da importação */}
          {isImporting && (
            <div className="p-4 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#00ff88]/30 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-[#00ff88]">
                  <span>Importando workflows selecionados...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2 bg-[#1a1a1a] border border-[#00ff88]/30">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00ff88] to-[#00ffff] transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                    style={{ width: `${importProgress}%` }}
                  />
                </Progress>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-[#ff0066] text-[#ff0066] hover:bg-[#ff0066] hover:text-[#0a0a0a] hover:shadow-[0_0_10px_rgba(255,0,102,0.3)] transition-all duration-300"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          
          <Button
            onClick={handleImport}
            disabled={selectedFiles.size === 0 || isImporting}
            className="bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-[#0a0a0a] hover:from-[#00ffff] hover:to-[#00ff88] hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importando...' : `Importar ${selectedFiles.size} Workflow${selectedFiles.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
