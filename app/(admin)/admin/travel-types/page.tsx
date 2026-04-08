import { createAdminClient } from '@/lib/supabase/server'
import { createTravelType, updateTravelType, deleteTravelType } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function TravelTypesPage() {
  const supabase = createAdminClient()
  const { data: types } = await supabase.from('travel_types').select('*').is('deleted_at', null).order('display_order')

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
            <EditableRow
              key={t.id}
              id={t.id}
              editAction={updateTravelType}
              deleteAction={deleteTravelType}
              fields={[
                { name: 'name', value: t.name },
                { name: 'slug', value: t.slug },
                { name: 'display_order', value: t.display_order, type: 'number' },
              ]}
              renderView={<>
                <Td>{t.name}</Td>
                <Td>{t.slug}</Td>
                <Td>{t.display_order}</Td>
              </>}
            />
          ))}
        </DataTable>
      </div>
    </div>
  )
}
