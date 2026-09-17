"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { apiRequest } from "@/lib/api";
const sample = [
  {
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Logic",
      "Standard Queue Language",
      "System Query Library",
    ],
    answer: 0,
    explanation:
      "SQL means Structured Query Language and is used to query relational databases.",
  },
  {
    question:
      "Which normal form removes partial dependencies on a composite key?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 1,
    explanation:
      "Second normal form requires every non-key attribute to depend on the entire candidate key.",
  },
  {
    question: "Which SQL clause filters groups after aggregation?",
    options: ["WHERE", "ORDER BY", "HAVING", "SELECT"],
    answer: 2,
    explanation:
      "HAVING filters grouped results. WHERE filters rows before grouping.",
  },
];
export default function QuizPage() {
  const { data, update, cloud } = useStudy();
  const [questions, setQuestions] = useState(sample);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [noteId, setNoteId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  async function start() {
    setGenerating(true);
    setError("");
    try {
      const generated = cloud
        ? (
            await apiRequest<{ questions: typeof sample }>("/quiz/generate", {
              subject: data.subjects.find((s) => s.id === subjectId)?.name,
              count,
              difficulty,
              content:
                data.notes
                  .find((n) => n.id === noteId)
                  ?.content.slice(0, 20000) ?? "",
            })
          ).questions
        : sample;
      setQuestions(generated);
      setStarted(true);
      setAnswers({});
      setScore(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quiz generation failed.");
    } finally {
      setGenerating(false);
    }
  }
  function submit() {
    if (score !== null || Object.keys(answers).length !== questions.length)
      return;
    const correct = questions.filter((q, i) => q.answer === answers[i]).length;
    setScore(correct);
    update((d) => ({
      ...d,
      attempts: [
        ...d.attempts,
        {
          id: crypto.randomUUID(),
          subjectId,
          correct,
          total: questions.length,
          completedAt: new Date().toISOString(),
        },
      ],
    }));
  }
  return (
    <AppShell
      title="Quiz Generator"
      subtitle="Test your knowledge and record your results."
    >
      <div className="card space-y-4">
        <h2 className="font-bold">
          {cloud ? "Generate a study quiz" : "DBMS practice quiz"}
        </h2>
        <p className="text-sm text-muted">
          {cloud
            ? "Bedrock generates questions from your subject and optional notes."
            : "A fixed 3-question DBMS practice quiz is available locally. Bedrock-generated quizzes require cloud setup."}
        </p>
        <label className="block text-sm">
          Record against subject
          <select
            className="field"
            disabled={started && score === null}
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">
              {cloud ? "Select a subject" : "Select your DBMS subject"}
            </option>
            {data.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        {cloud && (
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="text-sm">
              Questions
              <input
                className="field"
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
              />
            </label>
            <label className="text-sm">
              Difficulty
              <select
                className="field"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {["easy", "medium", "hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Source notes
              <select
                className="field"
                value={noteId}
                onChange={(e) => setNoteId(e.target.value)}
              >
                <option value="">Subject only</option>
                {data.notes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button
          className="action"
          disabled={!subjectId || generating}
          onClick={() => void start()}
        >
          {generating
            ? "Generating..."
            : cloud
              ? "Generate quiz"
              : "Start practice quiz"}
        </button>
      </div>
      {started && (
        <div className="space-y-4 mt-5">
          {questions.map((q, i) => (
            <div className="card space-y-3" key={q.question}>
              <h2 className="font-bold">
                {i + 1}. {q.question}
              </h2>
              {q.options.map((option, j) => (
                <label
                  className={`flex gap-3 rounded-xl border p-3 ${score !== null && j === q.answer ? "border-emerald-400" : "border-luna-100/10"}`}
                  key={j}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    checked={answers[i] === j}
                    disabled={score !== null}
                    onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  />
                  {option}
                </label>
              ))}
              {score !== null && (
                <p className="text-sm text-luna-100">{q.explanation}</p>
              )}
            </div>
          ))}
          {score === null ? (
            <button
              className="action"
              disabled={Object.keys(answers).length !== questions.length}
              onClick={submit}
            >
              Submit answers
            </button>
          ) : (
            <p role="status" className="card font-bold">
              Score: {score}/{questions.length}. Your result appears in
              Analytics.{cloud && " Save to cloud to keep it across devices."}
            </p>
          )}
        </div>
      )}
    </AppShell>
  );
}
