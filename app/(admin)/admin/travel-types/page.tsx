import { createAdminClient } from '@/lib/supabase/server'
import { createTravelType, deleteTravelType } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, DeleteButton } from '../_components/admin-ui'

export default async function TravelTypesPage() {
  const supabase = createAdminClient()
  const { data: types } = await supabase.from('travel_types').select('*').order('display_order')

  return (
    <div>
      <PageHeader title="Travel Types" />

      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Travel Type</h3>
        <ActionForm action={createTravelType} submitLabel="Create Travel Type">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Day Trip" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="day-trip" /></FormGroup>
            <FormGroup label="Order"><Input name="display_order" type="number" defaultValue={0} /></FormGroup>
          </div>
        </ActionForm>
      </Card>

      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Slug', 'Order', 'Actions']}>
          {types?.map(t => (
            <tr key={t.id}>
              <Td>{t.name}</Td>
              <Td>{t.slug}</Td>
              <Td>{t.display_order}</Td>
              <Td><DeleteButton action={deleteTravelType} id={t.id} /></Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
