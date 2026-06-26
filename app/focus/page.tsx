"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Clock3,
  Target,
  Coffee,
} from "lucide-react";

export default function FocusPage() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (running && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [running, seconds]);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="ml-64 flex-1 p-10">

        <h1 className="text-4xl font-bold">
          Focus Mode 🎯
        </h1>

        <p className="text-gray-500 mt-2">
          Stay productive using the Pomodoro technique.
        </p>

        {/* Stats */}

        <div className="grid lg:grid-cols-4 gap-6 mt-10">

          <div className="card text-center">

            <Clock3
              className="mx-auto text-indigo-600"
              size={35}
            />

            <h2 className="mt-4 text-xl font-semibold">
              Focus Time
            </h2>

            <p className="text-3xl font-bold mt-2">
              2h 35m
            </p>

          </div>

          <div className="card text-center">

            <Target
              className="mx-auto text-green-600"
              size={35}
            />

            <h2 className="mt-4 text-xl font-semibold">
              Sessions
            </h2>

            <p className="text-3xl font-bold mt-2">
              5
            </p>

          </div>

          <div className="card text-center">

            <Flame
              className="mx-auto text-orange-500"
              size={35}
            />

            <h2 className="mt-4 text-xl font-semibold">
              Streak
            </h2>

            <p className="text-3xl font-bold mt-2">
              14 Days
            </p>

          </div>

          <div className="card text-center">

            <Coffee
              className="mx-auto text-yellow-600"
              size={35}
            />

            <h2 className="mt-4 text-xl font-semibold">
              Breaks
            </h2>

            <p className="text-3xl font-bold mt-2">
              3
            </p>

          </div>

        </div>

        {/* Timer */}

        <div className="card mt-10 text-center">

          <h2 className="text-3xl font-bold">
            Pomodoro Timer
          </h2>

          <div className="mt-10 w-72 h-72 mx-auto rounded-full border-[14px] border-indigo-500 flex items-center justify-center shadow-lg">

            <span className="text-6xl font-bold">
              {minutes}:{secs}
            </span>

          </div>

          <div className="flex justify-center gap-5 mt-10">

            <button
              onClick={() => setRunning(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Play size={18} />
              Start
            </button>

            <button
              onClick={() => setRunning(false)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Pause size={18} />
              Pause
            </button>

            <button
              onClick={() => {
                setRunning(false);
                setSeconds(25 * 60);
              }}
              className="bg-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* Focus Score */}

          <div className="card">

            <h2 className="text-2xl font-bold">
              Today's Focus Score
            </h2>

            <div className="mt-8 flex items-center justify-center">

              <div className="w-52 h-52 rounded-full border-[14px] border-green-500 flex items-center justify-center">

                <div className="text-center">

                  <h1 className="text-5xl font-bold text-green-600">
                    91%
                  </h1>

                  <p className="text-gray-500 mt-2">
                    Excellent
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Ambient Sounds */}

          <div className="card">

            <h2 className="text-2xl font-bold">
              Ambient Sounds
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-8">

              {[
                "🌧 Rain",
                "☕ Cafe",
                "🌲 Forest",
                "🌊 Ocean",
              ].map((sound) => (

                <button
                  key={sound}
                  className="bg-indigo-50 hover:bg-indigo-100 rounded-xl p-6 font-semibold"
                >
                  {sound}
                </button>

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}