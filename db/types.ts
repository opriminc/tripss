export type Database = {
  public: {
    Tables: {
      regions: {
        Row: {
          id: string
          name: string
          slug: string
          province: string
          province_code: string
          country: string
          center_lat: number
          center_lng: number
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          province: string
          province_code: string
          country?: string
          center_lat: number
          center_lng: number
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          province?: string
          province_code?: string
          country?: string
          center_lat?: number
          center_lng?: number
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      origin_cities: {
        Row: {
          id: string
          region_id: string
          name: string
          slug: string
          lat: number
          lng: number
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          region_id: string
          name: string
          slug: string
          lat: number
          lng: number
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          region_id?: string
          name?: string
          slug?: string
          lat?: number
          lng?: number
          is_default?: boolean
          created_at?: string
        }
      }
      interests: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          display_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          icon?: string | null
          display_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      travel_types: {
        Row: {
          id: string
          name: string
          slug: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          display_order?: number
          created_at?: string
        }
      }
      places: {
        Row: {
          id: string
          region_id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          nearby_text: string | null
          lat: number
          lng: number
          location: unknown | null
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          travel_type_id: string | null
          avg_rating: number
          rating_count: number
          is_featured: boolean
          is_active: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          region_id: string
          name: string
          slug: string
          description?: string | null
          short_description?: string | null
          nearby_text?: string | null
          lat: number
          lng: number
          address?: string | null
          city?: string | null
          province?: string | null
          postal_code?: string | null
          travel_type_id?: string | null
          avg_rating?: number
          rating_count?: number
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          region_id?: string
          name?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          nearby_text?: string | null
          lat?: number
          lng?: number
          address?: string | null
          city?: string | null
          province?: string | null
          postal_code?: string | null
          travel_type_id?: string | null
          avg_rating?: number
          rating_count?: number
          is_featured?: boolean
          is_active?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      place_images: {
        Row: {
          id: string
          place_id: string
          url: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          place_id: string
          url: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          url?: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          width?: number | null
          height?: number | null
          created_at?: string
        }
      }
      place_interests: {
        Row: {
          place_id: string
          interest_id: string
        }
        Insert: {
          place_id: string
          interest_id: string
        }
        Update: {
          place_id?: string
          interest_id?: string
        }
      }
      place_best_months: {
        Row: {
          place_id: string
          month: number
        }
        Insert: {
          place_id: string
          month: number
        }
        Update: {
          place_id?: string
          month?: number
        }
      }
      ratings: {
        Row: {
          id: string
          place_id: string
          user_id: string | null
          score: number
          review_text: string | null
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          place_id: string
          user_id?: string | null
          score: number
          review_text?: string | null
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string | null
          score?: number
          review_text?: string | null
          ip_hash?: string | null
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          region_id: string | null
          is_verified: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          region_id?: string | null
          is_verified?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          region_id?: string | null
          is_verified?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience type helpers
type Tables = Database['public']['Tables']

export type TableRow<T extends keyof Tables> = Tables[T]['Row']
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update']
