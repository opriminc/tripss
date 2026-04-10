import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const placeTypes = pgTable('place_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 10 }),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const placeTypesRelations = relations(placeTypes, ({ many }) => ({
  places: many(places),
}))

export type PlaceType = InferSelectModel<typeof placeTypes>
export type NewPlaceType = InferInsertModel<typeof placeTypes>