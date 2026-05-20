'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, type LoginState } from '@/app/actions/auth'
import Image from 'next/image'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer mt-2 w-full rounded-2xl bg-[#171821] px-4 py-3 text-base font-semibold text-white shadow-[0_16px_35px_rgba(17,18,28,0.28)] transition hover:bg-[#0f1018] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Connexion...' : 'Se connecter'}
    </button>
  )
}

// admin@ems.local / admin123

export default function LoginPage() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, null)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#dff5ff] text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.82)_22%,rgba(223,245,255,0.38)_46%,rgba(164,221,242,0.42)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[46vh] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_54%,#ffffff_100%)]" />
      <div className="absolute left-1/2 top-[42%] h-[520px] w-[820px] -translate-x-1/2 rounded-[50%] border border-white/50" />
      <div className="absolute left-1/2 top-[48%] h-[430px] w-[670px] -translate-x-1/2 rounded-[50%] border border-white/45" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_28%_58%,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.72)_28%,rgba(255,255,255,0)_55%),radial-gradient(ellipse_at_68%_64%,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.68)_30%,rgba(255,255,255,0)_58%)]" />

      <div className="relative z-10 flex min-h-screen flex-col px-8 py-7">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image src={"/logo_ag.jpg"} alt='Atlantic Group' fill />
          </div>
          <span className="text-base md:text-lg lg:text-xl font-bold tracking-tight">Atlantic Group <br/>Supervisor</span>
        </div>

        <div className="flex flex-1 items-center justify-center pb-10">
          <section className="w-full max-w-[420px] rounded-[28px] border border-white/70 bg-white/52 px-8 py-9 shadow-[0_28px_80px_rgba(74,112,138,0.22)] backdrop-blur-2xl">
            {/* <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/75 bg-white/80 shadow-[0_14px_30px_rgba(41,61,86,0.16)]">
              <svg className="h-7 w-7 text-[#171821]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5M15 12H3" />
              </svg>
            </div> */}

            <div className="mt-7 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-black">Connexion</h1>
              <p className="mx-auto mt-2 max-w-[270px] text-base leading-relaxed text-black/70">
                Supervision des sites industriels et pilotage énergétique groupe.
              </p>
            </div>

            {state?.error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-700">
                {state.error}
              </div>
            )}

            <form action={formAction} className="mt-7 space-y-3">
              <label className="relative block">
                <span className="sr-only">Adresse e-mail</span>
                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-2xl border border-white/70 bg-white/72 pl-12 pr-4 text-base font-medium text-black outline-none shadow-sm transition placeholder:text-black/45 focus:border-[#171821]/35 focus:bg-white"
                  placeholder="Adresse e-mail"
                />
              </label>

              <label className="relative block">
                <span className="sr-only">Mot de passe</span>
                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 11h14v10H5z" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-2xl border border-white/70 bg-white/72 pl-12 pr-4 text-base font-medium text-black outline-none shadow-sm transition placeholder:text-black/45 focus:border-[#171821]/35 focus:bg-white"
                  placeholder="Mot de passe"
                />
              </label>

              <div className="flex justify-end">
                <button type="button" className="cursor-pointer text-base font-medium text-black/65 transition hover:text-black">
                  Mot de passe oublié ?
                </button>
              </div>

              <SubmitButton />
            </form>

            <div className="mt-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-base font-medium text-black/45">Accès réservé</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
