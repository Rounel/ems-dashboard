'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { encrypt, COOKIE_NAME, SESSION_DURATION_MS } from '@/app/lib/session'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// TODO: replace with a real DB lookup and bcrypt password comparison
const MOCK_USERS = [
  { id: '1', email: 'admin@ems.local', password: 'admin123', role: 'admin' },
]

export type LoginState = { error: string } | null

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Identifiants invalides.' }
  }

  const { email, password } = parsed.data
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { error: 'Email ou mot de passe incorrect.' }
  }

  const token = await encrypt({ userId: user.id, email: user.email, role: user.role })
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + SESSION_DURATION_MS),
    path: '/',
  })

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/login')
}
