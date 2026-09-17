"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { generatePlan, localDate, Subject, Task } from "@/lib/study";
import { apiRequest } from "@/lib/api";

export default function Planner() {
  const { data, update, cloud } = useStudy();
  const [generating, setGenerating] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [priority, setPriority] = useState(2);
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState(localDate());
  const [minutes, setMinutes] = useState(30);
  const [notice, setNotice] = useState("");
  const today = localDate();
  function saveSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || examDate < today) return;
    const subject: Subject = {
      id: editing ?? crypto.randomUUID(),
      name: name.trim(),
      examDate,
      priority,
    };
    update((d) => ({
      ...d,
      subjects: editing
        ? d.subjects.map((s) => (s.id === editing ? subject : s))
        : [...d.subjects, subject],
    }));
    setEditing(null);
    setName("");
    setExamDate("");
  }
  function saveTask(e: React.FormEvent) {
    e.preventDefault();
    const selected = subjectId || data.subjects[0]?.id;
    if (!selected || !title.trim()) return;
    update((d) => ({
      ...d,
      tasks: [
        ...d.tasks,
        {
          id: crypto.randomUUID(),
          subjectId: selected,
          title: title.trim(),
          date,
          minutes,
          completed: false,
        },
      ],
    }));
    setTitle("");
  }
  async function schedule() {
    setGenerating(true);
    try {
      const plan = cloud
        ? (
            await apiRequest<{ tasks: Task[] }>("/planner/generate", {
              data,
              today,
            })
          ).tasks
        : generatePlan(data);
      if (!plan.length) {
        setNotice(
          "No study time remains, or no upcoming exams were found. Check your subjects and daily hours.",
        );
        return;
      }
      update((d) => ({
        ...d,
        tasks: [
          ...d.tasks.filter((t) => t.date !== today || t.completed),
          ...plan,
        ],
      }));
      setNotice(
        cloud
          ? "Bedrock generated your study plan. Save to cloud to keep it across devices."
          : "Today's unfinished tasks were replaced with a deadline-based plan. This local scheduler does not use AI.",
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not generate a schedule.",
      );
    } finally {
      setGenerating(false);
    }
  }
  return (
    <AppShell
      title="Study Planner"
      subtitle="Add your subjects, deadlines, and daily study time."
    >
      {notice && (
        <p role="status" className="mb-4 text-sm text-luna-100">
          {notice}
        </p>
      )}
      <div className="grid lg:grid-cols-2 gap-5">
        <form className="card space-y-3" onSubmit={saveSubject}>
          <h2 className="font-bold">
            {editing ? "Edit subject" : "Add subject"}
          </h2>
          <label className="block text-sm">
            Subject name
            <input
              className="field"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Exam date
            <input
              className="field"
              type="date"
              required
              min={today}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Priority
            <select
              className="field"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </label>
          <button className="action">Save subject</button>
          {editing && (
            <button
              type="button"
              className="ml-3 text-sm"
              onClick={() => {
                setEditing(null);
                setName("");
                setExamDate("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <div className="card space-y-3">
          <h2 className="font-bold">Your subjects</h2>
          {!data.subjects.length && (
            <p className="text-sm text-muted">
              Add your first subject to start planning.
            </p>
          )}
          {data.subjects.map((s) => (
            <div
              key={s.id}
              className="border-b border-luna-100/10 pb-3 flex justify-between gap-3"
            >
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted">
                  Exam: {s.examDate} ·{" "}
                  {["", "Low", "Medium", "High"][s.priority]} priority
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => {
                    setEditing(s.id);
                    setName(s.name);
                    setExamDate(s.examDate);
                    setPriority(s.priority);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-700"
                  onClick={() =>
                    update((d) => ({
                      ...d,
                      subjects: d.subjects.filter((x) => x.id !== s.id),
                      tasks: d.tasks.filter((t) => t.subjectId !== s.id),
                    }))
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          <label className="block text-sm">
            Available hours per day
            <input
              type="number"
              min={0.5}
              max={12}
              step={0.5}
              className="field"
              value={data.dailyHours}
              onChange={(e) => {
                const hours = Number(e.target.value);
                if (hours >= 0.5 && hours <= 12)
                  update((d) => ({ ...d, dailyHours: hours }));
              }}
            />
          </label>
          <button
            className="action"
            onClick={() => void schedule()}
            disabled={generating || !data.subjects.length}
          >
            {generating
              ? "Generating..."
              : cloud
                ? "Generate AI schedule"
                : "Generate local schedule"}
          </button>
          <p className="text-xs text-muted">
            Prioritizes closer exams and higher priorities within your daily
            time budget. Completed tasks are preserved.
          </p>
        </div>
      </div>
      <form onSubmit={saveTask} className="card mt-5 space-y-3">
        <h2 className="font-bold">Add a task</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="text-sm">
            Task
            <input
              className="field"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Subject
            <select
              className="field"
              required
              value={subjectId || data.subjects[0]?.id || ""}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="" disabled>
                Select subject
              </option>
              {data.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Date
            <input
              className="field"
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Minutes
            <input
              className="field"
              required
              type="number"
              min={5}
              max={720}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            />
          </label>
        </div>
        <button className="action" disabled={!data.subjects.length}>
          Add task
        </button>
      </form>
      <div className="card mt-5 space-y-3">
        <h2 className="font-bold">Study tasks</h2>
        {!data.tasks.length && (
          <p className="text-sm text-muted">
            Generate a plan or add your own task.
          </p>
        )}
        {[...data.tasks]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 border-b border-luna-100/10 pb-3"
            >
              <input
                type="checkbox"
                aria-label={`Complete ${t.title}`}
                checked={t.completed}
                onChange={() =>
                  update((d) => ({
                    ...d,
                    tasks: d.tasks.map((x) =>
                      x.id === t.id ? { ...x, completed: !x.completed } : x,
                    ),
                  }))
                }
              />
              <div className="flex-1">
                <p className={t.completed ? "line-through opacity-50" : ""}>
                  {t.title}
                </p>
                <p className="text-xs text-muted">
                  {t.date} · {t.minutes} minutes
                </p>
              </div>
              <button
                className="text-sm text-red-700"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    tasks: d.tasks.filter((x) => x.id !== t.id),
                  }))
                }
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </AppShell>
  );
}
