// Em src/types.ts

export type TemplateKey =
  | 'TROCA_EMAIL_PF' | 'TROCA_EMAIL_PJ'
  | 'TROCA_TEL_PF'   | 'TROCA_TEL_PJ'
  | 'ADITIVO_CONTRATUAL' | 'ADITIVO_CONTRATUAL_DOIS_FIADORES'

export interface AditivoRequestDTO {
  empresaId?: string;
  unidadeNome?: string; unidadeCnpj?: string; unidadeEndereco?: string;
  pessoaFisicaNome?: string; pessoaFisicaCpf?: string; pessoaFisicaEndereco?: string;
  dataInicioContrato?: string;
  pessoaJuridicaNome?: string; pessoaJuridicaCnpj?: string; pessoaJuridicaEndereco?: string;
  localData?: string;
  templateNome?: string; email?: string; telefone?: string;
  socio?: string; socioCpf?: string; socioEndereco?: string;
}

export interface AditivoResponseDTO {
  status: string;
  mensagem: string;
  aditivoId: string;
  caminhoDocumentoDocx: string | null;
  urlDownload: string;
  downloadUrl?: string; // compatibilidade
}

// CORRETO: Estrutura que vem do backend Java
export interface AditivoSimple {
  empresaId: number
  nomeEmpresa: string
  status: string
  aditivoId: string
}

export interface AditivoPage {
  content: AditivoSimple[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}


// --- HISTÓRICO ---
export type HistoricoItem = {
  id: string
  empresaId: string
  empresaNome: string
  aditivoId: string
  status: string
  mensagem: string
}

export type HistoricoPage = {
  content: HistoricoItem[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}
