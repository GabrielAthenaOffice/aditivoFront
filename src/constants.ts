// src/constants.ts
import { TemplateKey } from './types'

export const ENDPOINTS: Record<TemplateKey, string> = {
  TROCA_EMAIL_PF: '/document/contato/email/pf',
  TROCA_EMAIL_PJ: '/document/contato/email/pj',
  TROCA_TEL_PF:   '/document/contato/telefone/pf',
  TROCA_TEL_PJ:   '/document/contato/telefone/pj',
  ADITIVO_CONTRATUAL: '/document/contratual',
  ADITIVO_CONTRATUAL_DOIS_FIADORES: '/document/contratual/dois-fiadores',
}

// ++ novos:
export const ADITIVOS_LIST = '/aditivos/empresa/todas-as-empresas'
export const ADITIVOS_SEARCH_BY_NOME = (nome: string) => `/aditivos/empresa/nome/${encodeURIComponent(nome)}`
export const ADITIVOS_DOWNLOAD = (id: string) => `/aditivos/${id}/download`
export const ADITIVOS_DELETE = (id: string) =>
  `/aditivos/empresa/deletar-aditivo/${id}`;

export const HIST_LIST = '/aditivos/historico'
export const HIST_SEARCH_BY_NOME = (nome: string) => `/aditivos/historico/empresa/nome/${nome}`

// + adicione
export const UNIDADES_LIST = '/unidades'
export const UNIDADE_BY_NOME = (nome: string) =>
  `/unidades/${encodeURIComponent(nome)}`