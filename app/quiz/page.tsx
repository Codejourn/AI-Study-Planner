"use client";

import AppShell from "@/components/AppShell";
import { Brain, Sparkles, CheckCircle2 } from "lucide-react";

const questions = [
  {
    q: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Logic",
      "Standard Queue Language",
      "System Query Library",
    ],
  },
  {
    q: "Which normalization removes partial dependency?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
  },
];

export default function QuizPage() {
  return (
    <AppShell
      title="AI Quiz Generator"
      subtitle="Generate quizzes from uploaded notes."
    >
      <div className="flex justify-end mb-5">
        <button className="bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex gap-2 items-center hover:brightness-110 transition">
          <Sparkles size={15} />
          Generate Quiz
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Brain className="mx-auto text-luna-100" size={26} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Questions
          </h2>
          <p className="text-2xl font-bold mt-1">10</p>
        </div>

        <div className="card text-center">
          <CheckCircle2 className="mx-auto text-emerald-400" size={26} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Difficulty
          </h2>
          <p className="text-2xl font-bold mt-1">Medium</p>
        </div>

        <div className="card text-center">
          <Sparkles className="mx-auto text-amber-400" size={26} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Estimated Score
          </h2>
          <p className="text-2xl font-bold mt-1">82%</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="card">
            <h2 className="font-bold text-sm mb-4">
              Q{i + 1}. {q.q}
            </h2>

            <div className="grid gap-2.5">
              {q.options.map((option) => (
                <button
                  key={option}
                  className="border border-luna-100/10 rounded-xl px-4 py-2.5 text-sm hover:bg-white/5 hover:border-luna-100/25 text-left transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
