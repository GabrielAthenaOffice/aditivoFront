// ========================================
// src/screens/components/ui.tsx (CORRIGIDO)
// ========================================
import { ReactNode, ButtonHTMLAttributes } from 'react'

export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) =>
  <div className={`bg-white rounded-2xl shadow-sm border p-4 ${className}`}>{children}</div>

export const Button = ({ children, className = '', ...props }: any) =>
  <button {...props} className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`} >
    {children}
  </button>

export const Input = (props: any) =>
  <input {...props} className={`border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||''}`} />

export function Toggle({
  active, className = '', children, ...props
}: { active?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      aria-pressed={active}
      className={`px-4 py-2 rounded-xl border transition
        ${active
          ? 'bg-brand-600 text-white border-brand-600 shadow'
          : 'bg-white text-ink-600 border-panel-200 hover:bg-panel-100'}
        ${className}`}
    >
      {children}
    </button>
  )
}