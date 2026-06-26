"use client";

import Sidebar from "@/components/Sidebar";
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1 p-10">

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              AI Quiz Generator 🧠
            </h1>

            <p className="text-gray-500 mt-2">
              Generate quizzes from uploaded notes.
            </p>

          </div>

          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex gap-2 items-center">
            <Sparkles size={18}/>
            Generate Quiz
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-10">

          <div className="card text-center">
            <Brain className="mx-auto text-indigo-600" size={35}/>
            <h2 className="mt-4 font-semibold">Questions</h2>
            <p className="text-4xl font-bold mt-2">10</p>
          </div>

          <div className="card text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={35}/>
            <h2 className="mt-4 font-semibold">Difficulty</h2>
            <p className="text-4xl font-bold mt-2">Medium</p>
          </div>

          <div className="card text-center">
            <Sparkles className="mx-auto text-yellow-500" size={35}/>
            <h2 className="mt-4 font-semibold">Estimated Score</h2>
            <p className="text-4xl font-bold mt-2">82%</p>
          </div>

        </div>

        <div className="mt-10 space-y-8">

          {questions.map((q, i) => (

            <div
              key={i}
              className="card"
            >

              <h2 className="font-bold text-xl mb-6">
                Q{i + 1}. {q.q}
              </h2>

              <div className="grid gap-4">

                {q.options.map((option) => (

                  <button
                    key={option}
                    className="border rounded-xl p-4 hover:bg-indigo-50 text-left"
                  >
                    {option}
                  </button>

                ))}

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}