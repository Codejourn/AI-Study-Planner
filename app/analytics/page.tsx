"use client";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { studyMetrics } from "@/lib/study";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
export default function Analytics() {
  const { data } = useStudy();
  const m = studyMetrics(data);
  return (
    <AppShell
      title="Analytics & Readiness"
      subtitle="Progress based on your recorded study activity."
    >
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card">
          <p>Focused hours</p>
          <p className="text-2xl font-bold mt-2">
            {(m.minutes / 60).toFixed(1)}h
          </p>
        </div>
        <div className="card">
          <p>Quiz accuracy</p>
          <p className="text-2xl font-bold mt-2">
            {data.attempts.length ? `${m.quiz}%` : "No attempts"}
          </p>
        </div>
        <div className="card">
          <p>Readiness estimate</p>
          <p className="text-2xl font-bold mt-2">{m.readiness}%</p>
        </div>
      </div>
      <div className="card mt-5">
        <h2 className="font-bold mb-4">Focused hours · Last 7 days</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={m.weekly}>
            <XAxis dataKey="day" stroke="#8b778f" />
            <Tooltip
              contentStyle={{ background: "#faf7f1", borderRadius: 12 }}
            />
            <Bar dataKey="hours" fill="#9a809f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card mt-5 space-y-3">
        <h2 className="font-bold">How readiness is estimated</h2>
        <p className="text-sm text-muted">
          Task completion contributes 40%, quiz accuracy 35%, the last 7
          days&apos; study time against your daily goal 15%, and active days
          10%. Missing activity contributes zero. This is a progress estimate,
          not a prediction of exam results or syllabus coverage.
        </p>
        <p>
          {m.completion}% of tasks completed · {m.activeDays}/7 active days ·{" "}
          {m.streak} day streak
        </p>
      </div>
      <div className="card mt-5 space-y-3">
        <h2 className="font-bold">Quiz history</h2>
        {!data.attempts.length && (
          <p className="text-sm text-muted">
            Complete a quiz to track your performance.
          </p>
        )}
        {[...data.attempts].reverse().map((a) => (
          <p key={a.id}>
            {data.subjects.find((s) => s.id === a.subjectId)?.name ??
              "Deleted subject"}
            : {a.correct}/{a.total}
            <span className="block text-xs text-muted">
              {new Date(a.completedAt).toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    </AppShell>
  );
}
