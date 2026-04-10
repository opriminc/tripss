import { queryPaginated } from '@/lib/supabase/query'
import { createPlaceType, updatePlaceType, deletePlaceType } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Card, ActionForm, EditableRow } from '../_components/admin-ui'
import { SearchBar, PaginationBar } from '../_components/search-wrapper'

export default async function PlaceTypesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams
  const { data: types, totalCount } = await queryPaginated({
    table: 'place_types', select: '*', page: parseInt(page ?? '1'), search: q, searchColumns: ['name', 'slug'], orderBy: 'display_order',
  })

  return (
    <div>
      <PageHeader title="Place Types"><SearchBar placeholder="Search place types..." /></PageHeader>
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Place Type</h3>
        <ActionForm action={createPlaceType} submitLabel="Create Place Type">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Museums" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="museums" /></FormGroup>
            <FormGroup label="Icon"><Input name="icon" placeholder="🖼️" maxLength={10} /></FormGroup>
            <FormGroup label="Order"><Input name="display_order" type="number" defaultValue={0} /></FormGroup>
          </div>
          <FormGroup label="Description"><Input name="description" placeholder="Short description of this place type" /></FormGroup>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Icon', 'Name', 'Slug', 'Description', 'Order', 'Active', 'Actions']}>
          {types.map((t: any) => (
            <EditableRow key={t.id} id={t.id} editAction={updatePlaceType} deleteAction={deletePlaceType}
              deleteMessage={`Soft-delete place type "${t.name}"? Places using it will keep their type until reassigned.`}
              fields={[
                { name: 'name', value: t.name }, { name: 'slug', value: t.slug },
                { name: 'icon', value: t.icon ?? '' }, { name: 'description', value: t.description ?? '' },
                { name: 'display_order', value: t.display_order, type: 'number' },
                { name: 'is_active', value: String(t.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
              ]}
              renderView={<>
                <Td>{t.icon}</Td><Td>{t.name}</Td><Td>{t.slug}</Td>
                <Td>{t.description ? (t.description.length > 40 ? t.description.slice(0, 40) + '...' : t.description) : '—'}</Td>
                <Td>{t.display_order}</Td><Td>{t.is_active ? 'Yes' : 'No'}</Td>
              </>}
            />
          ))}
        </DataTable>
        <PaginationBar totalCount={totalCount} />
      </div>
    </div>
  )
}
