import { pgTable, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { placeInterests } from './place-interests'

export const interests = pgTable('interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 10 }),
  displayOrder: integer('display_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
})

export const interestsRelations = relations(interests, ({ many }) => ({
  placeInterests: many(placeInterests),
}))

export type Interest = InferSelectModel<typeof interests>
export type NewInterest = InferInsertModel<typeof interests>
