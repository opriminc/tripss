import { createAdminClient } from '@/lib/supabase/server'
import { deleteSubscriber } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, DeleteButton } from '../_components/admin-ui'

export default async function NewsletterPage() {
  const supabase = createAdminClient()
  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('*, regions(name)')
    .is('deleted_at', null)
    .order('subscribed_at', { ascending: false })

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" />
      <DataTable headers={['Email', 'Region', 'Verified', 'Subscribed', 'Actions']}>
        {subscribers?.map(s => (
          <tr key={s.id}>
            <Td>{s.email}</Td>
            <Td>{(s.regions as { name: string } | null)?.name ?? '—'}</Td>
            <Td>{s.is_verified ? 'Yes' : 'No'}</Td>
            <Td>{new Date(s.subscribed_at).toLocaleDateString()}</Td>
            <Td><DeleteButton action={deleteSubscriber} id={s.id} confirmMessage={`Soft-delete subscriber ${s.email}?`} /></Td>
          </tr>
        ))}
        {(!subscribers || subscribers.length === 0) && (
          <tr><Td>No subscribers yet</Td><Td /><Td /><Td /><Td /></tr>
        )}
      </DataTable>
    </div>
  )
}
