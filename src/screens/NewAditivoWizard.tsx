// src/screens/NewAditivoWizard.tsx
import DashboardLayout from '@/layouts/DashboardLayout'
import { useEffect, useMemo, useState } from 'react'
import { TemplateKey } from '@/types'
import AditivoForm from './components/AditivoForm'
import { Card, Button, Toggle } from '@/screens/components/ui'

type Mode = 'contratual' | 'contato'

export default function NewAditivoWizard() {
  const [mode, setMode] = useState<Mode>('contratual')
  const [pessoa, setPessoa] = useState<'pf' | 'pj' | null>(null)
  const [tipoContato, setTipoContato] = useState<'email' | 'telefone' | null>(null)
  const [contratual, setContratual] = useState<'simples' | 'fiadores' | null>(null)

  // limpa seleções irrelevantes ao trocar de modo
  useEffect(() => {
    if (mode === 'contratual') { setTipoContato(null); setPessoa(null) }
    if (mode === 'contato')    { setContratual(null) }
  }, [mode])

  const template: TemplateKey | null = useMemo(() => {
    if (mode === 'contratual') {
      if (!contratual) return null
      return contratual === 'fiadores'
        ? 'ADITIVO_CONTRATUAL_DOIS_FIADORES'
        : 'ADITIVO_CONTRATUAL'
    }
    if (mode === 'contato') {
      if (!pessoa || !tipoContato) return null
      if (tipoContato === 'email' && pessoa === 'pf') return 'TROCA_EMAIL_PF'
      if (tipoContato === 'email' && pessoa === 'pj') return 'TROCA_EMAIL_PJ'
      if (tipoContato === 'telefone' && pessoa === 'pf') return 'TROCA_TEL_PF'
      if (tipoContato === 'telefone' && pessoa === 'pj') return 'TROCA_TEL_PJ'
    }
    return null
  }, [mode, pessoa, tipoContato, contratual])

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Tabs simples de modo */}
        <div className="flex gap-2">
          <Toggle active={mode==='contratual'} onClick={()=>setMode('contratual')}>Contratual</Toggle>
          <Toggle active={mode==='contato'} onClick={()=>setMode('contato')}>Contato</Toggle>
        </div>

        {/* Barra de estado selecionado */}
        <div className="text-sm text-ink-500">
          {mode==='contratual' && (
            <>Modo: <span className="font-medium text-ink-700">Contratual</span>
              {contratual && <> · Seleção: <span className="badge">{contratual === 'fiadores' ? 'Dois fiadores' : 'Simples'}</span></>}
            </>
          )}
          {mode==='contato' && (
            <>Modo: <span className="font-medium text-ink-700">Contato</span>
              {pessoa && <> · Pessoa: <span className="badge">{pessoa.toUpperCase()}</span></>}
              {tipoContato && <> · Tipo: <span className="badge">{tipoContato === 'email' ? 'E-mail' : 'Telefone'}</span></>}
            </>
          )}
        </div>

        {/* Seções */}
        {mode==='contratual' && (
          <Card>
            <div className="title mb-2">Tipo de contratual</div>
            <div className="flex gap-2">
              <Toggle active={contratual==='simples'} onClick={()=>setContratual('simples')}>Simples</Toggle>
              <Toggle active={contratual==='fiadores'} onClick={()=>setContratual('fiadores')}>Dois fiadores</Toggle>
            </div>
          </Card>
        )}

        {mode==='contato' && (
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="title mb-2">Pessoa</div>
                <div className="flex gap-2">
                  <Toggle active={pessoa==='pf'} onClick={()=>setPessoa('pf')}>PF</Toggle>
                  <Toggle active={pessoa==='pj'} onClick={()=>setPessoa('pj')}>PJ</Toggle>
                </div>
              </div>
              <div>
                <div className="title mb-2">Tipo de contato</div>
                <div className="flex gap-2">
                  <Toggle active={tipoContato==='email'} onClick={()=>setTipoContato('email')}>E-mail</Toggle>
                  <Toggle active={tipoContato==='telefone'} onClick={()=>setTipoContato('telefone')}>Telefone</Toggle>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Form sempre abaixo; aparece quando tem template */}
        {template && (
          <Card>
            <h2 className="font-semibold mb-3">Dados do aditivo</h2>
            <AditivoForm template={template} />
          </Card>
        )}

        {!template && (
          <div className="text-sm text-ink-500">Selecione as opções acima para abrir o formulário.</div>
        )}
      </div>
    </DashboardLayout>
  )
}
