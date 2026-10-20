"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { calendarEvents, localDate } from "@/lib/study";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const displayDate = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export default function CalendarPage() {
  const { data, update } = useStudy();
  const today = localDate();
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [subjectId, setSubjectId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const events = calendarEvents(data);
  const byDate = new Map<string, typeof events>();
  for (const event of events) byDate.set(event.date, [...(byDate.get(event.date) ?? []), event]);
  const selectedEvents = byDate.get(selected) ?? [];
  const upcoming = events.filter((event) => event.date >= today && !event.completed);
  const overdue = events.filter((event) => event.type === "deadline" && event.date < today && !event.completed);
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  function moveMonth(amount: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }
  function selectDate(day: string) {
    setSelected(day);
    setDate(day);
  }
  function saveDeadline(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !date) return;
    update((current) => ({
      ...current,
      deadlines: editingId
        ? (current.deadlines ?? []).map((deadline) =>
            deadline.id === editingId
              ? { ...deadline, title: title.trim(), date, subjectId }
              : deadline,
          )
        : [...(current.deadlines ?? []), { id: crypto.randomUUID(), title: title.trim(), date, subjectId, completed: false }],
    }));
    setSelected(date);
    const chosenDate = new Date(`${date}T12:00:00`);
    setMonth(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), 1));
    setTitle("");
    setEditingId(null);
  }
  function editDeadline(id: string) {
    const deadline = data.deadlines?.find((item) => item.id === id);
    if (!deadline) return;
    setEditingId(id);
    setTitle(deadline.title);
    setDate(deadline.date);
    setSubjectId(deadline.subjectId);
    document.getElementById("deadline-title")?.focus();
  }
  function toggleDeadline(id: string) {
    update((current) => ({ ...current, deadlines: (current.deadlines ?? []).map((item) => item.id === id ? { ...item, completed: !item.completed } : item) }));
  }
  function deleteDeadline(id: string) {
    update((current) => ({ ...current, deadlines: (current.deadlines ?? []).filter((item) => item.id !== id) }));
    if (editingId === id) { setEditingId(null); setTitle(""); }
  }

  return (
    <AppShell title="Calendar" subtitle="Keep exams and deadlines in one place.">
      <div className="calendar-page-grid">
        <section className="panel calendar-main" aria-label="Monthly calendar">
          <div className="panel-heading calendar-heading">
            <div>
              <p className="eyebrow text-[9px]!">Your semester at a glance</p>
              <h2 className="calendar-month-title">{month.toLocaleDateString("en", { month: "long", year: "numeric" })}</h2>
            </div>
            <div className="calendar-controls">
              <button type="button" onClick={() => { setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); selectDate(today); }}>Today</button>
              <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}><ChevronLeft size={18} /></button>
              <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="calendar-legend"><span className="calendar-event-pill exam">Exam</span><span className="calendar-event-pill deadline">Deadline</span></div>
          <div className="full-calendar-grid">
            {weekdays.map((day) => <span className="calendar-weekday" key={day}>{day}</span>)}
            {Array.from({ length: firstDay }, (_, index) => <span className="calendar-empty" key={`empty-${index}`} />)}
            {Array.from({ length: days }, (_, index) => {
              const day = localDate(new Date(month.getFullYear(), month.getMonth(), index + 1));
              const dayEvents = byDate.get(day) ?? [];
              return (
                <button type="button" key={day} className={`calendar-day ${selected === day ? "selected" : ""} ${day === today ? "today" : ""}`} aria-label={`${displayDate(day)}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`} aria-pressed={selected === day} onClick={() => selectDate(day)}>
                  <span className="calendar-day-number">{index + 1}</span>
                  <span className="calendar-day-events">
                    {dayEvents.slice(0, 2).map((item) => <span key={item.id} className={`calendar-day-event ${item.type} ${item.completed ? "completed" : ""}`}>{item.title}</span>)}
                    {dayEvents.length > 2 && <span className="calendar-day-more">+{dayEvents.length - 2} more</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <aside className="calendar-side">
          <section className="panel">
            <div className="panel-heading"><h2>{displayDate(selected)}</h2><CalendarDays size={17} className="text-[#8a718e]" /></div>
            {selectedEvents.length ? selectedEvents.map((event) => (
              <div className="calendar-event-row" key={event.id}>
                <span className={`calendar-event-pill ${event.type}`}>{event.type === "exam" ? "Exam" : "Due"}</span>
                <div className="min-w-0 flex-1"><p className={event.completed ? "line-through opacity-60" : ""}>{event.title}</p><p className="text-[11px] text-muted">{event.subject}</p></div>
                {event.type === "deadline" && <div className="calendar-event-actions"><button type="button" onClick={() => editDeadline(event.id.slice(9))}>Edit</button><button type="button" onClick={() => toggleDeadline(event.id.slice(9))}>{event.completed ? "Reopen" : "Done"}</button><button type="button" onClick={() => deleteDeadline(event.id.slice(9))}>Delete</button></div>}
              </div>
            )) : <p className="text-sm text-muted py-4">Nothing scheduled for this day.</p>}
          </section>
          <form className="panel space-y-3" onSubmit={saveDeadline}>
            <div className="panel-heading"><h2>{editingId ? "Edit deadline" : "Add a deadline"}</h2><Plus size={17} className="text-[#8a718e]" /></div>
            <label className="block text-sm">Assignment or project<input id="deadline-title" className="field" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Lab report submission" /></label>
            <label className="block text-sm">Due date<input className="field" type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label className="block text-sm">Subject (optional)<select className="field" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}><option value="">General</option>{data.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
            <div className="flex items-center gap-3"><button className="action" type="submit">{editingId ? "Save changes" : "Add deadline"}</button>{editingId && <button type="button" className="text-sm text-muted" onClick={() => { setEditingId(null); setTitle(""); }}>Cancel</button>}</div>
          </form>
          <section className="panel">
            <div className="panel-heading"><h2>Coming up</h2><span className="text-xs text-muted">{upcoming.length} events</span></div>
            {overdue.length > 0 && <p className="text-xs text-[#a25850] mb-2">{overdue.length} overdue deadline{overdue.length === 1 ? "" : "s"}</p>}
            {upcoming.length ? upcoming.map((event) => <button type="button" className="calendar-upcoming-row" key={event.id} onClick={() => { const eventDate = new Date(`${event.date}T12:00:00`); setMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1)); selectDate(event.date); }}><span className={`calendar-event-pill ${event.type}`}>{event.type === "exam" ? "Exam" : "Due"}</span><span className="min-w-0 flex-1 text-left"><strong className="block truncate">{event.title}</strong><small className="text-muted">{displayDate(event.date)}</small></span></button>) : <p className="text-sm text-muted py-3">No upcoming exams or deadlines. Add an exam in <Link href="/planner" className="underline">Planner</Link> or a deadline here.</p>}
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
