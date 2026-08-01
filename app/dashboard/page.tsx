"use client";

import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { tasks } from "@/lib/dummyData";
import { Calendar, Clock, Sparkles, BookOpen, Flame, Target } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 3 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 4 },
];

export default function Dashboard() {
  return (
    <AppShell title="Dashboard" subtitle="Let's make today productive.">
      {/* Hero */}
      <div className="card flex items-center justify-between gap-6 flex-wrap bg-linear-to-br from-luna-300/60 to-luna-400/60">
        <div>
          <h2 className="text-xl font-bold">Good Evening 👋</h2>
          <p className="text-luna-100/60 text-sm mt-1">
            You have 3 sessions planned today.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:brightness-110 transition">
          <Sparkles size={15} />
          Generate New Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        <StatCard
          icon={BookOpen}
          iconClass="bg-luna-300"
          title="Subjects"
          value="6"
          delta="+1 this week"
        />
        <StatCard
          icon={Clock}
          iconClass="bg-rose-500"
          title="Study Hours"
          value="32h"
          delta="+6.2 this week"
        />
        <StatCard
          icon={Target}
          iconClass="bg-amber-500"
          title="Tasks Done"
          value="84%"
          delta="+8% this week"
        />
        <StatCard
          icon={Flame}
          iconClass="bg-luna-200"
          title="Readiness"
          value="78%"
          delta="+3% this week"
        />
      </div>

      {/* Middle */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        {/* Today's Plan */}
        <div className="card lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={17} className="text-luna-100" />
            <h2 className="text-base font-bold">Today&apos;s Study Plan</h2>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.subject}
                className="flex justify-between items-center border border-luna-100/10 rounded-xl px-4 py-3 hover:bg-white/5 transition"
              >
                <div>
                  <h3 className="font-semibold text-sm">{task.subject}</h3>
                  <p className="text-luna-100/50 text-xs mt-0.5">
                    {task.time}
                  </p>
                </div>

                <button className="bg-emerald-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="card gradient text-white">
          <Sparkles size={26} />
          <h2 className="text-base font-bold mt-3">AI Suggestion</h2>

          <p className="mt-3 text-sm leading-6 text-white/90">
            You&apos;re spending more time on DSA. Increase DBMS practice this
            week to improve exam readiness by 8%.
          </p>

          <button className="mt-4 bg-white text-luna-400 text-sm font-semibold px-4 py-2 rounded-full">
            Generate New Plan
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-3 gap-5 mt-5">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-base font-bold mb-3">Weekly Study Hours</h2>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#54ACBF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#54ACBF" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="day"
                stroke="#A7EBF2"
                opacity={0.5}
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  background: "#023859",
                  border: "1px solid rgba(167,235,242,0.2)",
                  borderRadius: 12,
                  color: "#EAF6FB",
                  fontSize: 12,
                }}
              />

              <Area
                type="monotone"
                dataKey="hours"
                stroke="#54ACBF"
                fillOpacity={1}
                fill="url(#colorHours)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={17} className="text-luna-100" />
            <h2 className="text-base font-bold">Upcoming Exams</h2>
          </div>

          <div className="space-y-2.5">
            <div className="border border-luna-100/10 rounded-xl px-4 py-2.5">
              <h3 className="font-semibold text-sm">DBMS</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">12 July</p>
            </div>

            <div className="border border-luna-100/10 rounded-xl px-4 py-2.5">
              <h3 className="font-semibold text-sm">Operating Systems</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">18 July</p>
            </div>

            <div className="border border-luna-100/10 rounded-xl px-4 py-2.5">
              <h3 className="font-semibold text-sm">Computer Networks</h3>
              <p className="text-luna-100/50 text-xs mt-0.5">25 July</p>
            </div>
          </div>
        </div>
      </div>

      {/* Goal */}
      <div className="card mt-5 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex gap-2 items-center">
            <Target size={16} className="text-emerald-400" />
            <h2 className="text-base font-bold">Daily Goal</h2>
          </div>

          <p className="text-luna-100/60 text-sm mt-1.5">
            Complete 5 study sessions today.
          </p>
        </div>

        <div className="w-20 h-20 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-emerald-400">80%</h1>
            <p className="text-[10px] text-luna-100/60">Done</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
