// src/screens/NewAditivoWizard.tsx
import DashboardLayout from '@/layouts/DashboardLayout'
import { useEffect, useMemo, useState } from 'react'
import { TemplateKey } from '@/types'
import AditivoForm from './components/AditivoForm'
import { Card, Toggle } from '@/screens/components/ui'

type Mode = 'contratual' | 'contato'

export default function NewAditivoWizard() {
  const [mode, setMode] = useState<Mode>('contratual')
  const [pessoa, setPessoa] = useState<'pf' | 'pj' | null>(null)
  const [tipoContato, setTipoContato] = useState<'email' | 'telefone' | null>(null)
  const [contratual, setContratual] = useState<'simples' | 'fiadores' | null>(null)

  // DEBUG: Log para verificar as mudanças
  useEffect(() => {
    console.log('🔄 Estado atual:', { mode, pessoa, tipoContato, contratual })
  }, [mode, pessoa, tipoContato, contratual])

  // limpa seleções irrelevantes ao trocar de modo
  useEffect(() => {
    if (mode === 'contratual') { 
      setTipoContato(null); 
      setPessoa(null) 
    }
    if (mode === 'contato') { 
      setContratual(null) 
    }
  }, [mode])

  const template: TemplateKey | null = useMemo(() => {
    console.log('🎯 Calculando template...', { mode, contratual, pessoa, tipoContato })
    
    if (mode === 'contratual') {
      if (!contratual) return null
      
      const templateCalculado = contratual === 'fiadores'
        ? 'ADITIVO_CONTRATUAL_DOIS_FIADORES'
        : 'ADITIVO_CONTRATUAL'
      
      console.log('📄 Template Contratual:', templateCalculado)
      return templateCalculado
    }
    
    if (mode === 'contato') {
      if (!pessoa || !tipoContato) return null
      
      let templateCalculado: TemplateKey | null = null
      
      if (tipoContato === 'email' && pessoa === 'pf') templateCalculado = 'TROCA_EMAIL_PF'
      if (tipoContato === 'email' && pessoa === 'pj') templateCalculado = 'TROCA_EMAIL_PJ'
      if (tipoContato === 'telefone' && pessoa === 'pf') templateCalculado = 'TROCA_TEL_PF'
      if (tipoContato === 'telefone' && pessoa === 'pj') templateCalculado = 'TROCA_TEL_PJ'
      
      console.log('📄 Template Contato:', templateCalculado)
      return templateCalculado
    }
    
    return null
  }, [mode, pessoa, tipoContato, contratual])

  // Funções de clique melhoradas
  const handleModeChange = (newMode: Mode) => {
    console.log('🔄 Mudando modo para:', newMode)
    setMode(newMode)
  }

  const handleContratualChange = (tipo: 'simples' | 'fiadores') => {
    console.log('🔄 Mudando contratual para:', tipo)
    setContratual(tipo)
  }

  const handlePessoaChange = (tipo: 'pf' | 'pj') => {
    console.log('🔄 Mudando pessoa para:', tipo)
    setPessoa(tipo)
  }

  const handleTipoContatoChange = (tipo: 'email' | 'telefone') => {
    console.log('🔄 Mudando tipo contato para:', tipo)
    setTipoContato(tipo)
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Tabs simples de modo */}
        <div className="flex gap-2">
          <Toggle 
            active={mode==='contratual'} 
            onClick={() => handleModeChange('contratual')}
          >
            Contratual
          </Toggle>
          <Toggle 
            active={mode==='contato'} 
            onClick={() => handleModeChange('contato')}
          >
            Contato
          </Toggle>
        </div>

        {/* Barra de estado selecionado */}
        <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
          {mode==='contratual' && (
            <>
              Modo: <span className="font-medium text-gray-700">Contratual</span>
              {contratual && (
                <> · Seleção: <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {contratual === 'fiadores' ? 'Dois fiadores' : 'Simples'}
                </span></>
              )}
            </>
          )}
          {mode==='contato' && (
            <>
              Modo: <span className="font-medium text-gray-700">Contato</span>
              {pessoa && (
                <> · Pessoa: <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  {pessoa.toUpperCase()}
                </span></>
              )}
              {tipoContato && (
                <> · Tipo: <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                  {tipoContato === 'email' ? 'E-mail' : 'Telefone'}
                </span></>
              )}
            </>
          )}
          {template && (
            <> · <span className="font-bold text-blue-600">Template: {template}</span></>
          )}
        </div>

        {/* Seções */}
        {mode==='contratual' && (
          <Card>
            <div className="font-semibold mb-3">Tipo de contratual</div>
            <div className="flex gap-2">
              <Toggle 
                active={contratual==='simples'} 
                onClick={() => handleContratualChange('simples')}
              >
                Um fiador
              </Toggle>
              <Toggle 
                active={contratual==='fiadores'} 
                onClick={() => handleContratualChange('fiadores')}
              >
                Dois fiadores
              </Toggle>
            </div>
            {contratual && (
              <div className="mt-2 text-sm text-gray-600">
                {contratual === 'simples' 
                  ? 'Apenas uma pessoa física como fiador' 
                  : 'Duas pessoas físicas como fiadores (inclui campos de sócio)'}
              </div>
            )}
          </Card>
        )}

        {mode==='contato' && (
          <Card>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2">Pessoa</div>
                <div className="flex gap-2">
                  <Toggle 
                    active={pessoa==='pf'} 
                    onClick={() => handlePessoaChange('pf')}
                  >
                    PF
                  </Toggle>
                  <Toggle 
                    active={pessoa==='pj'} 
                    onClick={() => handlePessoaChange('pj')}
                  >
                    PJ
                  </Toggle>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-2">Tipo de contato</div>
                <div className="flex gap-2">
                  <Toggle 
                    active={tipoContato==='email'} 
                    onClick={() => handleTipoContatoChange('email')}
                  >
                    E-mail
                  </Toggle>
                  <Toggle 
                    active={tipoContato==='telefone'} 
                    onClick={() => handleTipoContatoChange('telefone')}
                  >
                    Telefone
                  </Toggle>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Form sempre abaixo; aparece quando tem template */}
        {template && (
          <Card>
            <h2 className="font-semibold mb-3 text-lg">Dados do aditivo - {template}</h2>
            <AditivoForm template={template} />
          </Card>
        )}

        {!template && (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">👆 Selecione as opções acima</div>
              <div className="text-sm">Escolha o tipo de aditivo para abrir o formulário</div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}