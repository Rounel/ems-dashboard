import { notFound } from 'next/navigation'
import { SITES } from '@/app/lib/site-data'
import SiteView from './site-view'

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const site = SITES.find((s) => s.slug === slug)
  if (!site) notFound()
  return <SiteView site={site} />
}

export function generateStaticParams() {
  return SITES.map((s) => ({ slug: s.slug }))
}
