import { pgTable, uuid, smallint, text, varchar, timestamp, index, uniqueIndex, check } from 'drizzle-orm/pg-core'
import { relations, sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'

export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  userId: uuid('user_id'),
  score: smallint('score').notNull(),
  reviewText: text('review_text'),
  ipHash: varchar('ip_hash', { length: 64 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => [
  index('ratings_place_idx').on(table.placeId),
  uniqueIndex('ratings_user_place_idx').on(table.userId, table.placeId),
  check('score_range_check', sql`${table.score} >= 1 AND ${table.score} <= 5`),
])

export const ratingsRelations = relations(ratings, ({ one }) => ({
  place: one(places, {
    fields: [ratings.placeId],
    references: [places.id],
  }),
}))

export type Rating = InferSelectModel<typeof ratings>
export type NewRating = InferInsertModel<typeof ratings>
