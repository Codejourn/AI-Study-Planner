"use client";
import { useEffect, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { studyMetrics } from "@/lib/study";
export default function FocusPage() {
  const { data, update } = useStudy();
  const [subjectId, setSubjectId] = useState(data.subjects[0]?.id ?? "");
  const [duration, setDuration] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [notice, setNotice] = useState("");
  const deadline = useRef(0);
  const session = useRef<{
    id: string;
    subjectId: string;
    minutes: number;
  } | null>(null);
  const m = studyMetrics(data);
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
      }
    };
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [running, update]);
  function start() {
    if (!subjectId || running) return;
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
    setNotice("");
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
