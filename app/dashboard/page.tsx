"use client";

import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import { tasks } from "@/lib/dummyData";
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
} from "lucide-react";

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
    <div className="flex bg-slate-50 min-h-screen">

      <Sidebar />

      <main className="ml-64 flex-1 p-10">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Good Evening 👋
            </h1>

            <p className="text-gray-500 mt-2">
              Let's make today productive.
            </p>

          </div>

          <div className="bg-indigo-600 text-white rounded-2xl px-6 py-4">

            <p className="text-sm">
              Next Exam
            </p>

            <h2 className="text-2xl font-bold mt-1">
              DBMS
            </h2>

            <p>12 Days Left</p>

          </div>

        </div>

        {/* Stats */}

        <div className="grid lg:grid-cols-4 gap-6 mt-10">

          <StatCard
            title="Subjects"
            value="6"
          />

          <StatCard
            title="Study Hours"
            value="32h"
          />

          <StatCard
            title="Tasks Done"
            value="84%"
          />

          <StatCard
            title="Readiness"
            value="78%"
          />

        </div>

        {/* Middle */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          {/* Today's Plan */}

          <div className="card lg:col-span-2">

            <div className="flex items-center gap-2 mb-6">

              <Calendar className="text-indigo-600"/>

              <h2 className="text-2xl font-bold">
                Today's Study Plan
              </h2>

            </div>

            <div className="space-y-4">

              {tasks.map((task) => (

                <div
                  key={task.subject}
                  className="flex justify-between items-center border rounded-xl p-4 hover:bg-slate-50"
                >

                  <div>

                    <h3 className="font-semibold">
                      {task.subject}
                    </h3>

                    <p className="text-gray-500">
                      {task.time}
                    </p>

                  </div>

                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Start
                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* AI Suggestion */}

          <div className="card gradient text-white">

            <Sparkles size={34}/>

            <h2 className="text-2xl font-bold mt-5">
              AI Suggestion
            </h2>

            <p className="mt-5 leading-8">

              You're spending more time on DSA.

              <br /><br />

              Increase DBMS practice this week to improve exam readiness by 8%.

            </p>

            <button className="mt-8 bg-white text-indigo-700 font-semibold px-5 py-3 rounded-xl">
              Generate New Plan
            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-3 gap-8 mt-10">

          {/* Chart */}

          <div className="card lg:col-span-2">

            <h2 className="text-2xl font-bold mb-6">
              Weekly Study Hours
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <AreaChart data={data}>

                <defs>

                  <linearGradient
                    id="colorHours"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#4F46E5"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="95%"
                      stopColor="#4F46E5"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <XAxis dataKey="day"/>

                <Tooltip/>

                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#4F46E5"
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          {/* Upcoming */}

          <div className="card">

            <div className="flex items-center gap-2">

              <Clock className="text-indigo-600"/>

              <h2 className="text-2xl font-bold">
                Upcoming Exams
              </h2>

            </div>

            <div className="space-y-5 mt-8">

              <div className="border rounded-xl p-4">

                <h3 className="font-semibold">
                  DBMS
                </h3>

                <p className="text-gray-500">
                  12 July
                </p>

              </div>

              <div className="border rounded-xl p-4">

                <h3 className="font-semibold">
                  Operating Systems
                </h3>

                <p className="text-gray-500">
                  18 July
                </p>

              </div>

              <div className="border rounded-xl p-4">

                <h3 className="font-semibold">
                  Computer Networks
                </h3>

                <p className="text-gray-500">
                  25 July
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Goal */}

        <div className="card mt-10 flex items-center justify-between">

          <div>

            <div className="flex gap-2 items-center">

              <Target className="text-green-600"/>

              <h2 className="text-2xl font-bold">
                Daily Goal
              </h2>

            </div>

            <p className="text-gray-500 mt-3">

              Complete 5 study sessions today.

            </p>

          </div>

          <div>

            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">

              <div className="text-center">

                <h1 className="text-3xl font-bold text-green-700">
                  80%
                </h1>

                <p>Done</p>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}