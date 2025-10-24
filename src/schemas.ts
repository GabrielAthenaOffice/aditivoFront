import { z } from 'zod'

const empresa = z.object({
  empresaId: z.string().regex(/^\d+$/, 'ID numérico obrigatório'),
})

const base = z.object({
  unidadeNome: z.string().min(1, 'Informe a unidade'),
  unidadeCnpj: z.string().min(1, 'Informe o CNPJ da unidade'),
  unidadeEndereco: z.string().min(1, 'Informe o endereço da unidade'),
  localData: z.string().optional(),
})

const pf = z.object({
  pessoaFisicaNome: z.string().min(1, 'PF nome obrigatório'),
  pessoaFisicaCpf: z.string().min(1, 'PF CPF obrigatório'),
  pessoaFisicaEndereco: z.string().optional(),
})

const pj = z.object({
  pessoaJuridicaNome: z.string().min(1, 'PJ nome obrigatório'),
  pessoaJuridicaCnpj: z.string().min(1, 'PJ CNPJ obrigatório'),
  pessoaJuridicaEndereco: z.string().optional(),
})

export const schemas = {
  TROCA_EMAIL_PF: empresa.merge(base).merge(pf).merge(z.object({ email: z.string().email('Email inválido') })),
  TROCA_EMAIL_PJ: empresa.merge(base).merge(pj).merge(z.object({ email: z.string().email('Email inválido') })),
  TROCA_TEL_PF:   empresa.merge(base).merge(pf).merge(z.object({ telefone: z.string().min(8, 'Telefone inválido') })),
  TROCA_TEL_PJ:   empresa.merge(base).merge(pj).merge(z.object({ telefone: z.string().min(8, 'Telefone inválido') })),
  ADITIVO_CONTRATUAL: empresa.merge(base).merge(pf).merge(pj).merge(z.object({
    dataInicioContrato: z.string().min(1, 'Data início obrigatória'),
  })),
  ADITIVO_CONTRATUAL_DOIS_FIADORES: empresa.merge(base).merge(pf).merge(pj).merge(z.object({
    dataInicioContrato: z.string().min(1, 'Data início obrigatória'),
    socio: z.string().min(1, 'Sócio obrigatório'),
    socioCpf: z.string().min(1, 'Sócio CPF obrigatório'),
    socioEndereco: z.string().min(1, 'Sócio endereço obrigatório'),
  })),
} as const
