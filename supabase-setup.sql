-- 5/3/1 Workout Tracker Schema

-- Training maxes per lift (current working max)
create table if not exists training_maxes (
  id uuid primary key default gen_random_uuid(),
  lift text not null unique, -- squat, deadlift, bench, press
  training_max numeric not null,
  goal_max numeric, -- target 1RM
  updated_at timestamptz default now()
);

-- Cycle state
create table if not exists cycle_state (
  id uuid primary key default gen_random_uuid(),
  current_cycle integer not null default 1,
  current_week integer not null default 1,  -- 1-4
  current_lift_index integer not null default 0, -- 0-3 (press, deadlift, bench, squat)
  updated_at timestamptz default now()
);

-- Workout log
create table if not exists workout_log (
  id uuid primary key default gen_random_uuid(),
  logged_at timestamptz default now(),
  cycle integer not null,
  week integer not null,
  lift text not null,
  training_max numeric not null,
  amrap_weight numeric,      -- weight used on last set
  amrap_reps integer,        -- reps completed on last set
  estimated_1rm numeric,     -- calculated from amrap
  notes text,
  completed boolean default true
);

-- Enable RLS (open for single user)
alter table training_maxes enable row level security;
alter table cycle_state enable row level security;
alter table workout_log enable row level security;

create policy "allow all" on training_maxes for all using (true) with check (true);
create policy "allow all" on cycle_state for all using (true) with check (true);
create policy "allow all" on workout_log for all using (true) with check (true);

-- Seed initial cycle state
insert into cycle_state (current_cycle, current_week, current_lift_index)
values (1, 1, 0)
on conflict do nothing;
