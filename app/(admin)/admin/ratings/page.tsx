import { queryPaginated } from '@/lib/supabase/query'
import { deleteRating } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, DeleteButton } from '../_components/admin-ui'
import { SearchBar, PaginationBar } from '../_components/search-wrapper'

export default async function RatingsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams
  const { data: ratings, totalCount } = await queryPaginated({
    table: 'ratings', select: '*, places(name)', page: parseInt(page ?? '1'), search: q, searchColumns: ['review_text'], orderBy: 'created_at', ascending: false,
  })

  return (
    <div>
      <PageHeader title="Ratings"><SearchBar placeholder="Search reviews..." /></PageHeader>
      <DataTable headers={['Place', 'Score', 'Review', 'Date', 'Active', 'Actions']}>
        {ratings.map((r: any) => (
          <tr key={r.id}>
            <Td>{r.places?.name}</Td>
            <Td>{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)}</Td>
            <Td>{r.review_text ? (r.review_text.length > 80 ? r.review_text.slice(0, 80) + '...' : r.review_text) : '—'}</Td>
            <Td>{new Date(r.created_at).toLocaleDateString()}</Td>
            <Td>{r.is_active ? 'Yes' : 'No'}</Td>
            <Td><DeleteButton action={deleteRating} id={r.id} confirmMessage="Soft-delete this rating?" /></Td>
          </tr>
        ))}
        {ratings.length === 0 && (<tr><Td>No ratings found</Td><Td /><Td /><Td /><Td /><Td /></tr>)}
      </DataTable>
      <PaginationBar totalCount={totalCount} />
    </div>
  )
}