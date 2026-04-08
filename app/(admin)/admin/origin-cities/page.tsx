import { createAdminClient } from '@/lib/supabase/server'
import { createOriginCity, deleteOriginCity } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, DeleteButton } from '../_components/admin-ui'

export default async function OriginCitiesPage() {
  const supabase = createAdminClient()
  const [{ data: cities }, { data: regions }] = await Promise.all([
    supabase.from('origin_cities').select('*, regions(name)').order('name'),
    supabase.from('regions').select('id, name').order('name'),
  ])

  return (
    <div>
      <PageHeader title="Origin Cities" />

      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Origin City</h3>
        <ActionForm action={createOriginCity} submitLabel="Create City">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Region">
              <Select name="region_id" required>
                <option value="">Select region</option>
                {regions?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Name"><Input name="name" required placeholder="Toronto" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="toronto" /></FormGroup>
            <FormGroup label="Latitude"><Input name="lat" type="number" step="any" required /></FormGroup>
            <FormGroup label="Longitude"><Input name="lng" type="number" step="any" required /></FormGroup>
            <FormGroup label="Default?">
              <Select name="is_default"><option value="false">No</option><option value="true">Yes</option></Select>
            </FormGroup>
          </div>
        </ActionForm>
      </Card>

      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Slug', 'Region', 'Lat/Lng', 'Default', 'Actions']}>
          {cities?.map(c => (
            <tr key={c.id}>
              <Td>{c.name}</Td>
              <Td>{c.slug}</Td>
              <Td>{(c.regions as { name: string } | null)?.name}</Td>
              <Td>{c.lat}, {c.lng}</Td>
              <Td>{c.is_default ? 'Yes' : 'No'}</Td>
              <Td><DeleteButton action={deleteOriginCity} id={c.id} /></Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
