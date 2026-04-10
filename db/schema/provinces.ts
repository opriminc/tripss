import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { regions } from './regions'

export const provinces = pgTable('provinces', {
  code: varchar('code', { length: 2 }).primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  country: varchar('country', { length: 50 }).notNull().default('Canada'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const provincesRelations = relations(provinces, ({ many }) => ({
  regions: many(regions),
}))

export type Province = InferSelectModel<typeof provinces>
export type NewProvince = InferInsertModel<typeof provinces>