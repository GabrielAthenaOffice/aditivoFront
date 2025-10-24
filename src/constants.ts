import { TemplateKey } from './types'

export const ENDPOINTS: Record<TemplateKey, string> = {
  TROCA_EMAIL_PF: '/document/contato/email/pf',
  TROCA_EMAIL_PJ: '/document/contato/email/pj',
  TROCA_TEL_PF:   '/document/contato/telefone/pf',
  TROCA_TEL_PJ:   '/document/contato/telefone/pj',
  ADITIVO_CONTRATUAL: '/document/contratual',
  ADITIVO_CONTRATUAL_DOIS_FIADORES: '/document/contratual/dois-fiadores',
}
