"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LIFTS, LIFT_LABELS, ASSISTANCE, WEEKLY_ORDER, WEEK_SCHEMES, calculateSets, suggestNewMax, estimatedOneRM, roundToNearest5 } from "@/lib/531";

type TrainingMax = { lift: string; training_max: number; goal_max: number | null };
type CycleState = { id: string; current_cycle: number; current_week: number; current_lift_index: number };
type LogEntry = { id: string; logged_at: string; cycle: number; week: number; lift: string; amrap_weight: number; amrap_reps: number; estimated_1rm: number; training_max: number };

const WEEK_NAMES = ['', 'Week 1 — 5s', 'Week 2 — 3s', 'Week 3 — 5/3/1', 'Week 4 — Deload'];

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"today" | "log" | "history">("today");
  const [maxes, setMaxes] = useState<TrainingMax[]>([]);
  const [cycle, setCycle] = useState<CycleState | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [amrapWeight, setAmrapWeight] = useState("");
  const [amrapReps, setAmrapReps] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [editMaxesMode, setEditMaxesMode] = useState(false);
  const [goalMaxes, setGoalMaxes] = useState<Record<string, string>>({});
  const [suggestedMax, setSuggestedMax] = useState<number | null>(null);
  const [overrideMax, setOverrideMax] = useState("");
  const [heroImage, setHeroImage] = useState<string>("");

  useEffect(() => {
    if (localStorage.getItem("workout_authed") === "yes") setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) { loadData(); }
  }, [authed]);

  // Update hero image when lift changes - rotates daily
  useEffect(() => {
    if (currentLift && authed) {
      // Curated Unsplash image IDs for each lift (diverse athletes)
      const imageSets: Record<string, string[]> = {
        squat: [
          '1574683158889-2c2933d8c3a6', // Woman squatting
          '1581009923676-044cb69a8e26', // Man deadlifting/squatting
          '1599058948528-5c6c9f3d4d5e', // Woman barbell squat
          '1571018795872-3f49877b2644', // Man squatting heavy
          '1534438327276-14e5300c3a48', // CrossFit gym scene
          '1593697752196-92f1678e5f3e', // Woman powerlifting
        ],
        deadlift: [
          '1581009923676-044cb69a8e26', // Man deadlifting
          '1599058948528-5c6c9f3d4d5e', // Woman deadlifting
          '1574683158889-2c2933d8c3a6', // Woman barbell lift
          '1571018795872-3f49877b2644', // Man strongman lift
          '1534438327276-14e5300c3a48', // Gym barbell scene
          '1593697752196-92f1678e5f3e', // Woman powerlifting
        ],
        bench: [
          '1571018795872-3f49877b2644', // Man bench pressing
          '1599058948528-5c6c9f3d4d5e', // Woman bench press
          '1574683158889-2c2933d8c3a6', // Woman chest press
          '1581009923676-044cb69a8e26', // Man gym press
          '1534438327276-14e5300c3a48', // Gym bench scene
          '1593697752196-92f1678e5f3e', // Woman strength training
        ],
        press: [
          '1534438327276-14e5300c3a48', // Overhead press
          '1599058948528-5c6c9f3d4d5e', // Woman shoulder press
          '1571018795872-3f49877b2644', // Man military press
          '1574683158889-2c2933d8c3a6', // Woman overhead lift
          '1581009923676-044cb69a8e26', // Man barbell press
          '1593697752196-92f1678e5f3e', // CrossFit press
        ],
      };
      // Rotate based on day of year + cycle for variety
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const imageIndex = (dayOfYear + (cycle?.current_cycle || 0)) % (imageSets[currentLift]?.length || 1);
      const imageId = imageSets[currentLift]?.[imageIndex] || '1574683158889-2c2933d8c3a6';
      setHeroImage(`https://images.unsplash.com/photo-${imageId}?w=1200&h=400&fit=crop`);
    }
  }, [currentLift, authed, cycle]);

  const loadData = async () => {
    const [{ data: m }, { data: c }, { data: l }] = await Promise.all([
      supabase.from("training_maxes").select("*"),
      supabase.from("cycle_state").select("*").limit(1).single(),
      supabase.from("workout_log").select("*").order("logged_at", { ascending: false }).limit(20),
    ]);
    if (m) setMaxes(m);
    if (c) setCycle(c);
    if (l) setLog(l);
    if (!m || m.length === 0) setSetupMode(true);
  };

  const login = () => {
    if (pw === "liftheavy") {
      localStorage.setItem("workout_authed", "yes");
      setAuthed(true);
    } else {
      setPwError(true);
    }
  };

  const currentLift = cycle ? WEEKLY_ORDER[cycle.current_lift_index] : null;
  const currentMax = currentLift ? maxes.find(m => m.lift === currentLift)?.training_max ?? 0 : 0;
  const sets = cycle && currentLift ? calculateSets(currentMax, cycle.current_week) : [];
  const isDeload = cycle ? cycle.current_week === 4 : false;

  const handleSaveWorkout = async () => {
    if (!cycle || !currentLift) return;
    setSaving(true);
    const w = parseFloat(amrapWeight);
    const r = parseInt(amrapReps);
    const est1rm = w && r ? estimatedOneRM(w, r) : null;

    // Save log entry
    await supabase.from("workout_log").insert({
      cycle: cycle.current_cycle,
      week: cycle.current_week,
      lift: currentLift,
      training_max: currentMax,
      amrap_weight: w || null,
      amrap_reps: r || null,
      estimated_1rm: est1rm,
      notes: notes || null,
    });

    // Calculate suggestion for new max (after week 4)
    if (cycle.current_week === 4) {
      const newMax = suggestNewMax(currentLift as any, currentMax, r, cycle.current_week);
      setSuggestedMax(newMax);
    }

    // Advance cycle state
    const nextLiftIndex = (cycle.current_lift_index + 1) % 4;
    const completedWeek = nextLiftIndex === 0;
    const nextWeek = completedWeek ? (cycle.current_week % 4) + 1 : cycle.current_week;
    const nextCycle = completedWeek && cycle.current_week === 4 ? cycle.current_cycle + 1 : cycle.current_cycle;

    await supabase.from("cycle_state").update({
      current_lift_index: nextLiftIndex,
      current_week: nextWeek,
      current_cycle: nextCycle,
      updated_at: new Date().toISOString(),
    }).eq("id", cycle.id);

    setAmrapWeight(""); setAmrapReps(""); setNotes("");
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    await loadData();
  };

  const handleSetupSave = async () => {
    for (const lift of LIFTS) {
      const val = parseFloat(goalMaxes[lift] || "0");
      if (!val) continue;
      await supabase.from("training_maxes").upsert({
        lift,
        training_max: val, // Use directly as training max
        goal_max: val,
      }, { onConflict: "lift" });
    }
    setSetupMode(false);
    await loadData();
  };

  const handleEditMaxesSave = async () => {
    for (const lift of LIFTS) {
      const tm = maxes.find(m => m.lift === lift);
      if (!tm) continue;
      const goalVal = parseFloat(goalMaxes[lift] || String(tm.goal_max || 0));
      const trainingMaxVal = Math.round(goalVal * 0.9 / 5) * 5; // 90% rounded to nearest 5
      await supabase.from("training_maxes").upsert({
        lift,
        training_max: trainingMaxVal,
        goal_max: goalVal,
      }, { onConflict: "lift" });
    }
    setEditMaxesMode(false);
    await loadData();
  };

  const startEditMaxes = () => {
    const initial: Record<string, string> = {};
    maxes.forEach(m => {
      initial[m.lift] = String(m.goal_max || m.training_max);
    });
    setGoalMaxes(initial);
    setEditMaxesMode(true);
  };

  const handleMaxOverride = async () => {
    if (!currentLift) return;
    const newMax = overrideMax ? parseFloat(overrideMax) : suggestedMax;
    if (!newMax) return;
    await supabase.from("training_maxes").upsert({ lift: currentLift, training_max: newMax }, { onConflict: "lift" });
    setSuggestedMax(null); setOverrideMax("");
    await loadData();
  };

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🏋️</div>
        <h1 className="text-2xl font-bold text-white mb-6">5/3/1 Tracker</h1>
        <input type="password" placeholder="Password" value={pw} onChange={e => { setPw(e.target.value); setPwError(false); }}
          onKeyDown={e => e.key === "Enter" && login()}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-blue-500" />
        {pwError && <p className="text-red-400 text-sm mb-3">Wrong password</p>}
        <button onClick={login} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">Enter</button>
      </div>
    </div>
  );

  if (setupMode) return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">🏋️ Set Up Your Maxes</h1>
        <p className="text-gray-400 mb-6">Enter your goal 1RM for each lift. I'll set your training max to 90% automatically.</p>
        <div className="space-y-4">
          {LIFTS.map(lift => (
            <div key={lift} className="bg-gray-900 rounded-xl p-4">
              <label className="text-white font-semibold block mb-2">{LIFT_LABELS[lift]} — Training Max (lbs)</label>
              <input type="number" placeholder="e.g. 205" value={goalMaxes[lift] || ""}
                onChange={e => setGoalMaxes(p => ({ ...p, [lift]: e.target.value }))}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <button onClick={handleSetupSave} className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">Start Program →</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Image */}
      {tab === "today" && heroImage && currentLift && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={heroImage} 
            alt={`${LIFT_LABELS[currentLift as keyof typeof LIFT_LABELS]} workout`}
            className="w-full h-full object-cover"
            onError={() => setHeroImage(`https://images.unsplash.com/photo-${currentLift === 'squat' ? '1574683158889-2c2933d8c3a6' : currentLift === 'deadlift' ? '1581009923676-044cb69a8e26' : currentLift === 'bench' ? '1571018795872-3f49877b2644' : '1534438327276-14e5300c3a48'}?w=1200&h=400&fit=crop`)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 to-gray-950/30" />
          <div className="absolute bottom-4 left-6 right-6">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{LIFT_LABELS[currentLift as keyof typeof LIFT_LABELS]}</h1>
            {cycle && <p className="text-gray-200 text-sm drop-shadow">Cycle {cycle.current_cycle} · {WEEK_NAMES[cycle.current_week]}</p>}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div>
            {tab !== "today" && (
              <>
                <h1 className="text-xl font-bold">🏋️ 5/3/1 Tracker</h1>
                {cycle && <p className="text-gray-400 text-sm">Cycle {cycle.current_cycle} · {WEEK_NAMES[cycle.current_week]}</p>}
              </>
            )}
          </div>
          <button onClick={() => { localStorage.removeItem("workout_authed"); setAuthed(false); }} className="text-gray-500 text-sm hover:text-gray-300">Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {(["today", "log", "history"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition ${tab === t ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"}`}>
              {t === "today" ? "💪 Today" : t === "log" ? "📝 Log" : "📊 History"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4">

        {/* TODAY TAB */}
        {tab === "today" && cycle && currentLift && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{LIFT_LABELS[currentLift as keyof typeof LIFT_LABELS]}</h2>
                  <p className="text-gray-400">{WEEK_NAMES[cycle.current_week]} {isDeload ? "— Deload 🧘" : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Training Max</p>
                  <p className="text-2xl font-bold text-blue-400">{currentMax} lbs</p>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-2 mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Working Sets</p>
                {sets.map((s, i) => (
                  <div key={i} className={`flex justify-between items-center rounded-xl px-4 py-3 ${s.isAmrap ? "bg-blue-600/20 border border-blue-500/30" : "bg-gray-800"}`}>
                    <span className="font-semibold">{s.weight} lbs</span>
                    <span className={`text-sm font-medium ${s.isAmrap ? "text-blue-400" : "text-gray-400"}`}>
                      {s.reps} reps {s.isAmrap ? "⚡ AMRAP" : ""}
                    </span>
                  </div>
                ))}
              </div>

              {/* Assistance */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Assistance</p>
                {ASSISTANCE[currentLift as keyof typeof ASSISTANCE].map((a, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-400 py-1">
                    <span>{a.name}</span>
                    <span>{a.sets}×{a.reps}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Log AMRAP */}
            {!isDeload && (
              <div className="bg-gray-900 rounded-2xl p-5">
                <h3 className="font-bold mb-3">⚡ Log Your Last Set (AMRAP)</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Weight Used (lbs)</label>
                    <input type="number" value={amrapWeight} onChange={e => setAmrapWeight(e.target.value)} placeholder={String(sets[2]?.weight || "")}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Reps Completed</label>
                    <input type="number" value={amrapReps} onChange={e => setAmrapReps(e.target.value)} placeholder="e.g. 8"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                {amrapWeight && amrapReps && (
                  <p className="text-blue-400 text-sm mb-3">Estimated 1RM: <strong>{estimatedOneRM(parseFloat(amrapWeight), parseInt(amrapReps))} lbs</strong></p>
                )}
                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 mb-3" />
                <button onClick={handleSaveWorkout} disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">
                  {saving ? "Saving..." : saved ? "✅ Saved!" : "Save Workout"}
                </button>
              </div>
            )}

            {isDeload && (
              <button onClick={handleSaveWorkout} disabled={saving}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition">
                {saving ? "Saving..." : "✅ Complete Deload"}
              </button>
            )}

            {/* Suggested new max */}
            {suggestedMax && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                <h3 className="font-bold text-yellow-400 mb-2">🎉 Cycle Complete!</h3>
                <p className="text-gray-300 mb-3">Suggested new training max for {LIFT_LABELS[currentLift as keyof typeof LIFT_LABELS]}:</p>
                <p className="text-3xl font-bold text-yellow-400 mb-4">{suggestedMax} lbs</p>
                <input type="number" value={overrideMax} onChange={e => setOverrideMax(e.target.value)} placeholder={String(suggestedMax)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500 mb-3" />
                <button onClick={handleMaxOverride} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition">
                  Accept & Start New Cycle
                </button>
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && !editMaxesMode && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">📊 Training History</h2>
              <button onClick={startEditMaxes} className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-400 px-3 py-1.5 rounded-lg transition">
                ✏️ Edit Goal Maxes
              </button>
            </div>
            {/* Maxes summary */}
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Current Training Maxes</p>
              {maxes.map(m => (
                <div key={m.lift} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300">{LIFT_LABELS[m.lift as keyof typeof LIFT_LABELS]}</span>
                  <div className="text-right">
                    <span className="font-bold text-blue-400">{m.training_max} lbs</span>
                    {m.goal_max && <span className="text-gray-500 text-xs ml-2">/ {m.goal_max} goal</span>}
                  </div>
                </div>
              ))}
            </div>
            {log.length === 0 && <p className="text-gray-500 text-center py-8">No workouts logged yet</p>}
            {log.map(entry => (
              <div key={entry.id} className="bg-gray-900 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{LIFT_LABELS[entry.lift as keyof typeof LIFT_LABELS]}</p>
                    <p className="text-xs text-gray-500">Cycle {entry.cycle} · Week {entry.week} · {new Date(entry.logged_at).toLocaleDateString()}</p>
                  </div>
                  {entry.amrap_reps && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">{entry.amrap_weight}×{entry.amrap_reps}</p>
                      {entry.estimated_1rm && <p className="text-xs text-gray-500">~{entry.estimated_1rm} 1RM</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EDIT GOAL MAXES MODE */}
        {tab === "history" && editMaxesMode && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">✏️ Edit Goal Maxes</h2>
              <button onClick={() => setEditMaxesMode(false)} className="text-xs text-gray-500 hover:text-gray-300">
                Cancel
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">Update your goal 1RM. Training max will be set to 90% automatically.</p>
            <div className="space-y-4">
              {maxes.map(m => {
                const goalVal = parseFloat(goalMaxes[m.lift] || String(m.goal_max || 0));
                const newTM = Math.round(goalVal * 0.9 / 5) * 5;
                return (
                  <div key={m.lift} className="bg-gray-900 rounded-xl p-4">
                    <label className="text-white font-semibold block mb-2">{LIFT_LABELS[m.lift as keyof typeof LIFT_LABELS]}</label>
                    <div className="space-y-2">
                      <input type="number" value={goalMaxes[m.lift] || ""}
                        onChange={e => setGoalMaxes(p => ({ ...p, [m.lift]: e.target.value }))}
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                        placeholder="Goal 1RM (lbs)" />
                      <p className="text-xs text-gray-500">
                        Current TM: <strong className="text-blue-400">{m.training_max} lbs</strong> → 
                        New TM: <strong className="text-green-400">{newTM} lbs</strong> (90% of {goalVal || '___'} )
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={handleEditMaxesSave} className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition">
              Save Changes
            </button>
          </div>
        )}

        {/* LOG TAB - manual entry */}
        {tab === "log" && (
          <div>
            <h2 className="text-lg font-bold mb-4">📝 Workout Log</h2>
            <div className="space-y-3">
              {log.length === 0 && <p className="text-gray-500 text-center py-8">No workouts logged yet</p>}
              {log.map(entry => (
                <div key={entry.id} className="bg-gray-900 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{LIFT_LABELS[entry.lift as keyof typeof LIFT_LABELS]}</p>
                      <p className="text-xs text-gray-500">Cycle {entry.cycle} · Week {entry.week}</p>
                      <p className="text-xs text-gray-600">{new Date(entry.logged_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">TM: {entry.training_max} lbs</p>
                      {entry.amrap_reps && <p className="text-sm font-bold text-blue-400">{entry.amrap_weight}×{entry.amrap_reps} reps</p>}
                      {entry.estimated_1rm && <p className="text-xs text-gray-400">Est. 1RM: {entry.estimated_1rm}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
