// Shared types used in views and function returns
export type InterestRef = {
  id?: string
  name: string
  slug: string
  icon: string | null
}

export type PlaceImageRef = {
  id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  width: number | null
  height: number | null
}

export type RatingRef = {
  id: string
  score: number
  review_text: string | null
  created_at: string
}

export type SearchPlaceResult = {
  id: string
  name: string
  slug: string
  short_description: string | null
  nearby_text: string | null
  lat: number
  lng: number
  avg_rating: number
  rating_count: number
  is_featured: boolean
  region_slug: string
  travel_type_name: string | null
  travel_type_slug: string | null
  primary_image_url: string | null
  primary_image_alt: string | null
  interests: InterestRef[]
  best_months: number[]
  distance_km: number | null
  total_count: number
}

export type NearbyPlaceResult = {
  id: string
  name: string
  slug: string
  short_description: string | null
  nearby_text: string | null
  avg_rating: number
  region_slug: string
  primary_image_url: string | null
  distance_km: number
}

export type PlaceDetailResult = {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  nearby_text: string | null
  lat: number
  lng: number
  address: string | null
  city: string | null
  province: string | null
  postal_code: string | null
  avg_rating: number
  rating_count: number
  is_featured: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  region_name: string
  region_slug: string
  travel_type_name: string | null
  travel_type_slug: string | null
  images: PlaceImageRef[]
  interests: InterestRef[]
  best_months: number[]
  recent_ratings: RatingRef[]
}

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
    Views: {
      v_place_cards: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          nearby_text: string | null
          lat: number
          lng: number
          avg_rating: number
          rating_count: number
          is_featured: boolean
          is_active: boolean
          created_at: string
          region_id: string
          region_name: string
          region_slug: string
          travel_type_id: string | null
          travel_type_name: string | null
          travel_type_slug: string | null
          primary_image_url: string | null
          primary_image_alt: string | null
          interests: InterestRef[]
          best_months: number[]
        }
      }
      v_place_details: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          short_description: string | null
          nearby_text: string | null
          lat: number
          lng: number
          address: string | null
          city: string | null
          province: string | null
          postal_code: string | null
          avg_rating: number
          rating_count: number
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          region_name: string
          region_slug: string
          region_province: string
          travel_type_name: string | null
          travel_type_slug: string | null
          images: PlaceImageRef[]
          interests: InterestRef[]
          best_months: number[]
          recent_ratings: RatingRef[]
        }
      }
      v_region_stats: {
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
          active_place_count: number
          total_place_count: number
          avg_region_rating: number
          origin_city_count: number
        }
      }
      v_interest_counts: {
        Row: {
          id: string
          name: string
          slug: string
          icon: string | null
          display_order: number
          is_active: boolean
          region_id: string | null
          region_slug: string
          place_count: number
        }
      }
      v_origin_cities: {
        Row: {
          id: string
          name: string
          slug: string
          lat: number
          lng: number
          is_default: boolean
          region_id: string
          region_name: string
          region_slug: string
        }
      }
      v_travel_type_counts: {
        Row: {
          id: string
          name: string
          slug: string
          display_order: number
          region_id: string | null
          region_slug: string
          place_count: number
        }
      }
      v_monthly_places: {
        Row: {
          month: number
          place_id: string
          name: string
          slug: string
          short_description: string | null
          nearby_text: string | null
          avg_rating: number
          region_id: string
          region_slug: string
          primary_image_url: string | null
        }
      }
      v_featured_places: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          nearby_text: string | null
          avg_rating: number
          rating_count: number
          region_id: string
          region_name: string
          region_slug: string
          travel_type_name: string | null
          primary_image_url: string | null
          primary_image_alt: string | null
        }
      }
      v_ratings: {
        Row: {
          id: string
          score: number
          review_text: string | null
          user_id: string | null
          created_at: string
          place_id: string
          place_name: string
          place_slug: string
          region_id: string
          region_slug: string
        }
      }
      v_newsletter_subscribers: {
        Row: {
          id: string
          email: string
          is_verified: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          region_id: string | null
          region_name: string | null
          region_slug: string | null
        }
      }
    }
    Functions: {
      fn_search_places: {
        Args: {
          p_region_slug: string
          p_search?: string | null
          p_origin_lat?: number | null
          p_origin_lng?: number | null
          p_travel_type_slug?: string | null
          p_month?: number | null
          p_interest_slugs?: string[] | null
          p_sort?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: SearchPlaceResult[]
      }
      fn_nearby_places: {
        Args: {
          p_lat: number
          p_lng: number
          p_radius_km?: number
          p_exclude_place_id?: string | null
          p_limit?: number
        }
        Returns: NearbyPlaceResult[]
      }
      fn_get_place: {
        Args: {
          p_region_slug: string
          p_place_slug: string
        }
        Returns: PlaceDetailResult[]
      }
      fn_refresh_materialized_views: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}

// Convenience type helpers
type Tables = Database['public']['Tables']

export type TableRow<T extends keyof Tables> = Tables[T]['Row']
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update']
