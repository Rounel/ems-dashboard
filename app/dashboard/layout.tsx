import { verifySession } from '@/app/lib/dal'
import { logout } from '@/app/actions/auth'
import Sidebar from './components/sidebar'
import { DateFilterControl, DateFilterProvider } from './components/date-filter'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifySession()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-black">
      <Sidebar />

      <DateFilterProvider>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
            <DateFilterControl />
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-base text-black">{session.email}</span>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="cursor-pointer text-base text-black transition-colors hover:text-black"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </DateFilterProvider>
    </div>
  )
}
