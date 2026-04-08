import { pgTable, uuid, smallint, primaryKey, index, check } from 'drizzle-orm/pg-core'
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const placeBestMonths = pgTable('place_best_months', {
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  month: smallint('month').notNull(),
}, (table) => [
  primaryKey({ columns: [table.placeId, table.month] }),
  index('place_best_months_month_idx').on(table.month, table.placeId),
  check('month_range_check', sql`${table.month} >= 1 AND ${table.month} <= 12`),
])

export const placeBestMonthsRelations = relations(placeBestMonths, ({ one }) => ({
  place: one(places, {
    fields: [placeBestMonths.placeId],
    references: [places.id],
  }),
}))

export type PlaceBestMonth = InferSelectModel<typeof placeBestMonths>
export type NewPlaceBestMonth = InferInsertModel<typeof placeBestMonths>
