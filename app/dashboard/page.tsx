"use client";
import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { localDate, studyMetrics } from "@/lib/study";
import {
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  MoreHorizontal,
  Plus,
  Sparkles,
} from "lucide-react";

function ProgressCard({
  label,
  value,
  color,
  detail,
}: {
  label: string;
  value: number;
  color: string;
  detail: string;
}) {
  return (
    <div className="progress-card">
      <h2>{label}</h2>
      <div className="progress-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r="39"
            fill="none"
            stroke="#ffffff17"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r="39"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 245.04} 245.04`}
          />
        </svg>
        <span>{value}%</span>
      </div>
      <p>{detail}</p>
    </div>
  );
}
export default function Dashboard() {
  const { data, update } = useStudy();
  const metrics = studyMetrics(data);
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selected, setSelected] = useState(localDate());
  const tasks = data.tasks.filter((t) => t.date === selected);
  const exams = [...data.subjects]
    .filter((s) => s.examDate >= localDate())
    .sort((a, b) => a.examDate.localeCompare(b.examDate));
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  function moveMonth(amount: number) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + amount, 1));
  }
  return (
    <AppShell title="Dashboard">
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="dashboard-top">
            <section className="panel">
              <div className="panel-heading">
                <h2>Your subjects</h2>
                <Link
                  href="/planner"
                  aria-label="Add a subject"
                  className="text-[#8a718e]"
                >
                  <Plus size={17} />
                </Link>
              </div>
              {data.subjects.length ? (
                data.subjects.slice(0, 3).map((s, i) => (
                  <Link href="/planner" key={s.id} className="subject-row">
                    <span className={`subject-icon ${["", "rose", "gold"][i]}`}>
                      <BookOpen size={16} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{s.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {
                          [
                            "",
                            "A little at a time",
                            "Keep the momentum",
                            "Your current priority",
                          ][s.priority]
                        }
                      </p>
                    </div>
                    <span className="row-action">
                      <MoreHorizontal size={15} />
                    </span>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <BookOpen size={24} className="mb-2 text-[#9b859f]" />
                  Your next chapter starts here.
                  <br />
                  Add a subject and make it your own.
                </div>
              )}
              <Link href="/planner" className="panel-link justify-end mt-2">
                All subjects <ArrowUpRight size={12} />
              </Link>
            </section>
            <section className="panel">
              <div className="panel-heading">
                <h2>Coming up next</h2>
                <span className="eyebrow text-[8px]!">Exams</span>
              </div>
              {exams.length ? (
                exams.slice(0, 3).map((s, i) => (
                  <Link href="/planner" className="exam-row" key={s.id}>
                    <span className={`subject-icon ${i % 2 ? "gold" : ""}`}>
                      <span className="text-sm font-medium">
                        {new Date(`${s.examDate}T12:00:00`).getDate()}
                      </span>
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{s.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {new Date(`${s.examDate}T12:00:00`).toLocaleDateString(
                          "en",
                          { month: "short", day: "numeric" },
                        )}{" "}
                        ·{" "}
                        {Math.max(
                          0,
                          Math.round(
                            (Date.parse(s.examDate) - Date.parse(localDate())) /
                              86400000,
                          ),
                        )}{" "}
                        days to go
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="empty-state">
                  <Sparkles size={24} className="mb-2 text-[#9b859f]" />A clear
                  plan feels better.
                  <br />
                  Add your exam dates to see what&apos;s ahead.
                </div>
              )}
              <Link href="/planner" className="panel-link justify-end mt-2">
                See your plan <ArrowUpRight size={12} />
              </Link>
            </section>
          </div>
          <section className="panel">
            <div className="panel-heading">
              <h2>My study schedule</h2>
              <Link href="/planner" className="panel-link">
                Open planner <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="schedule-content">
              <div className="mini-calendar">
                <div className="flex items-center justify-between mb-3">
                  <button
                    aria-label="Previous month"
                    onClick={() => moveMonth(-1)}
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="text-[11px] font-medium">
                    {month.toLocaleDateString("en", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button aria-label="Next month" onClick={() => moveMonth(1)}>
                    <ChevronRight size={13} />
                  </button>
                </div>
                <div className="calendar-grid">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="text-[9px] text-muted pb-2">
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: offset }, (_, i) => (
                    <span key={`blank-${i}`} />
                  ))}
                  {Array.from({ length: days }, (_, i) => {
                    const date = localDate(
                      new Date(month.getFullYear(), month.getMonth(), i + 1),
                    );
                    return (
                      <button
                        key={date}
                        aria-label={date}
                        aria-pressed={selected === date}
                        onClick={() => setSelected(date)}
                        className={`${selected === date ? "selected" : ""} ${date === localDate() ? "today" : ""}`}
                      >
                        {i + 1}
                        {data.tasks.some((t) => t.date === date) && (
                          <i className="calendar-dot" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] text-muted">
                    {selected === localDate()
                      ? "TODAY'S LITTLE STEPS"
                      : new Date(`${selected}T12:00:00`).toLocaleDateString(
                          "en",
                          { month: "long", day: "numeric" },
                        )}
                  </p>
                  <span className="text-[10px] text-muted">
                    {tasks.length} tasks
                  </span>
                </div>
                {tasks.length ? (
                  tasks.slice(0, 4).map((t) => (
                    <label key={t.id} className="schedule-row">
                      <span className="schedule-date">
                        {new Date(`${t.date}T12:00:00`).getDate()}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-xs font-medium truncate ${t.completed ? "line-through opacity-60" : ""}`}
                        >
                          {t.title}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-muted mt-1">
                          <Clock3 size={10} />
                          {t.minutes} minutes ·{" "}
                          {data.subjects.find((s) => s.id === t.subjectId)
                            ?.name ?? "Study"}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        aria-label={`Complete ${t.title}`}
                        checked={t.completed}
                        onChange={() =>
                          update((d) => ({
                            ...d,
                            tasks: d.tasks.map((x) =>
                              x.id === t.id
                                ? { ...x, completed: !x.completed }
                                : x,
                            ),
                          }))
                        }
                      />
                    </label>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center min-h-[165px]">
                    <span className="subject-icon gold mb-3">
                      <BookOpen size={17} />
                    </span>
                    <p className="text-xs font-medium">
                      A little planning goes a long way.
                    </p>
                    <p className="text-[11px] text-muted mt-2 max-w-48">
                      Give your day a direction with a study plan.
                    </p>
                    <Link href="/planner" className="panel-link mt-4">
                      Plan this day <ArrowUpRight size={12} />
                    </Link>
                  </div>
                )}
                {tasks.length > 4 && (
                  <Link href="/planner" className="panel-link justify-end">
                    View all {tasks.length} tasks <ArrowUpRight size={12} />
                  </Link>
                )}
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <h2>A space to learn</h2>
              <span className="text-[10px] text-muted">
                Choose your next step
              </span>
            </div>
            <div className="tool-grid">
              <Link href="/notes" className="group">
                <div className="tool-art notes">
                  <div className="paper">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <FileText
                    size={16}
                    className="absolute right-5 bottom-4 text-[#7e6283]"
                  />
                </div>
                <div className="flex justify-between items-center mt-2.5">
                  <div>
                    <p className="text-xs font-medium">
                      Your notes, made clearer
                    </p>
                    <p className="text-[10px] text-muted mt-1">
                      {data.notes.length} saved notes · Notes assistant
                    </p>
                  </div>
                  <ArrowUpRight size={14} className="text-muted" />
                </div>
              </Link>
              <Link href="/focus">
                <div className="tool-art">
                  <div className="art-clock" />
                  <span className="absolute left-5 bottom-3 text-[9px] uppercase tracking-[.2em] text-[#65775e]">
                    One thing at a time
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2.5">
                  <div>
                    <p className="text-xs font-medium">A moment of focus</p>
                    <p className="text-[10px] text-muted mt-1">
                      A quiet space for your next 25 minutes
                    </p>
                  </div>
                  <ArrowUpRight size={14} className="text-muted" />
                </div>
              </Link>
            </div>
          </section>
          <div className="study-summary">
            <div>
              <p className="eyebrow text-[8px]! mb-1">Time well spent</p>
              <strong>
                {(metrics.minutes / 60).toFixed(1)}
                <span className="text-xs text-muted ml-1">focused hours</span>
              </strong>
            </div>
            <div>
              <p className="eyebrow text-[8px]! mb-1">Showing up</p>
              <strong>
                {metrics.activeDays}
                <span className="text-xs text-muted ml-1">days this week</span>
              </strong>
            </div>
            <Link href="/quiz" className="panel-link">
              Put your knowledge to the test <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
        <aside className="progress-rail" aria-label="Study progress">
          <ProgressCard
            label="Tasks completed"
            value={metrics.completion}
            color="#dfa1b4"
            detail={`${data.tasks.filter((t) => t.completed).length} of ${data.tasks.length} little steps`}
          />
          <ProgressCard
            label="Quiz accuracy"
            value={metrics.quiz}
            color="#b4d6cf"
            detail={
              data.attempts.length
                ? `${data.attempts.length} practice attempts`
                : "Your first quiz is waiting"
            }
          />
          <ProgressCard
            label="Exam readiness"
            value={metrics.readiness}
            color="#f2d68d"
            detail="A reflection of your progress"
          />
          <Link
            href="/analytics"
            className="rail-footer panel-link justify-center py-2"
          >
            See the bigger picture <ArrowUpRight size={13} />
          </Link>
          <p className="rail-footer text-[9px] text-muted text-center leading-relaxed px-2 pb-1">
            Progress, not perfection.
            <br />
            Readiness is an estimate, not a prediction.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
