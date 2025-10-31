// src/screens/components/AditivoForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemas } from '@/schemas'
import { AditivoRequestDTO, AditivoResponseDTO, TemplateKey } from '@/types'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ENDPOINTS } from '@/constants'
import { useMemo, useState, useEffect } from 'react'
import { useListaUnidades, useUnidade } from '@/hooks/useUnidades'

/* =========================
   Utilitários de máscara
   ========================= */
const onlyDigits = (v: string = '') => v.replace(/\D+/g, '')

const formatCPF = (v: string = '') => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`
}

const formatCNPJ = (v: string = '') => {
  const d = onlyDigits(v).slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`
}

// Telefone BR (DDD + 8/9 dígitos)
const formatPhoneBR = (v: string = '') => {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`
}

/* =========================
   Helpers de URL/Download
   ========================= */
function buildDownloadUrl(url: string): string {
  const API_BASE = 'https://api-aditivo.onrender.com';
  if (!url) return '';

  try {
    const u = new URL(url); // absoluta?
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
      const api = new URL(API_BASE);
      u.protocol = api.protocol;
      u.host = api.host;
      return u.toString();
    }
    return url; // já é absoluta válida
  } catch {
    // relativa -> junta com a base
    const cleanBase = API_BASE.replace(/\/$/, '');
    const cleanPath = url.startsWith('/') ? url.slice(1) : url;
    return `${cleanBase}/${cleanPath}`;
  }
}



/* 👇 NOVO: baixa autenticado, sem nova aba */
async function secureDownload(url: string, filename = 'aditivo.docx') {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort('timeout'), 20000);
  try {
    const res = await fetch(url, { method: 'GET', credentials: 'include', signal: ac.signal });
    if (res.status === 401 || res.status === 403) {
      throw new Error('AUTH'); // força UI a pedir novo login
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dispo = res.headers.get('Content-Disposition') || '';
    const m = dispo.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
    const suggested = m ? decodeURIComponent(m[1].replace(/"/g, '')) : null;

    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = suggested || filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } finally {
    clearTimeout(timer);
  }
}


/* =========================
   Componente
   ========================= */
export default function AditivoForm({ template }: { template: TemplateKey }) {
  const schema = schemas[template] as any
  const [lastDownloadUrl, setLastDownloadUrl] = useState<string>('')

  const { register, handleSubmit, formState: { errors }, setValue, watch } =
    useForm<AditivoRequestDTO>({ resolver: zodResolver(schema) })

  const endpoint = useMemo(() => ENDPOINTS[template], [template])

  // unidades
  const { data: unidades = [], isLoading: unidadesLoading } = useListaUnidades()
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>('')
  const { data: unidadeInfo } = useUnidade(unidadeSelecionada)

  // quando muda unidade, atualiza campos
   useEffect(() => {
    if (unidadeSelecionada) {
      setValue('unidadeNome', unidadeSelecionada, { shouldValidate: true })
    } else {
      setValue('unidadeNome', '', { shouldValidate: true })
    }
  }, [unidadeSelecionada, setValue])

  // Quando chegar o DTO da unidade, popular CNPJ e Endereço
  useEffect(() => {
    if (unidadeInfo) {
      setValue('unidadeCnpj', formatCNPJ(unidadeInfo.unidadeCnpj || ''), { shouldValidate: true })
      setValue('unidadeEndereco', unidadeInfo.unidadeEndereco || '', { shouldValidate: true })
    }
  }, [unidadeInfo, setValue])


  const mutation = useMutation({
  mutationFn: async (payload: AditivoRequestDTO) => {
    const res = await api.post<AditivoResponseDTO>(endpoint, { 
      ...payload, 
      templateNome: template 
    });
    return res.data;
  },
    onSuccess: async (data) => {
      const downloadUrl = data.urlDownload || data.downloadUrl;
      if (!downloadUrl) return;
      const fullUrl = buildDownloadUrl(downloadUrl);
      console.log('download (corrigida):', fullUrl); // 👈 verifique que virou api-aditivo.onrender.com
      setLastDownloadUrl(fullUrl);
      try {
        secureDownload(fullUrl, `aditivo_${template}_${Date.now()}.docx`)
        .catch((e) => console.error('download falhou', e));
      } catch (e) {
        console.error('download falhou', e);
      }
    },
    onError: (error: any) => {
      console.error('erro:', error?.response?.data || error);
    }
  });

  const handleManualDownload = () => lastDownloadUrl && secureDownload(lastDownloadUrl);


  const onSubmit = (data: AditivoRequestDTO) => mutation.mutate(data)

  // campos mascarados
  const unidadeCnpj = watch('unidadeCnpj') || ''
  const pessoaFisicaCpf = watch('pessoaFisicaCpf') || ''
  const pessoaJuridicaCnpj = watch('pessoaJuridicaCnpj') || ''
  const socioCpf = watch('socioCpf') || ''
  const telefone = watch('telefone') || ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-6 rounded-lg bg-white shadow-sm">
      {/* Empresa ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa ID *</label>
        <input
          placeholder="Ex: 12345"
          {...register('empresaId')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          inputMode="numeric"
          pattern="\d*"
        />
        {errors.empresaId && <p className="text-red-600 text-sm mt-1">{errors.empresaId.message as string}</p>}
      </div>

      {/* Unidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={unidadeSelecionada}
            onChange={(e) => setUnidadeSelecionada(e.target.value)}
            disabled={unidadesLoading}
          >
            <option value="">{unidadesLoading ? 'Carregando…' : 'Selecione a unidade'}</option>
            {unidades.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input type="hidden" {...register('unidadeNome')} />
          {errors.unidadeNome && <p className="text-red-600 text-sm mt-1">{errors.unidadeNome.message as string}</p>}
        </div>

        {/* CNPJ unidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ Unidade *</label>
          <input
            placeholder="00.000.000/0000-00"
            value={formatCNPJ(unidadeCnpj)}
            onChange={(e) => setValue('unidadeCnpj', formatCNPJ(e.target.value), { shouldValidate: true })}
            onPaste={(e) => {
              e.preventDefault()
              const t = e.clipboardData.getData('text')
              setValue('unidadeCnpj', formatCNPJ(t), { shouldValidate: true })
            }}
            inputMode="numeric"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.unidadeCnpj && <p className="text-red-600 text-sm mt-1">{errors.unidadeCnpj.message as string}</p>}
        </div>

        {/* Endereço Unidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Unidade *</label>
          <input 
            placeholder="Endereço completo" 
            {...register('unidadeEndereco')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.unidadeEndereco && <p className="text-red-600 text-sm mt-1">{errors.unidadeEndereco.message as string}</p>}
        </div>
      </div>

      {/* Pessoa Física */}
      {(template.includes('PF') || template.startsWith('ADITIVO_CONTRATUAL')) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome PF *</label>
            <input 
              placeholder="Nome completo" 
              {...register('pessoaFisicaNome')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaFisicaNome && <p className="text-red-600 text-sm mt-1">{errors.pessoaFisicaNome.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
            <input
              placeholder="000.000.000-00"
              value={formatCPF(pessoaFisicaCpf)}
              onChange={(e) => setValue('pessoaFisicaCpf', formatCPF(e.target.value), { shouldValidate: true })}
              inputMode="numeric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaFisicaCpf && <p className="text-red-600 text-sm mt-1">{errors.pessoaFisicaCpf.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço PF *</label>
            <input 
              placeholder="Endereço completo" 
              {...register('pessoaFisicaEndereco')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaFisicaEndereco && <p className="text-red-600 text-sm mt-1">{errors.pessoaFisicaEndereco.message as string}</p>}
          </div>
        </div>
      )}

      {/* Pessoa Jurídica */}
      {(template.includes('PJ') || template.startsWith('ADITIVO_CONTRATUAL')) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome PJ *</label>
            <input 
              placeholder="Razão social" 
              {...register('pessoaJuridicaNome')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaJuridicaNome && <p className="text-red-600 text-sm mt-1">{errors.pessoaJuridicaNome.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ PJ *</label>
            <input
              placeholder="00.000.000/0000-00"
              value={formatCNPJ(pessoaJuridicaCnpj)}
              onChange={(e) => setValue('pessoaJuridicaCnpj', formatCNPJ(e.target.value), { shouldValidate: true })}
              inputMode="numeric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaJuridicaCnpj && <p className="text-red-600 text-sm mt-1">{errors.pessoaJuridicaCnpj.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço PJ *</label>
            <input 
              placeholder="Endereço completo" 
              {...register('pessoaJuridicaEndereco')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.pessoaJuridicaEndereco && <p className="text-red-600 text-sm mt-1">{errors.pessoaJuridicaEndereco.message as string}</p>}
          </div>
        </div>
      )}

      {/* Sócio (apenas para Dois Fiadores) */}
      {template === 'ADITIVO_CONTRATUAL_DOIS_FIADORES' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Sócio *
            </label>
            <input 
              placeholder="Nome completo" 
              {...register('socio')} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.socio && (
              <p className="text-red-600 text-sm mt-1">{errors.socio.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF do Sócio *
            </label>
            <input
              placeholder="000.000.000-00"
              value={formatCPF(socioCpf)}
              onChange={(e) => setValue('socioCpf', formatCPF(e.target.value), { shouldValidate: true })}
              inputMode="numeric"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.socioCpf && (
              <p className="text-red-600 text-sm mt-1">{errors.socioCpf.message as string}</p>
            )}
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
            {errors.socioEndereco && (
              <p className="text-red-600 text-sm mt-1">{errors.socioEndereco.message as string}</p>
            )}
          </div>
        </div>
      )}

      {/* Data Início Contrato (apenas para Contratuais) */}
      {(template === 'ADITIVO_CONTRATUAL' || template === 'ADITIVO_CONTRATUAL_DOIS_FIADORES') && (
        <div className="border-t pt-4">
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

      {/* Email */}
      {template.startsWith('TROCA_EMAIL') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Novo E-mail *</label>
          <input 
            placeholder="exemplo@empresa.com" 
            {...register('email')} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>}
        </div>
      )}

      {/* Telefone */}
      {template.startsWith('TROCA_TEL') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Novo Telefone *</label>
          <input 
            placeholder="(11) 99999-9999"
            value={formatPhoneBR(telefone)}
            onChange={(e) => setValue('telefone', formatPhoneBR(e.target.value), { shouldValidate: true })}
            inputMode="numeric"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.telefone && <p className="text-red-600 text-sm mt-1">{errors.telefone.message as string}</p>}
        </div>
      )}

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button type="submit" disabled={mutation.isPending}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {mutation.isPending ? '⏳ Gerando...' : '🚀 Gerar Aditivo'}
        </button>

        {mutation.isSuccess && lastDownloadUrl && (
          <button type="button" onClick={handleManualDownload}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
            📥 Baixar Novamente
          </button>
        )}
      </div>
    </form>
  )
}