import { query, queryPaginated } from '@/lib/supabase/query'
import { createRegion, updateRegion, deleteRegion } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, EditableRow } from '../_components/admin-ui'
import { SearchBar, PaginationBar } from '../_components/search-wrapper'

export default async function RegionsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page } = await searchParams
  const [{ data: regions, totalCount }, provinces] = await Promise.all([
    queryPaginated({ table: 'regions', select: '*, provinces(name)', page: parseInt(page ?? '1'), search: q, searchColumns: ['name', 'slug'], orderBy: 'display_order' }),
    query(db => db.from('provinces').select('code, name').order('name')),
  ])
  const provinceOptions = (provinces as any[]).map(p => ({ value: p.code, label: `${p.name} (${p.code})` }))

  return (
    <div>
      <PageHeader title="Regions">
        <SearchBar placeholder="Search regions..." />
      </PageHeader>
      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Region</h3>
        <ActionForm action={createRegion} submitLabel="Create Region">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Name"><Input name="name" required placeholder="Greater Toronto Area" /></FormGroup>
            <FormGroup label="Slug"><Input name="slug" required placeholder="gta" /></FormGroup>
            <FormGroup label="Province">
              <Select name="province_code" required>
                <option value="">Select province</option>
                {(provinces as any[]).map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Center Lat"><Input name="center_lat" type="number" step="any" required /></FormGroup>
            <FormGroup label="Center Lng"><Input name="center_lng" type="number" step="any" required /></FormGroup>
          </div>
        </ActionForm>
      </Card>
      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Name', 'Slug', 'Province', 'Active', 'Coordinates', 'Actions']}>
          {regions.map((r: any) => (
            <EditableRow key={r.id} id={r.id} editAction={updateRegion} deleteAction={deleteRegion}
              deleteMessage={`Delete region "${r.name}"? It will be soft-deleted.`}
              fields={[
                { name: 'name', value: r.name }, { name: 'slug', value: r.slug },
                { name: 'province_code', value: r.province_code, options: provinceOptions },
                { name: 'center_lat', value: r.center_lat, type: 'number' }, { name: 'center_lng', value: r.center_lng, type: 'number' },
                { name: 'is_active', value: String(r.is_active), options: [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }] },
                { name: 'display_order', value: r.display_order, type: 'number' },
              ]}
              renderView={<><Td>{r.name}</Td><Td>{r.slug}</Td><Td>{r.provinces?.name} ({r.province_code})</Td><Td>{r.is_active ? 'Yes' : 'No'}</Td><Td>{r.center_lat}, {r.center_lng}</Td></>}
            />
          ))}
        </DataTable>
        <PaginationBar totalCount={totalCount} />
      </div>
    </div>
  )
}