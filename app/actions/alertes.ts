'use server'

import { revalidatePath } from 'next/cache'

export async function acknowledgeAlert(_id: string): Promise<{ ok: boolean }> {
  // TODO: update alert status in database
  revalidatePath('/dashboard/alertes')
  return { ok: true }
}
