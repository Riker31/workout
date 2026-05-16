#!/usr/bin/env node
// Script to create hero_images table in Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const heroImages = [
  // SQUAT
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman barbell squat in gym', athlete_gender: 'female' },
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man heavy squat rack', athlete_gender: 'male' },
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman squatting with barbell', athlete_gender: 'female' },
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man front squat gym', athlete_gender: 'male' },
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'CrossFit squat box', athlete_gender: 'mixed' },
  { lift: 'squat', image_url: 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman powerlifting squat', athlete_gender: 'female' },
  
  // DEADLIFT
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man conventional deadlift', athlete_gender: 'male' },
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman deadlift strong', athlete_gender: 'female' },
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman barbell lift', athlete_gender: 'female' },
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man sumo deadlift', athlete_gender: 'male' },
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Gym barbell floor', athlete_gender: 'mixed' },
  { lift: 'deadlift', image_url: 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman powerlifting pull', athlete_gender: 'female' },
  
  // BENCH
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man bench press heavy', athlete_gender: 'male' },
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman dumbbell press', athlete_gender: 'female' },
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman barbell bench', athlete_gender: 'female' },
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man incline press', athlete_gender: 'male' },
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Gym bench station', athlete_gender: 'mixed' },
  { lift: 'bench', image_url: 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman chest press', athlete_gender: 'female' },
  
  // PRESS
  { lift: 'press', image_url: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man overhead press', athlete_gender: 'male' },
  { lift: 'press', image_url: 'https://images.pexels.com/photos/3393783/pexels-photo-3393783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman shoulder press', athlete_gender: 'female' },
  { lift: 'press', image_url: 'https://images.pexels.com/photos/1958679/pexels-photo-1958679.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman military press', athlete_gender: 'female' },
  { lift: 'press', image_url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Man barbell press', athlete_gender: 'male' },
  { lift: 'press', image_url: 'https://images.pexels.com/photos/1556697/pexels-photo-1556697.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Gym overhead station', athlete_gender: 'mixed' },
  { lift: 'press', image_url: 'https://images.pexels.com/photos/1958680/pexels-photo-1958680.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop', description: 'Woman push press', athlete_gender: 'female' },
];

async function main() {
  console.log('Creating hero_images table...');
  
  // Create table
  const { error: createError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS hero_images (
        id SERIAL PRIMARY KEY,
        lift TEXT NOT NULL CHECK (lift IN ('squat', 'deadlift', 'bench', 'press')),
        image_url TEXT NOT NULL,
        description TEXT,
        athlete_gender TEXT CHECK (athlete_gender IN ('male', 'female', 'mixed')),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(lift, image_url)
      );
      CREATE INDEX IF NOT EXISTS idx_hero_images_lift ON hero_images(lift);
    `
  });
  
  if (createError) {
    console.error('Error creating table:', createError.message);
    console.log('Table might already exist, continuing...');
  }
  
  console.log('Inserting hero images...');
  
  // Insert images
  for (const img of heroImages) {
    const { error } = await supabase.from('hero_images').insert(img);
    if (error) {
      if (error.code === '23505') { // Unique violation
        console.log(`  ✓ ${img.lift}: ${img.description} (already exists)`);
      } else {
        console.error(`  ✗ ${img.lift}: ${error.message}`);
      }
    } else {
      console.log(`  ✓ ${img.lift}: ${img.description}`);
    }
  }
  
  // Verify
  const { data: counts } = await supabase.from('hero_images').select('lift, count', { count: 'exact', head: true });
  const { data: summary } = await supabase.rpc('exec_sql', {
    sql: `SELECT lift, COUNT(*) as count FROM hero_images GROUP BY lift ORDER BY lift`
  });
  
  console.log('\n✅ Hero images table ready!');
  if (summary) {
    summary.forEach(row => {
      console.log(`   ${row.lift}: ${row.count} images`);
    });
  }
}

main().catch(console.error);
