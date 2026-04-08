import { createAdminClient } from '@/lib/supabase/server'
import { PageHeader, StatCard } from './_components/admin-ui'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [regions, places, interests, cities, ratings, subscribers] = await Promise.all([
    supabase.from('regions').select('*', { count: 'exact', head: true }),
    supabase.from('places').select('*', { count: 'exact', head: true }),
    supabase.from('interests').select('*', { count: 'exact', head: true }),
    supabase.from('origin_cities').select('*', { count: 'exact', head: true }),
    supabase.from('ratings').select('*', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Regions" value={regions.count ?? 0} />
        <StatCard label="Places" value={places.count ?? 0} />
        <StatCard label="Interests" value={interests.count ?? 0} />
        <StatCard label="Origin Cities" value={cities.count ?? 0} />
        <StatCard label="Ratings" value={ratings.count ?? 0} />
        <StatCard label="Subscribers" value={subscribers.count ?? 0} />
      </div>
    </div>
  )
}
