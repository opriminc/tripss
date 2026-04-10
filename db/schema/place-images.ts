import { pgTable, uuid, text, varchar, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const placeImages = pgTable('place_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  url: text('url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  displayOrder: integer('display_order').notNull().default(0),
  isPrimary: boolean('is_primary').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('place_images_place_order_idx').on(table.placeId, table.displayOrder),
])

export const placeImagesRelations = relations(placeImages, ({ one }) => ({
  place: one(places, {
    fields: [placeImages.placeId],
    references: [places.id],
  }),
}))

export type PlaceImage = InferSelectModel<typeof placeImages>
export type NewPlaceImage = InferInsertModel<typeof placeImages>
