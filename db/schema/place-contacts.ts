import { pgTable, uuid, varchar, text, boolean, timestamp, index, check } from 'drizzle-orm/pg-core'
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const placeContacts = pgTable('place_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(),
  value: text('value').notNull(),
  label: varchar('label', { length: 100 }),
  isPrimary: boolean('is_primary').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('place_contacts_place_idx').on(table.placeId, table.type),
  check('type_check', sql`${table.type} IN ('website', 'phone', 'email', 'facebook', 'instagram', 'twitter', 'booking', 'other')`),
])

export const placeContactsRelations = relations(placeContacts, ({ one }) => ({
  place: one(places, {
    fields: [placeContacts.placeId],
    references: [places.id],
  }),
}))

export type PlaceContact = InferSelectModel<typeof placeContacts>
export type NewPlaceContact = InferInsertModel<typeof placeContacts>