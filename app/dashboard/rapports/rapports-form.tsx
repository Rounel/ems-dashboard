'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { generatePdf, generateExcel, type GenerateState } from '@/app/actions/rapports'

function GenerateButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-black transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
      ) : (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <path d="M8 2v8M5 7l3 3 3-3M3 13h10" />
        </svg>
      )}
      {label}
    </button>
  )
}

function StatusBanner({ state }: { state: GenerateState }) {
  if (!state) return null
  return (
    <p className={`rounded-lg px-3 py-2 text-base ${state.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
      {state.message}
    </p>
  )
}

export default function RapportsForm() {
  const [pdfState, pdfAction] = useActionState<GenerateState, FormData>(generatePdf, null)
  const [xlsState, xlsAction] = useActionState<GenerateState, FormData>(generateExcel, null)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <form action={pdfAction}>
          <GenerateButton label="Générer rapport PDF ISO 50001" />
        </form>
        <form action={xlsAction}>
          <GenerateButton label="Exporter données Excel" />
        </form>
      </div>
      <StatusBanner state={pdfState} />
      <StatusBanner state={xlsState} />
    </div>
  )
}
