-- Hero Images Table for Workout App
-- Stores 6 images per lift (24 total) with diverse athletes

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

-- Insert 6 images per lift (diverse athletes, various gym settings)
INSERT INTO hero_images (lift, image_url, description, athlete_gender) VALUES
-- SQUAT IMAGES
('squat', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell squat in gym', 'female'),
('squat', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man heavy squat rack', 'male'),
('squat', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman squatting with barbell', 'female'),
('squat', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man front squat gym', 'male'),
('squat', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'CrossFit squat box', 'mixed'),
('squat', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman powerlifting squat', 'female'),

-- DEADLIFT IMAGES
('deadlift', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man conventional deadlift', 'male'),
('deadlift', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman deadlift strong', 'female'),
('deadlift', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell lift', 'female'),
('deadlift', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man sumo deadlift', 'male'),
('deadlift', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym barbell floor', 'mixed'),
('deadlift', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman powerlifting pull', 'female'),

-- BENCH PRESS IMAGES
('bench', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man bench press heavy', 'male'),
('bench', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman dumbbell press', 'female'),
('bench', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman barbell bench', 'female'),
('bench', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man incline press', 'male'),
('bench', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym bench station', 'mixed'),
('bench', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman chest press', 'female'),

-- PRESS / OVERHEAD PRESS IMAGES
('press', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man overhead press', 'male'),
('press', 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman shoulder press', 'female'),
('press', 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman military press', 'female'),
('press', 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Man barbell press', 'male'),
('press', 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Gym overhead station', 'mixed'),
('press', 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', 'Woman push press', 'female');

-- Verify the data
SELECT lift, COUNT(*) as image_count FROM hero_images GROUP BY lift ORDER BY lift;
