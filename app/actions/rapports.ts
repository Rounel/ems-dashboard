'use server'

export type GenerateState = { message: string; ok: boolean } | null

export async function generatePdf(_prev: GenerateState, _formData: FormData): Promise<GenerateState> {
  // TODO: call report generator service
  return { ok: true, message: 'Rapport PDF ISO 50001 généré avec succès.' }
}

export async function generateExcel(_prev: GenerateState, _formData: FormData): Promise<GenerateState> {
  // TODO: call export service
  return { ok: true, message: 'Export Excel généré avec succès.' }
}
