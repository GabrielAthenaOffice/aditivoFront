// src/screens/components/aditivoform.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemas } from '@/schemas'
import { AditivoRequestDTO, AditivoResponseDTO, TemplateKey } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ENDPOINTS } from '@/constants'
import { useMemo, useState } from 'react'

// Função robusta para construir URLs
function buildDownloadUrl(url: string): string {
  if (!url) return ''
  
  // Se já é URL completa, retorna como está
  if (url.startsWith('http')) {
    return url
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  
  // Remove barras duplicadas
  const cleanPath = url.startsWith('/') ? url.slice(1) : url
  return `${cleanBaseUrl}/${cleanPath}`
}

// Função simplificada para download único
const forceDownload = (url: string, filename: string = 'aditivo.docx') => {
  console.log('🔗 Iniciando download:', url)
  
  // Método prioritário: window.open (mais confiável para arquivos)
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  
  // Verifica após 500ms se o popup foi bloqueado
  setTimeout(() => {
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.log('🛑 Popup bloqueado, usando método alternativo...')
      
      // Método alternativo: link programático
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('✅ Método alternativo executado')
    } else {
      console.log('✅ Popup aberto com sucesso')
    }
  }, 500)
}

export default function AditivoForm({ template }: { template: TemplateKey }) {
  const schema = schemas[template] as any
  const [lastDownloadUrl, setLastDownloadUrl] = useState<string>('')

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<AditivoRequestDTO>({ 
    resolver: zodResolver(schema) 
  })

  const endpoint = useMemo(() => ENDPOINTS[template], [template])

  const mutation = useMutation({
    mutationFn: async (payload: AditivoRequestDTO) => {
      console.log('📤 Enviando dados para:', endpoint)
      const res = await api.post<AditivoResponseDTO>(endpoint, { 
        ...payload, 
        templateNome: template 
      })
      return res.data
    },
    onSuccess: (data) => {
      console.log('✅ Resposta completa do backend:', data)
      
      // CORREÇÃO AQUI: usar urlDownload em vez de downloadUrl
      const downloadUrl = data.urlDownload || data.downloadUrl
      console.log('📥 URL de download:', downloadUrl)
      
      if (!downloadUrl) {
        console.error('❌ Nenhuma URL de download recebida')
        return
      }
      
      const fullUrl = buildDownloadUrl(downloadUrl)
      console.log('🔗 URL completa:', fullUrl)
      setLastDownloadUrl(fullUrl)
      
      // Aguardar um pouco para garantir processamento no backend
      setTimeout(() => {
        forceDownload(fullUrl, `aditivo_${template}_${Date.now()}.docx`)
      }, 800)
    },
    onError: (error: any) => {
      console.error('❌ Erro na requisição:', error)
      console.error('📋 Detalhes:', error.response?.data)
    }
  })

  const onSubmit = (data: AditivoRequestDTO) => {
    console.log('📝 Dados do formulário:', data)
    mutation.mutate(data)
  }

  const handleManualDownload = () => {
    if (lastDownloadUrl) {
      console.log('🔄 Download manual solicitado')
      forceDownload(lastDownloadUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded-lg bg-white shadow-sm">
      {/* Empresa ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa ID *
        </label>
        <input
          placeholder="Ex: 12345"
          {...register('empresaId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          inputMode="numeric"
          pattern="\d*"
        />
        {errors.empresaId && (
          <p className="text-red-600 text-sm mt-1">{errors.empresaId.message as string}</p>
        )}
      </div>

      {/* Unidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidade *
          </label>
          <input 
            placeholder="Nome da unidade" 
            {...register('unidadeNome')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.unidadeNome && (
            <p className="text-red-600 text-sm mt-1">{errors.unidadeNome.message as string}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CNPJ Unidade *
          </label>
          <input 
            placeholder="00.000.000/0000-00" 
            {...register('unidadeCnpj')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.unidadeCnpj && (
            <p className="text-red-600 text-sm mt-1">{errors.unidadeCnpj.message as string}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Unidade *
          </label>
          <input 
            placeholder="Endereço completo" 
            {...register('unidadeEndereco')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.unidadeEndereco && (
            <p className="text-red-600 text-sm mt-1">{errors.unidadeEndereco.message as string}</p>
          )}
        </div>
      </div>

      {/* Pessoa Física */}
      {(template.includes('PF') || template.startsWith('ADITIVO_CONTRATUAL')) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome PF *
            </label>
            <input 
              placeholder="Nome completo" 
              {...register('pessoaFisicaNome')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <input 
              placeholder="000.000.000-00" 
              {...register('pessoaFisicaCpf')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço PF *
            </label>
            <input 
              placeholder="Endereço completo" 
              {...register('pessoaFisicaEndereco')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(errors.pessoaFisicaNome || errors.pessoaFisicaCpf) && (
            <div className="col-span-3">
              <p className="text-red-600 text-sm">
                {errors.pessoaFisicaNome?.message || errors.pessoaFisicaCpf?.message as string}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pessoa Jurídica */}
      {(template.includes('PJ') || template.startsWith('ADITIVO_CONTRATUAL')) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome PJ *
            </label>
            <input 
              placeholder="Razão social" 
              {...register('pessoaJuridicaNome')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ PJ *
            </label>
            <input 
              placeholder="00.000.000/0000-00" 
              {...register('pessoaJuridicaCnpj')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço PJ *
            </label>
            <input 
              placeholder="Endereço completo" 
              {...register('pessoaJuridicaEndereco')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(errors.pessoaJuridicaNome || errors.pessoaJuridicaCnpj) && (
            <div className="col-span-3">
              <p className="text-red-600 text-sm">
                {errors.pessoaJuridicaNome?.message || errors.pessoaJuridicaCnpj?.message as string}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Email */}
      {template.startsWith('TROCA_EMAIL') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Novo E-mail *
          </label>
          <input 
            placeholder="exemplo@empresa.com" 
            {...register('email')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>
          )}
        </div>
      )}

      {/* Telefone */}
      {template.startsWith('TROCA_TEL') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Novo Telefone *
          </label>
          <input 
            placeholder="(11) 99999-9999" 
            {...register('telefone')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.telefone && (
            <p className="text-red-600 text-sm mt-1">{errors.telefone.message as string}</p>
          )}
        </div>
      )}

      {/* Data Início Contrato */}
      {(template === 'ADITIVO_CONTRATUAL' || template === 'ADITIVO_CONTRATUAL_DOIS_FIADORES') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data início do contrato *
          </label>
          <input 
            type="date" 
            {...register('dataInicioContrato')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.dataInicioContrato && (
            <p className="text-red-600 text-sm mt-1">{errors.dataInicioContrato.message as string}</p>
          )}
        </div>
      )}

      {/* Sócio (Dois Fiadores) */}
      {template === 'ADITIVO_CONTRATUAL_DOIS_FIADORES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Sócio *
            </label>
            <input 
              placeholder="Nome completo" 
              {...register('socio')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF do Sócio *
            </label>
            <input 
              placeholder="000.000.000-00" 
              {...register('socioCpf')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço do Sócio *
            </label>
            <input 
              placeholder="Endereço completo" 
              {...register('socioEndereco')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {(errors.socio || errors.socioCpf || errors.socioEndereco) && (
            <div className="col-span-3">
              <p className="text-red-600 text-sm">
                {(errors.socio?.message || errors.socioCpf?.message || errors.socioEndereco?.message) as string}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {mutation.isPending ? '⏳ Gerando...' : '🚀 Gerar Aditivo'}
        </button>

        {mutation.isSuccess && lastDownloadUrl && (
          <button
            type="button"
            onClick={handleManualDownload}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            📥 Baixar Novamente
          </button>
        )}
      </div>

      {/* Estados de Feedback */}
      {mutation.isSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 font-medium">✅ Aditivo gerado com sucesso!</p>
          <p className="text-green-700 text-sm mt-1">
            O download deve iniciar automaticamente. Se não funcionar, use o botão "Baixar Novamente".
          </p>
        </div>
      )}

      {mutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 font-medium">❌ Erro ao gerar aditivo</p>
          <p className="text-red-700 text-sm mt-1">
            Verifique os dados e tente novamente.
          </p>
        </div>
      )}
    </form>
  )
}