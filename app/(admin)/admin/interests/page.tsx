import { query } from '@/lib/supabase/query'
import { createInterest, updateInterest, deleteInterest } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, EditableRow } from '../_components/admin-ui'

export default async function InterestsPage() {
  const interests = await query(db => db.from('interests').select('*').is('deleted_at', null).order('display_order'))

  return (
    <div>
      <PageHeader title="Interests" />
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Interest</h3>
        <ActionForm action={createInterest} submitLabel="Create Interest">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Beaches" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="beaches" /></FormGroup>
            <FormGroup label="Icon"><Input name="icon" placeholder="🏖️" maxLength={10} /></FormGroup>
            <FormGroup label="Order"><Input name="display_order" type="number" defaultValue={0} /></FormGroup>
          </div>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Icon', 'Name', 'Slug', 'Order', 'Active', 'Actions']}>
          {(interests as any[]).map((i: any) => (
            <EditableRow
              key={i.id}
              id={i.id}
              editAction={updateInterest}
              deleteAction={deleteInterest}
              fields={[
                { name: 'name', value: i.name },
                { name: 'slug', value: i.slug },
                { name: 'icon', value: i.icon ?? '' },
                { name: 'display_order', value: i.display_order, type: 'number' },
                { name: 'is_active', value: String(i.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{i.icon}</Td>
                <Td>{i.name}</Td>
                <Td>{i.slug}</Td>
                <Td>{i.display_order}</Td>
                <Td>{i.is_active ? 'Yes' : 'No'}</Td>
              </>}
            />
          ))}
        </DataTable>
      </div>
    </div>
  )
}