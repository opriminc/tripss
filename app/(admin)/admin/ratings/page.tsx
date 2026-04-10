import { query } from '@/lib/supabase/query'
import { deleteRating } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, DeleteButton } from '../_components/admin-ui'

export default async function RatingsPage() {
  const ratings = await query(db =>
    db.from('ratings').select('*, places(name)').is('deleted_at', null).order('created_at', { ascending: false })
  )

  return (
    <div>
      <PageHeader title="Ratings" />
      <DataTable headers={['Place', 'Score', 'Review', 'Date', 'Active', 'Actions']}>
        {(ratings as any[]).map((r: any) => (
          <tr key={r.id}>
            <Td>{r.places?.name}</Td>
            <Td>{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}</Td>
            <Td>{r.review_text ? (r.review_text.length > 80 ? r.review_text.slice(0, 80) + '...' : r.review_text) : '—'}</Td>
            <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
            <Td>{r.is_active ? 'Yes' : 'No'}</Td>
            <Td><DeleteButton action={deleteRating} id={r.id} confirmMessage="Soft-delete this rating?" /></Td>
          </tr>
        ))}
        {(ratings as any[]).length === 0 && (
          <tr><Td>No ratings yet</Td><Td /><Td /><Td /><Td /><Td /></tr>
        )}
      </DataTable>
    </div>
  )
}