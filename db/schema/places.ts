import { pgTable, uuid, varchar, text, decimal, boolean, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { regions } from './regions'
import { travelTypes } from './travel-types'
import { placeImages } from './place-images'
import { placeInterests } from './place-interests'
import { placeBestMonths } from './place-best-months'
import { ratings } from './ratings'

export const places = pgTable('places', {
  id: uuid('id').primaryKey().defaultRandom(),
  regionId: uuid('region_id').notNull().references(() => regions.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: varchar('short_description', { length: 500 }),
  nearbyText: varchar('nearby_text', { length: 255 }),
  lat: decimal('lat', { precision: 10, scale: 7 }).notNull(),
  lng: decimal('lng', { precision: 10, scale: 7 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 50 }),
  postalCode: varchar('postal_code', { length: 10 }),
  travelTypeId: uuid('travel_type_id').references(() => travelTypes.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  avgRating: decimal('avg_rating', { precision: 2, scale: 1 }).notNull().default('0.0'),
  ratingCount: integer('rating_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: varchar('meta_description', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  uniqueIndex('places_region_slug_idx').on(table.regionId, table.slug),
  index('places_region_active_idx').on(table.regionId, table.isActive),
  index('places_region_rating_idx').on(table.regionId, table.avgRating),
  index('places_region_name_idx').on(table.regionId, table.name),
  index('places_travel_type_idx').on(table.travelTypeId),
])

export const placesRelations = relations(places, ({ one, many }) => ({
  region: one(regions, {
    fields: [places.regionId],
    references: [regions.id],
  }),
  travelType: one(travelTypes, {
    fields: [places.travelTypeId],
    references: [travelTypes.id],
  }),
  images: many(placeImages),
  placeInterests: many(placeInterests),
  bestMonths: many(placeBestMonths),
  ratings: many(ratings),
}))

export type Place = InferSelectModel<typeof places>
export type NewPlace = InferInsertModel<typeof places>
