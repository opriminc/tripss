import { query } from '@/lib/supabase/query'
import { createPlaceContact, updatePlaceContact, deletePlaceContact } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, EditableRow } from '../_components/admin-ui'

const CONTACT_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'booking', label: 'Booking' },
  { value: 'other', label: 'Other' },
]

export default async function PlaceContactsPage() {
  const [contacts, places] = await Promise.all([
    query(db => db.from('place_contacts').select('*, places(name)').is('deleted_at', null).order('created_at', { ascending: false }).limit(200)),
    query(db => db.from('places').select('id, name').is('deleted_at', null).order('name')),
  ])
  const placeOptions = (places as any[]).map((p: any) => ({ value: p.id, label: p.name }))

  return (
    <div>
      <PageHeader title="Place Contacts" />
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Contact</h3>
        <ActionForm action={createPlaceContact} submitLabel="Add Contact">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Place">
              <Select name="place_id" required>
                <option value="">Select place</option>
                {(places as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Type">
              <Select name="type" required>
                {CONTACT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Value"><Input name="value" required placeholder="https://... or +1-xxx-xxx-xxxx" /></FormGroup>
            <FormGroup label="Label"><Input name="label" placeholder="Main website, Front desk, etc." /></FormGroup>
            <FormGroup label="Primary?">
              <Select name="is_primary"><option value="false">No</option><option value="true">Yes</option></Select>
            </FormGroup>
          </div>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Place', 'Type', 'Value', 'Label', 'Primary', 'Active', 'Actions']}>
          {(contacts as any[]).map((c: any) => (
            <EditableRow
              key={c.id}
              id={c.id}
              editAction={updatePlaceContact}
              deleteAction={deletePlaceContact}
              fields={[
                { name: 'place_id', value: c.place_id, options: placeOptions },
                { name: 'type', value: c.type, options: CONTACT_TYPES },
                { name: 'value', value: c.value },
                { name: 'label', value: c.label ?? '' },
                { name: 'is_primary', value: String(c.is_primary), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'is_active', value: String(c.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{c.places?.name}</Td>
                <Td>{c.type}</Td>
                <Td>{c.value?.length > 40 ? c.value.slice(0, 40) + '...' : c.value}</Td>
                <Td>{c.label ?? '—'}</Td>
                <Td>{c.is_primary ? 'Yes' : 'No'}</Td>
                <Td>{c.is_active ? 'Yes' : 'No'}</Td>
              </>}
            />
          ))}
          {(contacts as any[]).length === 0 && (
            <tr><Td>No contacts yet</Td><Td /><Td /><Td /><Td /><Td /><Td /></tr>
          )}
        </DataTable>
      </div>
    </div>
  )
}