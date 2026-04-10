import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const travelTypes = pgTable('travel_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const travelTypesRelations = relations(travelTypes, ({ many }) => ({
  places: many(places),
}))

export type TravelType = InferSelectModel<typeof travelTypes>
export type NewTravelType = InferInsertModel<typeof travelTypes>
