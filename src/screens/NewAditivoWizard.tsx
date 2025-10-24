import DashboardLayout from '@/layouts/DashboardLayout'
import { useState } from 'react'
import { TemplateKey } from '@/types'
import AditivoForm from './components/AditivoForm'
import { Card, Button } from '@/screens/components/ui'

export default function NewAditivoWizard() {
  const [step, setStep] = useState<1|2|3>(1)
  const [tipoContato, setTipoContato] = useState<'email'|'telefone'|null>(null)
  const [pessoa, setPessoa] = useState<'pf'|'pj'|null>(null)
  const [contratual, setContratual] = useState<'simples'|'fiadores'|null>(null)

  const getTemplate = (): TemplateKey | null => {
    if (step===2 && contratual) return contratual === 'fiadores' ? 'ADITIVO_CONTRATUAL_DOIS_FIADORES' : 'ADITIVO_CONTRATUAL'
    if (step===3 && tipoContato && pessoa) {
      if (tipoContato==='email' && pessoa==='pf') return 'TROCA_EMAIL_PF'
      if (tipoContato==='email' && pessoa==='pj') return 'TROCA_EMAIL_PJ'
      if (tipoContato==='telefone' && pessoa==='pf') return 'TROCA_TEL_PF'
      if (tipoContato==='telefone' && pessoa==='pj') return 'TROCA_TEL_PJ'
    }
    return null
  }

  const Step = ({ n, label }: any) =>
    <div className={`px-3 py-2 rounded-lg border ${step===n ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white text-gray-600'}`}>{label}</div>

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Step n={1} label="Escolha do tipo" />
          <span>→</span>
          <Step n={2} label="Contratual" />
          <span>→</span>
          <Step n={3} label="Contato" />
        </div>

        <Card>
          {step===1 && (
            <div className="grid md:grid-cols-2 gap-3">
              <Button onClick={()=>setStep(2)}>Contratual</Button>
              <Button onClick={()=>setStep(3)} className="bg-gray-800 hover:bg-gray-900">Contato (E-mail/Telefone)</Button>
            </div>
          )}

          {step===2 && (
            <div className="flex gap-2">
              <Button onClick={()=>setContratual('simples')}>Simples</Button>
              <Button onClick={()=>setContratual('fiadores')}>Dois fiadores</Button>
            </div>
          )}

          {step===3 && (
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Tipo de contato</div>
                <div className="flex gap-2">
                  <Button onClick={()=>setTipoContato('email')}>E-mail</Button>
                  <Button onClick={()=>setTipoContato('telefone')}>Telefone</Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Pessoa</div>
                <div className="flex gap-2">
                  <Button onClick={()=>setPessoa('pf')}>PF</Button>
                  <Button onClick={()=>setPessoa('pj')}>PJ</Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {getTemplate() && (
          <Card>
            <h2 className="font-semibold mb-3">Dados do aditivo</h2>
            <AditivoForm template={getTemplate()!} />
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
