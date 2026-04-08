import { pgTable, uuid, primaryKey, index } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { places } from './places'
import { interests } from './interests'

export const placeInterests = pgTable('place_interests', {
  placeId: uuid('place_id').notNull().references(() => places.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  interestId: uuid('interest_id').notNull().references(() => interests.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.placeId, table.interestId] }),
  index('place_interests_interest_idx').on(table.interestId, table.placeId),
])

export const placeInterestsRelations = relations(placeInterests, ({ one }) => ({
  place: one(places, {
    fields: [placeInterests.placeId],
    references: [places.id],
  }),
  interest: one(interests, {
    fields: [placeInterests.interestId],
    references: [interests.id],
  }),
}))

export type PlaceInterest = InferSelectModel<typeof placeInterests>
export type NewPlaceInterest = InferInsertModel<typeof placeInterests>
