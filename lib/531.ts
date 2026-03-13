export const LIFTS = ['squat', 'deadlift', 'bench', 'press'] as const;
export type Lift = typeof LIFTS[number];

export const LIFT_LABELS: Record<Lift, string> = {
  squat: '🏋️ Squat',
  deadlift: '⚡ Deadlift',
  bench: '💪 Bench Press',
  press: '🎯 Military Press',
};

export const ASSISTANCE: Record<Lift, { name: string; sets: number; reps: number }[]> = {
  press:    [{ name: 'Dips', sets: 5, reps: 15 }, { name: 'Chin-ups', sets: 5, reps: 10 }],
  deadlift: [{ name: 'Good Mornings', sets: 5, reps: 12 }, { name: 'Hanging Leg Raise', sets: 5, reps: 15 }],
  bench:    [{ name: 'DB Bench Press', sets: 5, reps: 15 }, { name: 'DB Row', sets: 5, reps: 10 }],
  squat:    [{ name: 'Leg Press', sets: 5, reps: 15 }, { name: 'Leg Curl', sets: 5, reps: 10 }],
};

// Weekly cycle order
export const WEEKLY_ORDER: Lift[] = ['squat', 'deadlift', 'press', 'bench'];

// Week schemes: [sets x reps, percentages]
export const WEEK_SCHEMES = [
  { week: 1, sets: [{ reps: '5',  pct: 0.65 }, { reps: '5',  pct: 0.75 }, { reps: '5+', pct: 0.85 }] },
  { week: 2, sets: [{ reps: '3',  pct: 0.70 }, { reps: '3',  pct: 0.80 }, { reps: '3+', pct: 0.90 }] },
  { week: 3, sets: [{ reps: '5',  pct: 0.75 }, { reps: '3',  pct: 0.85 }, { reps: '1+', pct: 0.95 }] },
  { week: 4, sets: [{ reps: '5',  pct: 0.40 }, { reps: '5',  pct: 0.50 }, { reps: '5',  pct: 0.60 }], deload: true },
];

export function roundToNearest5(weight: number): number {
  return Math.round(weight / 5) * 5;
}

export function calculateSets(trainingMax: number, weekNum: number) {
  const scheme = WEEK_SCHEMES[(weekNum - 1) % 4];
  return scheme.sets.map(s => ({
    reps: s.reps,
    weight: roundToNearest5(trainingMax * s.pct),
    isAmrap: s.reps.includes('+'),
  }));
}

// Suggest new training max after completing an AMRAP set
// Standard Wendler: upper +5lbs, lower +10lbs
export function suggestNewMax(lift: Lift, currentMax: number, repsCompleted: number, weekNum: number): number {
  const isLower = lift === 'squat' || lift === 'deadlift';
  const increment = isLower ? 10 : 5;
  // Only increment after completing full cycle (week 4 deload)
  if (weekNum === 4) return currentMax + increment;
  return currentMax;
}

// Epley formula: estimated 1RM from reps x weight
export function estimatedOneRM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return roundToNearest5(weight * (1 + reps / 30));
}
