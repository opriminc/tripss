import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { regions } from './regions'

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  regionId: uuid('region_id').references(() => regions.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  isVerified: boolean('is_verified').notNull().default(false),
  subscribedAt: timestamp('subscribed_at').notNull().defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at'),
})

export const newsletterSubscribersRelations = relations(newsletterSubscribers, ({ one }) => ({
  region: one(regions, {
    fields: [newsletterSubscribers.regionId],
    references: [regions.id],
  }),
}))

export type NewsletterSubscriber = InferSelectModel<typeof newsletterSubscribers>
export type NewNewsletterSubscriber = InferInsertModel<typeof newsletterSubscribers>
