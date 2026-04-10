import { pgTable, uuid, varchar, decimal, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { provinces } from './provinces'
import { originCities } from './origin-cities'
import { places } from './places'
import { newsletterSubscribers } from './newsletter'

export const regions = pgTable('regions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  provinceCode: varchar('province_code', { length: 2 }).notNull().references(() => provinces.code, { onDelete: 'restrict', onUpdate: 'cascade' }),
  centerLat: decimal('center_lat', { precision: 10, scale: 7 }).$type<number>().notNull(),
  centerLng: decimal('center_lng', { precision: 10, scale: 7 }).$type<number>().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const regionsRelations = relations(regions, ({ one, many }) => ({
  province: one(provinces, {
    fields: [regions.provinceCode],
    references: [provinces.code],
  }),
  originCities: many(originCities),
  places: many(places),
  newsletterSubscribers: many(newsletterSubscribers),
}))

export type Region = InferSelectModel<typeof regions>
export type NewRegion = InferInsertModel<typeof regions>