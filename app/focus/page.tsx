"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { studyMetrics } from "@/lib/study";
import { Volume2, VolumeX } from "lucide-react";

const soundPreferenceKey = "focusgeek:pomodoro-sound";
const volumePreferenceKey = "focusgeek:pomodoro-volume";

export default function FocusPage() {
  const { data, update } = useStudy();
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id ?? "");
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [notice, setNotice] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(45);
  const audioContext = useRef<AudioContext | null>(null);
  const deadline = useRef(0);
  const session = useRef<{
    id: string;
    subjectId: string;
    minutes: number;
  } | null>(null);
  const m = studyMetrics(data);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        setSoundEnabled(localStorage.getItem(soundPreferenceKey) !== "off");
        const storedVolume = localStorage.getItem(volumePreferenceKey);
        const savedVolume = Number(storedVolume);
        if (storedVolume !== null && savedVolume >= 0 && savedVolume <= 100)
          setVolume(savedVolume);
      } catch {
        // The sound controls still work when browser storage is unavailable.
      }
    });
    return () => {
      active = false;
      const context = audioContext.current;
      audioContext.current = null;
      void context?.close();
    };
  }, []);

  function unlockAudio() {
    try {
      audioContext.current ??= new AudioContext();
      if (audioContext.current.state === "suspended")
        void audioContext.current.resume().catch(() => {
          setNotice("Sound is unavailable in this browser. The timer will still work.");
        });
      return audioContext.current;
    } catch {
      setNotice("Sound is unavailable in this browser. The timer will still work.");
      return null;
    }
  }

  const playChime = useCallback(() => {
    if (!soundEnabled || volume === 0) return;
    const context = audioContext.current;
    if (!context || context.state === "closed") return;
    const now = context.currentTime;
    for (const [index, frequency] of [523.25, 659.25, 783.99].entries()) {
      const tone = context.createOscillator();
      const gain = context.createGain();
      const start = now + index * 0.17;
      tone.type = "sine";
      tone.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, (volume / 100) * 0.18),
        start + 0.025,
      );
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
      tone.connect(gain);
      gain.connect(context.destination);
      tone.start(start);
      tone.stop(start + 0.58);
      tone.onended = () => {
        tone.disconnect();
        gain.disconnect();
      };
    }
  }, [soundEnabled, volume]);

  function previewSound() {
    if (unlockAudio()) playChime();
  }

  function setSoundPreference(enabled: boolean) {
    setSoundEnabled(enabled);
    if (enabled) unlockAudio();
    try {
      localStorage.setItem(soundPreferenceKey, enabled ? "on" : "off");
    } catch {
      // Optional preference.
    }
  }

  function setVolumePreference(value: number) {
    setVolume(value);
    try {
      localStorage.setItem(volumePreferenceKey, String(value));
    } catch {
      // Optional preference.
    }
  }

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setSeconds(remaining);
      if (remaining === 0 && session.current) {
        const completed = session.current;
        session.current = null;
        setHasSession(false);
        setRunning(false);
        update((d) =>
          d.sessions.some((s) => s.id === completed.id)
            ? d
            : {
                ...d,
                sessions: [
                  ...d.sessions,
                  { ...completed, completedAt: new Date().toISOString() },
                ],
              },
        );
        setNotice(
          "Session saved. Take a 5-minute break before starting another.",
        );
        playChime();
      }
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [running, update, playChime]);
  function start() {
    if (!subjectId || running) return;
    setNotice("");
    if (soundEnabled) unlockAudio();
    const remaining = seconds || duration * 60;
    if (!session.current)
      session.current = {
        id: crypto.randomUUID(),
        subjectId,
        minutes: duration,
      };
    deadline.current = Date.now() + remaining * 1000;
    setHasSession(true);
    setSeconds(remaining);
    setRunning(true);
  }
  function reset() {
    setRunning(false);
    setSeconds(duration * 60);
    session.current = null;
    setHasSession(false);
    setNotice("Timer reset. Incomplete sessions are not recorded.");
  }
  return (
    <AppShell
      title="Focus Mode"
      subtitle="Finish a focused session to record your study time."
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          Focused time<p className="text-2xl mt-2">{m.minutes} min</p>
        </div>
        <div className="card">
          Completed sessions
          <p className="text-2xl mt-2">{data.sessions.length}</p>
        </div>
        <div className="card">
          Study streak<p className="text-2xl mt-2">{m.streak} days</p>
        </div>
      </div>
      <div className="card mt-5 max-w-xl mx-auto space-y-5 text-center">
        <h2 className="text-lg font-bold">Pomodoro timer</h2>
        <label className="block text-sm text-left">
          Study subject
          <select
            className="field"
            disabled={hasSession || running}
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {data.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-left">
          Session length
          <select
            className="field"
            disabled={running || hasSession}
            value={duration}
            onChange={(e) => {
              const value = Number(e.target.value);
              setDuration(value);
              setSeconds(value * 60);
            }}
          >
            <option value={15}>15 minutes</option>
            <option value={25}>25 minutes</option>
            <option value={50}>50 minutes</option>
          </select>
        </label>
        <div className="rounded-2xl border border-[#d8cbd7] bg-[#f7f2e9] p-3 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              {soundEnabled ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
              Completion sound
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="text-xs underline" aria-pressed={soundEnabled} onClick={() => setSoundPreference(!soundEnabled)}>
                {soundEnabled ? "Sound on" : "Sound off"}
              </button>
              <button type="button" className="text-xs underline" disabled={!soundEnabled || volume === 0} onClick={previewSound}>
                Preview
              </button>
            </div>
          </div>
          <label className="mt-3 flex items-center gap-3 text-xs text-muted">
            Volume
            <input type="range" min="0" max="100" value={volume} disabled={!soundEnabled} onChange={(event) => setVolumePreference(Number(event.target.value))} aria-label="Chime volume" className="min-w-0 flex-1 accent-[#806585]" />
            <span className="w-8 text-right">{volume}%</span>
          </label>
        </div>
        <div role="timer" className="text-6xl font-bold py-8 tabular-nums">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:
          {String(seconds % 60).padStart(2, "0")}
        </div>
        <div className="flex gap-3 justify-center">
          <button
            className="action"
            onClick={start}
            disabled={!subjectId || running}
          >
            {hasSession ? "Resume" : "Start"}
          </button>
          <button
            className="action"
            disabled={!running}
            onClick={() => {
              setSeconds(
                Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)),
              );
              setRunning(false);
            }}
          >
            Pause
          </button>
          <button className="action" onClick={reset}>
            Reset
          </button>
        </div>
        {!data.subjects.length && (
          <p className="text-sm">Add a subject in the planner first.</p>
        )}
        {notice && (
          <p role="status" className="text-sm text-luna-100">
            {notice}
          </p>
        )}
        <p className="text-xs text-muted">
          The timer accounts for background tabs. Stay on this page; leaving or
          reloading cancels an incomplete session.
        </p>
      </div>
    </AppShell>
  );
}
