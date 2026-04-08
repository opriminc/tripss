import { createAdminClient } from '@/lib/supabase/server'
import { createInterest, deleteInterest } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, DeleteButton } from '../_components/admin-ui'

export default async function InterestsPage() {
  const supabase = createAdminClient()
  const { data: interests } = await supabase.from('interests').select('*').order('display_order')

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
          {interests?.map(i => (
            <tr key={i.id}>
              <Td>{i.icon}</Td>
              <Td>{i.name}</Td>
              <Td>{i.slug}</Td>
              <Td>{i.display_order}</Td>
              <Td>{i.is_active ? 'Yes' : 'No'}</Td>
              <Td><DeleteButton action={deleteInterest} id={i.id} /></Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
