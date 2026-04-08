import { createAdminClient } from '@/lib/supabase/server'
import { createRegion, deleteRegion } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, DeleteButton } from '../_components/admin-ui'

export default async function RegionsPage() {
  const supabase = createAdminClient()
  const { data: regions } = await supabase.from('regions').select('*').order('display_order')

  return (
    <div>
      <PageHeader title="Regions" />

      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Region</h3>
        <ActionForm action={createRegion} submitLabel="Create Region">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Greater Toronto Area" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="gta" /></FormGroup>
            <FormGroup label="Province"><Input name="province" required placeholder="Ontario" /></FormGroup>
            <FormGroup label="Province Code"><Input name="province_code" required maxLength={2} placeholder="ON" /></FormGroup>
            <FormGroup label="Center Lat"><Input name="center_lat" type="number" step="any" required /></FormGroup>
            <FormGroup label="Center Lng"><Input name="center_lng" type="number" step="any" required /></FormGroup>
          </div>
        </ActionForm>
      </Card>

      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Slug', 'Province', 'Active', 'Coordinates', 'Actions']}>
          {regions?.map(r => (
            <tr key={r.id}>
              <Td>{r.name}</Td>
              <Td>{r.slug}</Td>
              <Td>{r.province} ({r.province_code})</Td>
              <Td>{r.is_active ? 'Yes' : 'No'}</Td>
              <Td>{r.center_lat}, {r.center_lng}</Td>
              <Td>
                <DeleteButton action={deleteRegion} id={r.id} confirmMessage={`Delete region "${r.name}"? This will fail if places exist in this region.`} />
              </Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
