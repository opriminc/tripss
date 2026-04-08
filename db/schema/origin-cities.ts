import { pgTable, uuid, varchar, decimal, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { regions } from './regions'

export const originCities = pgTable('origin_cities', {
  id: uuid('id').primaryKey().defaultRandom(),
  regionId: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  lat: decimal('lat', { precision: 10, scale: 7 }).notNull(),
  lng: decimal('lng', { precision: 10, scale: 7 }).notNull(),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('origin_cities_region_slug_idx').on(table.regionId, table.slug),
])

export const originCitiesRelations = relations(originCities, ({ one }) => ({
  region: one(regions, {
    fields: [originCities.regionId],
    references: [regions.id],
  }),
}))

export type OriginCity = InferSelectModel<typeof originCities>
export type NewOriginCity = InferInsertModel<typeof originCities>
