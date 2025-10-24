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

// Em src/types.ts
export interface AditivoResponseDTO {
  status: string;
  mensagem: string;
  aditivoId: string;
  caminhoDocumentoDocx: string | null;
  urlDownload: string; // Nome correto da propriedade
  // Mantenha downloadUrl como opcional para compatibilidade
  downloadUrl?: string;
}
