import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt, type SessionPayload } from './session'

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) redirect('/login')

  const session = await decrypt(token)

  if (!session) redirect('/login')

  return session
})
