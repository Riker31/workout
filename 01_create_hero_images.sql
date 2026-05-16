-- Run this in your Supabase SQL Editor at:
-- https://dhlmvvgkbtqgffdgwifg.supabase.co/project/app/editor/sql

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  lift TEXT NOT NULL CHECK (lift IN ('squat', 'deadlift', 'bench', 'press')),
  image_url TEXT NOT NULL,
  description TEXT,
  athlete_gender TEXT CHECK (athlete_gender IN ('male', 'female', 'mixed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lift, image_url)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_hero_images_lift ON hero_images(lift);

-- Insert 6 images per lift (24 total - diverse athletes)
INSERT INTO hero_images (lift, image_url, description, athlete_gender) VALUES
-- SQUAT
('squat', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell squat', 'female'),
('squat', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man heavy squat', 'male'),
('squat', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell squat', 'female'),
('squat', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man front squat', 'male'),
('squat', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'CrossFit squat', 'mixed'),
('squat', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman powerlifting', 'female'),

-- DEADLIFT
('deadlift', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man deadlift', 'male'),
('deadlift', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman deadlift', 'female'),
('deadlift', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell lift', 'female'),
('deadlift', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man sumo deadlift', 'male'),
('deadlift', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym barbell', 'mixed'),
('deadlift', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman powerlifting', 'female'),

-- BENCH
('bench', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man bench press', 'male'),
('bench', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman dumbbell press', 'female'),
('bench', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell bench', 'female'),
('bench', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man incline press', 'male'),
('bench', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym bench', 'mixed'),
('bench', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman chest press', 'female'),

-- PRESS
('press', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man overhead press', 'male'),
('press', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman shoulder press', 'female'),
('press', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman military press', 'female'),
('press', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man barbell press', 'male'),
('press', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym overhead', 'mixed'),
('press', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman push press', 'female');

-- Verify
SELECT lift, COUNT(*) as image_count FROM hero_images GROUP BY lift ORDER BY lift;
