"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
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
    <AppShell
      title="Focus Mode"
      subtitle="Stay productive using the Pomodoro technique."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Clock3 className="mx-auto text-luna-100" size={24} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Focus Time
          </h2>
          <p className="text-xl font-bold mt-1">2h 35m</p>
        </div>

        <div className="card text-center">
          <Target className="mx-auto text-emerald-400" size={24} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Sessions
          </h2>
          <p className="text-xl font-bold mt-1">5</p>
        </div>

        <div className="card text-center">
          <Flame className="mx-auto text-amber-500" size={24} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Streak
          </h2>
          <p className="text-xl font-bold mt-1">14 Days</p>
        </div>

        <div className="card text-center">
          <Coffee className="mx-auto text-amber-300" size={24} />
          <h2 className="mt-2.5 text-sm font-semibold text-luna-100/60">
            Breaks
          </h2>
          <p className="text-xl font-bold mt-1">3</p>
        </div>
      </div>

      {/* Timer */}
      <div className="card mt-5 text-center py-8">
        <h2 className="text-lg font-bold">Pomodoro Timer</h2>

        <div className="mt-6 w-52 h-52 mx-auto rounded-full border-[10px] border-luna-200 flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold">
            {minutes}:{secs}
          </span>
        </div>

        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          <button
            onClick={() => setRunning(true)}
            className="bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
          >
            <Play size={15} />
            Start
          </button>

          <button
            onClick={() => setRunning(false)}
            className="bg-amber-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
          >
            <Pause size={15} />
            Pause
          </button>

          <button
            onClick={() => {
              setRunning(false);
              setSeconds(25 * 60);
            }}
            className="bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        {/* Focus Score */}
        <div className="card">
          <h2 className="text-base font-bold">Today&apos;s Focus Score</h2>

          <div className="mt-5 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-[10px] border-emerald-400 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-emerald-400">91%</h1>
                <p className="text-luna-100/60 text-xs mt-1">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Sounds */}
        <div className="card">
          <h2 className="text-base font-bold">Ambient Sounds</h2>

          <div className="grid grid-cols-2 gap-3 mt-5">
            {["🌧 Rain", "☕ Cafe", "🌲 Forest", "🌊 Ocean"].map((sound) => (
              <button
                key={sound}
                className="bg-white/5 hover:bg-white/10 border border-luna-100/10 rounded-xl py-4 text-sm font-semibold transition"
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
