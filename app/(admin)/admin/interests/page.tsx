import { queryPaginated } from '@/lib/supabase/query'
import { createInterest, updateInterest, deleteInterest } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, EditableRow } from '../_components/admin-ui'
import { SearchBar, PaginationBar } from '../_components/search-wrapper'

export default async function InterestsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams
  const { data: interests, totalCount } = await queryPaginated({
    table: 'interests', select: '*', page: parseInt(page ?? '1'), search: q, searchColumns: ['name', 'slug'], orderBy: 'display_order',
  })

  return (
    <div>
      <PageHeader title="Interests"><SearchBar placeholder="Search interests..." /></PageHeader>
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
          {interests.map((i: any) => (
            <EditableRow key={i.id} id={i.id} editAction={updateInterest} deleteAction={deleteInterest}
              fields={[
                { name: 'name', value: i.name }, { name: 'slug', value: i.slug }, { name: 'icon', value: i.icon ?? '' },
                { name: 'display_order', value: i.display_order, type: 'number' },
                { name: 'is_active', value: String(i.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<><Td>{i.icon}</Td><Td>{i.name}</Td><Td>{i.slug}</Td><Td>{i.display_order}</Td><Td>{i.is_active ? 'Yes' : 'No'}</Td></>}
            />
          ))}
        </DataTable>
        <PaginationBar totalCount={totalCount} />
      </div>
    </div>
  )
}