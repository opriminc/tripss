import { createAdminClient } from '@/lib/supabase/server'
import { deleteRating } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, DeleteButton } from '../_components/admin-ui'

export default async function RatingsPage() {
  const supabase = createAdminClient()
  const { data: ratings } = await supabase
    .from('ratings')
    .select('*, places(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div>
      <PageHeader title="Ratings" />
      <DataTable headers={['Place', 'Score', 'Review', 'Date', 'Actions']}>
        {ratings?.map(r => (
          <tr key={r.id}>
            <Td>{(r.places as { name: string } | null)?.name}</Td>
            <Td>{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}</Td>
            <Td>{r.review_text ? (r.review_text.length > 80 ? r.review_text.slice(0, 80) + '...' : r.review_text) : '—'}</Td>
            <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
            <Td><DeleteButton action={deleteRating} id={r.id} confirmMessage="Soft-delete this rating?" /></Td>
          </tr>
        ))}
        {(!ratings || ratings.length === 0) && (
          <tr><Td>No ratings yet</Td><Td /><Td /><Td /><Td /></tr>
        )}
      </DataTable>
    </div>
  )
}
