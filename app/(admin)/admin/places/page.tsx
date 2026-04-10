import { createAdminClient } from '@/lib/supabase/server'
import { createPlace, updatePlace, deletePlace } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, TextArea, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function PlacesPage() {
  const supabase = createAdminClient()
  const [{ data: places }, { data: regions }, { data: travelTypes }] = await Promise.all([
    supabase.from('places').select('*, regions(name), travel_types(name)').is('deleted_at', null).order('name'),
    supabase.from('regions').select('id, name').is('deleted_at', null).order('name'),
    supabase.from('travel_types').select('id, name').is('deleted_at', null).order('display_order'),
  ])
  const regionOptions = regions?.map(r => ({ value: r.id, label: r.name })) ?? []
  const ttOptions = [{ value: '', label: 'None' }, ...(travelTypes?.map(t => ({ value: t.id, label: t.name })) ?? [])]

  return (
    <div>
      <PageHeader title="Places" />
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Place</h3>
        <ActionForm action={createPlace} submitLabel="Create Place">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Region">
              <Select name="region_id" required>
                <option value="">Select region</option>
                {regions?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Name"><Input name="name" required placeholder="Niagara Falls" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="niagara-falls" /></FormGroup>
            <FormGroup label="Short Description"><Input name="short_description" placeholder="Brief description" /></FormGroup>
            <FormGroup label="Nearby Text"><Input name="nearby_text" placeholder="Near Niagara-on-the-Lake" /></FormGroup>
            <FormGroup label="Travel Type">
              <Select name="travel_type_id">
                <option value="">None</option>
                {travelTypes?.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Latitude"><Input name="lat" type="number" step="any" required /></FormGroup>
            <FormGroup label="Longitude"><Input name="lng" type="number" step="any" required /></FormGroup>
            <FormGroup label="City"><Input name="city" placeholder="Niagara Falls" /></FormGroup>
            <FormGroup label="Address"><Input name="address" placeholder="Full address" /></FormGroup>
            <FormGroup label="Featured?">
              <Select name="is_featured"><option value="false">No</option><option value="true">Yes</option></Select>
            </FormGroup>
          </div>
          <FormGroup label="Full Description">
            <TextArea name="description" rows={3} placeholder="Detailed description..." />
          </FormGroup>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Region', 'Type', 'Rating', 'Active', 'Featured', 'Actions']}>
          {places?.map(p => (
            <EditableRow
              key={p.id}
              id={p.id}
              editAction={updatePlace}
              deleteAction={deletePlace}
              deleteMessage={`Soft-delete "${p.name}"? It will be hidden but recoverable.`}
              fields={[
                { name: 'region_id', value: p.region_id, options: regionOptions },
                { name: 'name', value: p.name },
                { name: 'slug', value: p.slug },
                { name: 'short_description', value: p.short_description ?? '' },
                { name: 'nearby_text', value: p.nearby_text ?? '' },
                { name: 'lat', value: p.lat, type: 'number' },
                { name: 'lng', value: p.lng, type: 'number' },
                { name: 'city', value: p.city ?? '' },
                { name: 'address', value: p.address ?? '' },
                { name: 'travel_type_id', value: p.travel_type_id ?? '', options: ttOptions },
                { name: 'is_featured', value: String(p.is_featured), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'is_active', value: String(p.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{p.name}</Td>
                <Td>{(p.regions as { name: string } | null)?.name}</Td>
                <Td>{(p.travel_types as { name: string } | null)?.name ?? '—'}</Td>
                <Td>{p.avg_rating} ({p.rating_count})</Td>
                <Td>{p.is_active ? 'Yes' : 'No'}</Td>
                <Td>{p.is_featured ? 'Yes' : 'No'}</Td>
              </>}
            />
          ))}
        </DataTable>
      </div>
    </div>
  )
}
