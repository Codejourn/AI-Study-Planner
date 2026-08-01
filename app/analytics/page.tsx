"use client";

import AppShell from "@/components/AppShell";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const weekly = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 4 },
  { day: "Wed", hours: 3 },
  { day: "Thu", hours: 5 },
  { day: "Fri", hours: 4 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 3 },
];

const pie = [
  { name: "Completed", value: 78 },
  { name: "Remaining", value: 22 },
];

const COLORS = ["#54ACBF", "rgba(167,235,242,0.15)"];

export default function Analytics() {
  return (
    <AppShell
      title="Analytics"
      subtitle="Monitor your study habits and readiness."
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <h2 className="text-sm font-semibold text-luna-100/60">
            Study Hours
          </h2>
          <p className="text-2xl font-bold mt-2">32h</p>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-luna-100/60">
            Focus Score
          </h2>
          <p className="text-2xl font-bold mt-2">91%</p>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-luna-100/60">
            Exam Readiness
          </h2>
          <p className="text-2xl font-bold mt-2 text-emerald-400">78%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <div className="card">
          <h2 className="text-base font-bold mb-3">Weekly Study Hours</h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
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
              <Bar dataKey="hours" fill="#54ACBF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-bold mb-3">Readiness</h2>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pie}
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
              >
                {pie.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#023859",
                  border: "1px solid rgba(167,235,242,0.2)",
                  borderRadius: 12,
                  color: "#EAF6FB",
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center">
            <h1 className="text-2xl font-bold">78%</h1>
            <p className="text-luna-100/60 text-xs">Course Completed</p>
          </div>
        </div>
      </div>

      <div className="card mt-5">
        <h2 className="text-base font-bold mb-3">AI Insights</h2>

        <ul className="space-y-2.5 text-sm text-luna-100/80">
          <li>✅ You&apos;re studying consistently 5 days a week.</li>
          <li>📈 Increase DBMS practice by 2 hours.</li>
          <li>🎯 Complete CN revision before Friday.</li>
          <li>🔥 Maintain your 14-day study streak.</li>
        </ul>
      </div>
    </AppShell>
  );
}
