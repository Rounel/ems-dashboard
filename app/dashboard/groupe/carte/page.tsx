import { redirect } from 'next/navigation'

// La carte des sites est intégrée dans la page d'accueil
export default function CartePage() {
  redirect('/dashboard')
}
