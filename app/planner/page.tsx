"use client";

import AppShell from "@/components/AppShell";
import {
  CalendarDays,
  Sparkles,
  Plus,
  Flame,
  Clock3,
} from "lucide-react";

const schedule = [
  { time: "9:00 AM", subject: "DSA", color: "bg-luna-200" },
  { time: "11:00 AM", subject: "DBMS", color: "bg-emerald-500" },
  { time: "2:00 PM", subject: "Operating Systems", color: "bg-amber-500" },
  { time: "5:00 PM", subject: "Revision", color: "bg-pink-500" },
];

export default function Planner() {
  return (
    <AppShell
      title="Study Planner"
      subtitle="Organize your day with AI-generated schedules."
    >
      <div className="flex justify-end mb-5">
        <button className="flex items-center gap-2 bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:brightness-110 transition">
          <Sparkles size={15} />
          Generate AI Schedule
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <CalendarDays size={20} className="text-luna-100" />
          <h2 className="text-sm font-semibold mt-2.5 text-luna-100/60">
            Today&apos;s Tasks
          </h2>
          <p className="text-2xl font-bold mt-1">8</p>
        </div>

        <div className="card">
          <Flame size={20} className="text-amber-500" />
          <h2 className="text-sm font-semibold mt-2.5 text-luna-100/60">
            Study Streak
          </h2>
          <p className="text-2xl font-bold mt-1">14 🔥</p>
        </div>

        <div className="card">
          <Clock3 size={20} className="text-emerald-400" />
          <h2 className="text-sm font-semibold mt-2.5 text-luna-100/60">
            Planned Hours
          </h2>
          <p className="text-2xl font-bold mt-1">6h</p>
        </div>
      </div>

      {/* Weekly Planner */}
      <div className="card mt-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold">Today&apos;s Schedule</h2>

          <button className="flex gap-1.5 items-center bg-white/5 border border-luna-100/10 text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-white/10 transition">
            <Plus size={14} />
            Add Task
          </button>
        </div>

        <div className="space-y-2.5">
          {schedule.map((item) => (
            <div
              key={item.time}
              className="flex justify-between items-center border border-luna-100/10 rounded-xl px-4 py-3 hover:bg-white/5 transition"
            >
              <div className="flex gap-4 items-center">
                <div className={`w-2.5 h-10 rounded-full ${item.color}`} />

                <div>
                  <h3 className="text-sm font-semibold">{item.subject}</h3>
                  <p className="text-luna-100/50 text-xs mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>

              <button className="bg-luna-100/10 text-luna-100 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-luna-100/20 transition">
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Upcoming */}
        <div className="card">
          <h2 className="text-base font-bold mb-3">Upcoming Deadlines</h2>

          <div className="space-y-3">
            <div className="border-l-4 border-red-400 pl-3">
              <h3 className="text-sm font-semibold">DBMS Assignment</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">Due Tomorrow</p>
            </div>

            <div className="border-l-4 border-amber-400 pl-3">
              <h3 className="text-sm font-semibold">CN Quiz</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">2 Days Left</p>
            </div>

            <div className="border-l-4 border-emerald-400 pl-3">
              <h3 className="text-sm font-semibold">OS Lab</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">Friday</p>
            </div>
          </div>
        </div>

        {/* AI Card */}
        <div className="gradient rounded-2xl text-white p-5">
          <Sparkles size={26} />

          <h2 className="text-base font-bold mt-3">AI Recommendation</h2>

          <p className="mt-2.5 text-sm leading-6 text-white/90">
            Based on your progress, spend <strong>90 more minutes</strong> on
            DBMS this week. Your readiness score could improve from{" "}
            <strong>78%</strong> to <strong>86%</strong>.
          </p>

          <button className="mt-4 bg-white text-luna-400 text-sm font-semibold px-4 py-2 rounded-full">
            Regenerate Plan
          </button>
        </div>
      </div>
    </AppShell>
  );
}
