'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, type LoginState } from '@/app/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 text-base"
    >
      {pending ? 'Connexion…' : 'Se connecter'}
    </button>
  )
}

// admin@ems.local / admin123

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-base font-bold text-black tracking-tight">Atlantic Group Supervisor</h1>
          <p className="text-black text-base mt-1">Supervision des sites industriels</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          <h2 className="text-base font-semibold text-black mb-5">Connexion</h2>

          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-base px-4 py-3 rounded-lg mb-5">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-base font-medium text-black mb-1.5">
                Adresse e-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 rounded-lg px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="admin@ems.local"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-base font-medium text-black mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full bg-white border border-gray-300 text-black placeholder-gray-400 rounded-lg px-3.5 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-1">
              <SubmitButton />
            </div>
          </form>
        </div>

        <p className="text-center text-black text-base mt-6">
          Accès réservé au personnel autorisé
        </p>
      </div>
    </div>
  )
}
