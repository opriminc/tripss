import { query } from '@/lib/supabase/query'
import { createSubscriber, updateSubscriber, deleteSubscriber } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function NewsletterPage() {
  const [subscribers, regions] = await Promise.all([
    query(db => db.from('newsletter_subscribers').select('*, regions(name)').is('deleted_at', null).order('subscribed_at', { ascending: false })),
    query(db => db.from('regions').select('id, name').is('deleted_at', null).order('name')),
  ])
  const regionOptions = [{ value: '', label: 'None' }, ...(regions as any[]).map((r: any) => ({ value: r.id, label: r.name }))]

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" />
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Subscriber</h3>
        <ActionForm action={createSubscriber} submitLabel="Add Subscriber">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Email"><Input name="email" type="email" required placeholder="user@example.com" /></FormGroup>
            <FormGroup label="Region">
              <Select name="region_id">
                <option value="">None</option>
                {(regions as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Verified?">
              <Select name="is_verified"><option value="false">No</option><option value="true">Yes</option></Select>
            </FormGroup>
          </div>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Email', 'Region', 'Verified', 'Active', 'Subscribed', 'Actions']}>
          {(subscribers as any[]).map((s: any) => (
            <EditableRow
              key={s.id}
              id={s.id}
              editAction={updateSubscriber}
              deleteAction={deleteSubscriber}
              deleteMessage={`Soft-delete subscriber ${s.email}?`}
              fields={[
                { name: 'email', value: s.email },
                { name: 'region_id', value: s.region_id ?? '', options: regionOptions },
                { name: 'is_verified', value: String(s.is_verified), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'is_active', value: String(s.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{s.email}</Td>
                <Td>{s.regions?.name ?? '—'}</Td>
                <Td>{s.is_verified ? 'Yes' : 'No'}</Td>
                <Td>{s.is_active ? 'Yes' : 'No'}</Td>
                <Td>{new Date(s.subscribed_at).toLocaleDateString()}</Td>
              </>}
            />
          ))}
          {(subscribers as any[]).length === 0 && (
            <tr><Td>No subscribers yet</Td><Td /><Td /><Td /><Td /><Td /></tr>
          )}
        </DataTable>
      </div>
    </div>
  )
}