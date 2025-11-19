// src/hooks/useSecureDownload.ts

import { useState } from 'react'

export function useSecureDownload() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = async (url: string, filename = 'aditivo.docx') => {
    setIsDownloading(true)
    setError(null)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000) // 30s

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 🔑 Envia cookies de autenticação
        signal: controller.signal,
      })

      if (response.status === 401 || response.status === 403) {
        throw new Error('Sessão expirada. Faça login novamente.')
      }

      if (!response.ok) {
        throw new Error(`Erro ao baixar: ${response.status}`)
      }

      // Extrai nome do arquivo do header Content-Disposition
      const disposition = response.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)
      const suggestedName = match 
        ? decodeURIComponent(match[1].replace(/"/g, '')) 
        : filename

      // Baixa o arquivo
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = suggestedName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)

      return true
    } catch (err: any) {
      const message = err.name === 'AbortError' 
        ? 'Tempo esgotado. Tente novamente.' 
        : err.message || 'Erro desconhecido'
      
      setError(message)
      console.error('Erro no download:', err)
      return false
    } finally {
      clearTimeout(timeout)
      setIsDownloading(false)
    }
  }

  return { download, isDownloading, error }
}