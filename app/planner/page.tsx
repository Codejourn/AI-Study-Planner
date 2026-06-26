"use client";

import Sidebar from "@/components/Sidebar";
import {
  CalendarDays,
  Sparkles,
  Plus,
  Flame,
  Clock3,
} from "lucide-react";

const schedule = [
  {
    time: "9:00 AM",
    subject: "DSA",
    color: "bg-indigo-500",
  },
  {
    time: "11:00 AM",
    subject: "DBMS",
    color: "bg-green-500",
  },
  {
    time: "2:00 PM",
    subject: "Operating Systems",
    color: "bg-orange-500",
  },
  {
    time: "5:00 PM",
    subject: "Revision",
    color: "bg-pink-500",
  },
];

export default function Planner() {
  return (
    <div className="flex bg-slate-50 min-h-screen">

      <Sidebar />

      <main className="ml-64 flex-1 p-10">

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">
              Study Planner 📅
            </h1>

            <p className="text-gray-500 mt-2">
              Organize your day with AI-generated schedules.
            </p>

          </div>

          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700">

            <Sparkles size={20} />

            Generate AI Schedule

          </button>

        </div>

        {/* Top Cards */}

        <div className="grid lg:grid-cols-3 gap-6 mt-10">

          <div className="card">

            <CalendarDays className="text-indigo-600" />

            <h2 className="text-2xl font-bold mt-4">
              Today's Tasks
            </h2>

            <p className="text-5xl font-bold mt-4">
              8
            </p>

          </div>

          <div className="card">

            <Flame className="text-orange-500" />

            <h2 className="text-2xl font-bold mt-4">
              Study Streak
            </h2>

            <p className="text-5xl font-bold mt-4">
              14 🔥
            </p>

          </div>

          <div className="card">

            <Clock3 className="text-green-600" />

            <h2 className="text-2xl font-bold mt-4">
              Planned Hours
            </h2>

            <p className="text-5xl font-bold mt-4">
              6h
            </p>

          </div>

        </div>

        {/* Weekly Planner */}

        <div className="card mt-10">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-2xl font-bold">
              Today's Schedule
            </h2>

            <button className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-lg">

              <Plus size={18} />

              Add Task

            </button>

          </div>

          <div className="space-y-5">

            {schedule.map((item) => (

              <div
                key={item.time}
                className="flex justify-between items-center border rounded-xl p-5 hover:shadow-md transition"
              >

                <div className="flex gap-5 items-center">

                  <div
                    className={`w-4 h-16 rounded-full ${item.color}`}
                  />

                  <div>

                    <h3 className="text-xl font-semibold">

                      {item.subject}

                    </h3>

                    <p className="text-gray-500">

                      {item.time}

                    </p>

                  </div>

                </div>

                <button className="bg-indigo-100 text-indigo-700 px-5 py-2 rounded-lg">

                  Edit

                </button>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Upcoming */}

          <div className="card">

            <h2 className="text-2xl font-bold mb-6">
              Upcoming Deadlines
            </h2>

            <div className="space-y-4">

              <div className="border-l-4 border-red-500 pl-4">

                <h3 className="font-semibold">
                  DBMS Assignment
                </h3>

                <p className="text-gray-500">
                  Due Tomorrow
                </p>

              </div>

              <div className="border-l-4 border-yellow-500 pl-4">

                <h3 className="font-semibold">
                  CN Quiz
                </h3>

                <p className="text-gray-500">
                  2 Days Left
                </p>

              </div>

              <div className="border-l-4 border-green-500 pl-4">

                <h3 className="font-semibold">
                  OS Lab
                </h3>

                <p className="text-gray-500">
                  Friday
                </p>

              </div>

            </div>

          </div>

          {/* AI Card */}

          <div className="gradient rounded-3xl text-white p-8">

            <Sparkles size={40} />

            <h2 className="text-3xl font-bold mt-6">

              AI Recommendation

            </h2>

            <p className="mt-5 leading-8">

              Based on your progress, spend
              <strong> 90 more minutes</strong> on
              DBMS this week.

              <br />
              <br />

              Your readiness score could improve
              from <strong>78%</strong> to
              <strong>86%</strong>.

            </p>

            <button className="mt-8 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl">

              Regenerate Plan

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}