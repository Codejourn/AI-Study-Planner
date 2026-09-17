export interface Subject {
  id: string;
  name: string;
  examDate: string;
  priority: number;
}
export interface Task {
  id: string;
  subjectId: string;
  title: string;
  date: string;
  minutes: number;
  completed: boolean;
}
export interface FocusSession {
  id: string;
  subjectId: string;
  minutes: number;
  completedAt: string;
}
export interface QuizAttempt {
  id: string;
  subjectId: string;
  correct: number;
  total: number;
  completedAt: string;
}
export interface Note {
  id: string;
  name: string;
  content: string;
}
export interface StudyData {
  subjects: Subject[];
  tasks: Task[];
  sessions: FocusSession[];
  attempts: QuizAttempt[];
  notes: Note[];
  dailyHours: number;
}
export const emptyStudy: StudyData = {
  subjects: [],
  tasks: [],
  sessions: [],
  attempts: [],
  notes: [],
  dailyHours: 2,
};
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function generatePlan(data: StudyData, today = localDate()): Task[] {
  const subjects = data.subjects
    .filter((s) => s.examDate >= today)
    .sort((a, b) => {
      const urgency = (s: Subject) =>
        s.priority /
        Math.max(1, (Date.parse(s.examDate) - Date.parse(today)) / 86400000);
      return urgency(b) - urgency(a);
    });
  const completedMinutes = data.tasks
    .filter((t) => t.date === today && t.completed)
    .reduce((sum, t) => sum + t.minutes, 0);
  let remaining = Math.max(
    0,
    Math.round(data.dailyHours * 60) - completedMinutes,
  );
  const plan: Task[] = [];
  let index = 0;
  while (subjects.length && remaining > 0) {
    const subject = subjects[index % subjects.length];
    const minutes = Math.min(50, remaining);
    plan.push({
      id: crypto.randomUUID(),
      subjectId: subject.id,
      title: `Study ${subject.name}`,
      date: today,
      minutes,
      completed: false,
    });
    remaining -= minutes;
    index++;
  }
  return plan;
}
export function studyMetrics(data: StudyData, today = localDate()) {
  const minutes = data.sessions.reduce((sum, s) => sum + s.minutes, 0);
  const completion = data.tasks.length
    ? data.tasks.filter((t) => t.completed).length / data.tasks.length
    : 0;
  const totalQuestions = data.attempts.reduce((sum, a) => sum + a.total, 0);
  const quiz = totalQuestions
    ? data.attempts.reduce((sum, a) => sum + a.correct, 0) / totalQuestions
    : 0;
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - (6 - i));
    const key = localDate(date);
    return {
      day: date.toLocaleDateString("en", { weekday: "short" }),
      date: key,
      hours: Number(
        (
          data.sessions
            .filter((s) => localDate(new Date(s.completedAt)) === key)
            .reduce((sum, s) => sum + s.minutes, 0) / 60
        ).toFixed(2),
      ),
    };
  });
  const activeDays = weekly.filter((d) => d.hours > 0).length;
  const weeklyMinutes = weekly.reduce((sum, d) => sum + d.hours * 60, 0);
  const hoursGoal = Math.min(1, weeklyMinutes / (data.dailyHours * 60 * 7));
  const readiness = Math.round(
    40 * completion + 35 * quiz + 15 * hoursGoal + (10 * activeDays) / 7,
  );
  const dates = new Set(
    data.sessions.map((s) => localDate(new Date(s.completedAt))),
  );
  const cursor = new Date(`${today}T12:00:00`);
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (dates.has(localDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return {
    minutes,
    completion: Math.round(completion * 100),
    quiz: Math.round(quiz * 100),
    readiness,
    weekly,
    activeDays,
    streak,
  };
}
// Validate browser data before using it; malformed storage must not break the app.
export function isStudyData(value: unknown): value is StudyData {
  if (!value || typeof value !== "object") return false;
  const d = value as StudyData;
  const str = (v: unknown) => typeof v === "string";
  const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  return (
    num(d.dailyHours) &&
    d.dailyHours >= 0.5 &&
    d.dailyHours <= 12 &&
    Array.isArray(d.subjects) &&
    d.subjects.every(
      (s) =>
        s &&
        str(s.id) &&
        str(s.name) &&
        /^\d{4}-\d{2}-\d{2}$/.test(s.examDate) &&
        num(s.priority) &&
        s.priority >= 1 &&
        s.priority <= 3,
    ) &&
    Array.isArray(d.tasks) &&
    d.tasks.every(
      (t) =>
        t &&
        str(t.id) &&
        str(t.subjectId) &&
        str(t.title) &&
        str(t.date) &&
        num(t.minutes) &&
        t.minutes > 0 &&
        typeof t.completed === "boolean",
    ) &&
    Array.isArray(d.sessions) &&
    d.sessions.every(
      (s) =>
        s &&
        str(s.id) &&
        str(s.subjectId) &&
        num(s.minutes) &&
        s.minutes > 0 &&
        str(s.completedAt) &&
        Number.isFinite(Date.parse(s.completedAt)),
    ) &&
    Array.isArray(d.attempts) &&
    d.attempts.every(
      (a) =>
        a &&
        str(a.id) &&
        str(a.subjectId) &&
        num(a.correct) &&
        num(a.total) &&
        a.total > 0 &&
        a.correct >= 0 &&
        a.correct <= a.total &&
        str(a.completedAt),
    ) &&
    Array.isArray(d.notes) &&
    d.notes.every((n) => n && str(n.id) && str(n.name) && str(n.content))
  );
}
