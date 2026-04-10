import { createAdminClient } from '@/lib/supabase/server'
import { createRegion, updateRegion, deleteRegion } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function RegionsPage() {
  const supabase = createAdminClient()
  const [{ data: regions }, { data: provinces }] = await Promise.all([
    supabase.from('regions').select('*, provinces(name)').is('deleted_at', null).order('display_order'),
    supabase.from('provinces').select('code, name').order('name'),
  ])
  const provinceOptions = provinces?.map(p => ({ value: p.code, label: `${p.name} (${p.code})` })) ?? []

  return (
    <div>
      <PageHeader title="Regions" />
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Region</h3>
        <ActionForm action={createRegion} submitLabel="Create Region">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Greater Toronto Area" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="gta" /></FormGroup>
            <FormGroup label="Province">
              <Select name="province_code" required>
                <option value="">Select province</option>
                {provinces?.map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Center Lat"><Input name="center_lat" type="number" step="any" required /></FormGroup>
            <FormGroup label="Center Lng"><Input name="center_lng" type="number" step="any" required /></FormGroup>
          </div>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Slug', 'Province', 'Active', 'Coordinates', 'Actions']}>
          {regions?.map(r => (
            <EditableRow
              key={r.id}
              id={r.id}
              editAction={updateRegion}
              deleteAction={deleteRegion}
              deleteMessage={`Delete region "${r.name}"? It will be soft-deleted.`}
              fields={[
                { name: 'name', value: r.name },
                { name: 'slug', value: r.slug },
                { name: 'province_code', value: r.province_code, options: provinceOptions },
                { name: 'center_lat', value: r.center_lat, type: 'number' },
                { name: 'center_lng', value: r.center_lng, type: 'number' },
                { name: 'is_active', value: String(r.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'display_order', value: r.display_order, type: 'number' },
              ]}
              renderView={<>
                <Td>{r.name}</Td>
                <Td>{r.slug}</Td>
                <Td>{(r.provinces as { name: string } | null)?.name} ({r.province_code})</Td>
                <Td>{r.is_active ? 'Yes' : 'No'}</Td>
                <Td>{r.center_lat}, {r.center_lng}</Td>
              </>}
            />
          ))}
        </DataTable>
      </div>
    </div>
  )
}