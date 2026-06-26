"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  NotebookPen,
  TimerReset,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: Brain,
    title: "AI Study Planner",
    desc: "Generate personalized daily and weekly schedules based on exams and free hours.",
  },
  {
    icon: NotebookPen,
    title: "Notes Assistant",
    desc: "Upload notes and ask AI questions from your own study material.",
  },
  {
    icon: TimerReset,
    title: "Focus Mode",
    desc: "Pomodoro timer with session tracking and focus score.",
  },
  {
    icon: CalendarCheck,
    title: "Task Manager",
    desc: "Manage subjects, deadlines and daily goals effortlessly.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    desc: "Track consistency, study hours and exam readiness.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    desc: "Receive recommendations to improve your preparation.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">

        {/* Hero */}

        <section className="px-10 py-24">

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
            >

              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
                🚀 AI Powered Learning
              </span>

              <h1 className="text-6xl font-extrabold mt-8 leading-tight">
                Plan Smarter.
                <br />
                Learn Better.
                <br />
                Stay Ahead.
              </h1>

              <p className="text-gray-600 text-lg mt-8 leading-8">
                FocusGeek is your AI-powered study planner that creates smart
                schedules, tracks your progress, manages notes, and helps you
                stay exam-ready.
              </p>

              <div className="flex gap-5 mt-10">

                <Link
                  href="/dashboard"
                  className="px-7 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                  Get Started
                </Link>

                <button className="px-7 py-4 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
                  Live Demo
                </button>

              </div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >

              <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-3xl p-10 text-white shadow-2xl">

                <h2 className="text-3xl font-bold">
                  Today's Progress
                </h2>

                <div className="grid grid-cols-2 gap-5 mt-8">

                  <div className="bg-white/20 rounded-2xl p-5">
                    <p>Study Hours</p>
                    <h1 className="text-4xl font-bold mt-2">5.5h</h1>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-5">
                    <p>Tasks Done</p>
                    <h1 className="text-4xl font-bold mt-2">8/10</h1>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-5">
                    <p>Focus Score</p>
                    <h1 className="text-4xl font-bold mt-2">91%</h1>
                  </div>

                  <div className="bg-white/20 rounded-2xl p-5">
                    <p>Readiness</p>
                    <h1 className="text-4xl font-bold mt-2">78%</h1>
                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        {/* Features */}

        <section className="bg-white py-24">

          <div className="max-w-7xl mx-auto px-10">

            <h2 className="text-4xl font-bold text-center">
              Everything You Need
            </h2>

            <p className="text-center text-gray-500 mt-4">
              Designed to simplify your academic journey.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    whileHover={{ y: -8 }}
                    key={feature.title}
                    className="card"
                  >
                    <Icon
                      size={40}
                      className="text-indigo-600 mb-5"
                    />

                    <h3 className="text-2xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="text-gray-500 mt-4 leading-7">
                      {feature.desc}
                    </p>

                  </motion.div>
                );
              })}

            </div>

          </div>

        </section>

        {/* Workflow */}

        <section className="py-24 px-10">

          <div className="max-w-7xl mx-auto">

            <h2 className="text-4xl font-bold text-center">
              How FocusGeek Works
            </h2>

            <div className="grid lg:grid-cols-5 gap-6 mt-16">

              {[
                "Login",
                "Add Subjects",
                "Generate AI Plan",
                "Track Progress",
                "Analyze Performance",
              ].map((step, index) => (
                <div
                  key={step}
                  className="card text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto text-xl font-bold">
                    {index + 1}
                  </div>

                  <h3 className="font-bold mt-6 text-xl">
                    {step}
                  </h3>
                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="px-10 pb-24">

          <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white p-16 text-center">

            <h2 className="text-5xl font-bold">
              Ready to Study Smarter?
            </h2>

            <p className="mt-6 text-lg opacity-90">
              Organize your studies, stay productive, and achieve your goals
              with AI-powered planning.
            </p>

            <Link
              href="/dashboard"
              className="inline-block mt-10 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
            >
              Launch Dashboard
            </Link>

          </div>

        </section>

      </main>
    </>
  );
}