import { queryCount } from '@/lib/supabase/query'
import { PageHeader, StatCard } from './_components/admin-ui'

export default async function AdminDashboard() {
  const notDeleted = { column: 'deleted_at', value: null as null }

  const [regions, places, interests, cities, ratings, subscribers] = await Promise.all([
    queryCount('regions', notDeleted),
    queryCount('places', notDeleted),
    queryCount('interests', notDeleted),
    queryCount('origin_cities', notDeleted),
    queryCount('ratings', notDeleted),
    queryCount('newsletter_subscribers', notDeleted),
  ])

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <StatCard label="Regions" value={regions} />
        <StatCard label="Places" value={places} />
        <StatCard label="Interests" value={interests} />
        <StatCard label="Origin Cities" value={cities} />
        <StatCard label="Ratings" value={ratings} />
        <StatCard label="Subscribers" value={subscribers} />
      </div>
    </div>
  )
}