import { query } from '@/lib/supabase/query'
import { createOriginCity, updateOriginCity, deleteOriginCity } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function OriginCitiesPage() {
  const [cities, regions] = await Promise.all([
    query(db => db.from('origin_cities').select('*, regions(name)').is('deleted_at', null).order('name')),
    query(db => db.from('regions').select('id, name').is('deleted_at', null).order('name')),
  ])
  const regionOptions = (regions as any[]).map((r: any) => ({ value: r.id, label: r.name }))

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
                {(regions as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
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
        <DataTable headers={['Name', 'Slug', 'Region', 'Lat/Lng', 'Default', 'Active', 'Actions']}>
          {(cities as any[]).map((c: any) => (
            <EditableRow
              key={c.id}
              id={c.id}
              editAction={updateOriginCity}
              deleteAction={deleteOriginCity}
              fields={[
                { name: 'region_id', value: c.region_id, options: regionOptions },
                { name: 'name', value: c.name },
                { name: 'slug', value: c.slug },
                { name: 'lat', value: c.lat, type: 'number' },
                { name: 'lng', value: c.lng, type: 'number' },
                { name: 'is_default', value: String(c.is_default), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'is_active', value: String(c.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{c.name}</Td>
                <Td>{c.slug}</Td>
                <Td>{c.regions?.name}</Td>
                <Td>{c.lat}, {c.lng}</Td>
                <Td>{c.is_default ? 'Yes' : 'No'}</Td>
                <Td>{c.is_active ? 'Yes' : 'No'}</Td>
              </>}
            />
          ))}
        </DataTable>
      </div>
    </div>
  )
}