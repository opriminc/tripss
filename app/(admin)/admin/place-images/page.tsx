import { createAdminClient } from '@/lib/supabase/server'
import { createPlaceImage, deletePlaceImage } from '@/app/actions/admin'
import { PageHeader, DataTable, Td, FormGroup, Input, Select, Card, ActionForm, DeleteButton } from '../_components/admin-ui'

export default async function PlaceImagesPage() {
  const supabase = createAdminClient()
  const [{ data: images }, { data: places }] = await Promise.all([
    supabase.from('place_images').select('*, places(name)').order('created_at', { ascending: false }),
    supabase.from('places').select('id, name').order('name'),
  ])

  return (
    <div>
      <PageHeader title="Place Images" />

      <Card>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>Add Image</h3>
        <ActionForm action={createPlaceImage} submitLabel="Add Image">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormGroup label="Place">
              <Select name="place_id" required>
                <option value="">Select place</option>
                {places?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </FormGroup>
            <FormGroup label="Image URL"><Input name="url" required placeholder="https://..." /></FormGroup>
            <FormGroup label="Alt Text"><Input name="alt_text" placeholder="Description of image" /></FormGroup>
            <FormGroup label="Order"><Input name="display_order" type="number" defaultValue={0} /></FormGroup>
            <FormGroup label="Primary?">
              <Select name="is_primary"><option value="false">No</option><option value="true">Yes</option></Select>
            </FormGroup>
          </div>
        </ActionForm>
      </Card>

      <div style={{ marginTop: '24px' }}>
        <DataTable headers={['Preview', 'Place', 'Primary', 'Order', 'Actions']}>
          {images?.map(img => (
            <tr key={img.id}>
              <Td>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt_text ?? ''} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
              </Td>
              <Td>{(img.places as { name: string } | null)?.name}</Td>
              <Td>{img.is_primary ? 'Yes' : 'No'}</Td>
              <Td>{img.display_order}</Td>
              <Td><DeleteButton action={deletePlaceImage} id={img.id} /></Td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
