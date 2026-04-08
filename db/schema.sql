-- ============================================
-- TripSS Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- 1. REGIONS
-- Expand city-by-city: just add a new row
-- ============================================
CREATE TABLE regions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(100) NOT NULL UNIQUE,
  province      VARCHAR(50) NOT NULL,
  province_code VARCHAR(2) NOT NULL,
  country       VARCHAR(50) DEFAULT 'Canada',
  center_lat    DECIMAL(10,7) NOT NULL,
  center_lng    DECIMAL(10,7) NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now()
);

-- ============================================
-- 2. ORIGIN CITIES ("Where From?" dropdown)
-- ============================================
CREATE TABLE origin_cities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id   UUID NOT NULL REFERENCES regions(id),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) NOT NULL,
  lat         DECIMAL(10,7) NOT NULL,
  lng         DECIMAL(10,7) NOT NULL,
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT now(),
  UNIQUE(region_id, slug)
);

-- ============================================
-- 3. INTERESTS (filter checkboxes)
-- ============================================
CREATE TABLE interests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  slug          VARCHAR(100) NOT NULL UNIQUE,
  icon          VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT now()
);

-- ============================================
-- 4. TRAVEL TYPES (Day Trip, Weekend, etc.)
-- ============================================
CREATE TABLE travel_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(50) NOT NULL,
  slug          VARCHAR(50) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMP DEFAULT now()
);

-- ============================================
-- 5. PLACES (core table)
-- ============================================
CREATE TABLE places (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id         UUID NOT NULL REFERENCES regions(id),
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) NOT NULL,
  description       TEXT,
  short_description VARCHAR(500),
  nearby_text       VARCHAR(255),
  lat               DECIMAL(10,7) NOT NULL,
  lng               DECIMAL(10,7) NOT NULL,
  location          GEOGRAPHY(Point, 4326),
  address           TEXT,
  city              VARCHAR(100),
  province          VARCHAR(50),
  postal_code       VARCHAR(10),
  travel_type_id    UUID REFERENCES travel_types(id),
  avg_rating        DECIMAL(2,1) DEFAULT 0.0,
  rating_count      INTEGER DEFAULT 0,
  is_featured       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  meta_title        VARCHAR(255),
  meta_description  VARCHAR(500),
  created_at        TIMESTAMP DEFAULT now(),
  updated_at        TIMESTAMP DEFAULT now(),
  UNIQUE(region_id, slug)
);

CREATE INDEX places_region_active_idx ON places(region_id, is_active);
CREATE INDEX places_region_rating_idx ON places(region_id, avg_rating DESC);
CREATE INDEX places_region_name_idx ON places(region_id, name);
CREATE INDEX places_travel_type_idx ON places(travel_type_id);
CREATE INDEX places_location_idx ON places USING GIST(location);

-- ============================================
-- 6. PLACE IMAGES (multiple per place)
-- ============================================
CREATE TABLE place_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id      UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  alt_text      VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary    BOOLEAN DEFAULT false,
  width         INTEGER,
  height        INTEGER,
  created_at    TIMESTAMP DEFAULT now()
);

CREATE INDEX place_images_place_order_idx ON place_images(place_id, display_order);

-- ============================================
-- 7. PLACE ↔ INTERESTS (many-to-many)
-- ============================================
CREATE TABLE place_interests (
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (place_id, interest_id)
);

CREATE INDEX place_interests_interest_idx ON place_interests(interest_id, place_id);

-- ============================================
-- 8. PLACE ↔ BEST MONTHS (seasonal filter)
-- ============================================
CREATE TABLE place_best_months (
  place_id UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  month    SMALLINT NOT NULL CHECK (month >= 1 AND month <= 12),
  PRIMARY KEY (place_id, month)
);

CREATE INDEX place_best_months_month_idx ON place_best_months(month, place_id);

-- ============================================
-- 9. RATINGS
-- ============================================
CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id    UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  user_id     UUID,
  score       SMALLINT NOT NULL CHECK (score >= 1 AND score <= 5),
  review_text TEXT,
  ip_hash     VARCHAR(64),
  created_at  TIMESTAMP DEFAULT now()
);

CREATE INDEX ratings_place_idx ON ratings(place_id);
CREATE UNIQUE INDEX ratings_user_place_idx ON ratings(user_id, place_id) WHERE user_id IS NOT NULL;

-- ============================================
-- 10. NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) NOT NULL UNIQUE,
  region_id       UUID REFERENCES regions(id),
  is_verified     BOOLEAN DEFAULT false,
  subscribed_at   TIMESTAMP DEFAULT now(),
  unsubscribed_at TIMESTAMP
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-populate PostGIS location from lat/lng
CREATE OR REPLACE FUNCTION set_place_location()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location := ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_place_location
BEFORE INSERT OR UPDATE OF lat, lng ON places
FOR EACH ROW EXECUTE FUNCTION set_place_location();

-- Auto-update avg_rating on places when ratings change
CREATE OR REPLACE FUNCTION update_place_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_place_id UUID;
BEGIN
  target_place_id := COALESCE(NEW.place_id, OLD.place_id);
  UPDATE places SET
    avg_rating = COALESCE((SELECT ROUND(AVG(score)::numeric, 1) FROM ratings WHERE place_id = target_place_id), 0),
    rating_count = (SELECT COUNT(*) FROM ratings WHERE place_id = target_place_id),
    updated_at = now()
  WHERE id = target_place_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_place_rating
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW EXECUTE FUNCTION update_place_rating();
