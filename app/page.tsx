"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  Clock3,
  Notebook,
  Sparkles,
  Timer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
const features = [
  {
    icon: CalendarDays,
    title: "A plan that gets you",
    text: "Turn your subjects, exam dates, and available time into a study plan you can actually follow.",
  },
  {
    icon: Notebook,
    title: "Make sense of your notes",
    text: "Keep your notes together. Ask questions, find an explanation, and connect the dots.",
  },
  {
    icon: Timer,
    title: "Find your quiet moment",
    text: "One subject. One timer. Give yourself room to focus, then let the small sessions add up.",
  },
  {
    icon: Brain,
    title: "A little practice, a lot of clarity",
    text: "Test what you know with a quiz. Learn from the explanations and see where to spend your time.",
  },
  {
    icon: BookOpen,
    title: "Everything in its place",
    text: "Subjects, notes, deadlines, and tasks. A tidy home for the things on your mind.",
  },
  {
    icon: Sparkles,
    title: "See how far you've come",
    text: "Understand your study habits through focused hours, quiz results, and a readiness estimate.",
  },
];
export default function Home() {
  return (
    <div className="public-frame">
      <Navbar />
      <main>
        <section className="landing-hero">
          <div>
            <p className="eyebrow mb-6">Less overwhelm. More headspace.</p>
            <h1>
              A little structure.
              <br />
              <span className="text-[#8c6f90] italic">A lot more focus.</span>
            </h1>
            <p className="text-muted text-[15px] leading-7 mt-6 max-w-96">
              Meet your calmer study space. Plan your days, make sense of your
              notes, and turn small moments of focus into real progress.
            </p>
            <div className="flex items-center gap-6 mt-8">
              <Link href="/signup" className="action">
                Find your focus <ArrowUpRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="text-xs text-muted border-b border-[#bbaaaf] pb-1"
              >
                Take a look around
              </Link>
            </div>
            <p className="text-[10px] text-muted mt-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9db5a3]" />
              Made for real students. And real life.
            </p>
          </div>
          <div
            className="landing-preview"
            aria-label="Example FocusGeek workspace"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="eyebrow text-[8px]! mb-1">Sample workspace</p>
                <p className="text-lg font-medium tracking-tight">
                  HELLO, CURIOUS MIND!
                </p>
              </div>
              <span className="avatar w-9! h-9! text-sm!">F</span>
            </div>
            <div className="grid grid-cols-[1fr_100px] gap-3">
              <div>
                <div className="mini-calendar mb-3">
                  <p className="text-xs font-semibold mb-4">
                    Your little steps for today
                  </p>
                  {[
                    {
                      name: "Database systems",
                      time: "50 minutes",
                      done: true,
                    },
                    {
                      name: "A little revision",
                      time: "25 minutes",
                      done: false,
                    },
                    {
                      name: "Practice makes progress",
                      time: "10 questions",
                      done: false,
                    },
                  ].map((t, i) => (
                    <div
                      key={t.name}
                      className="flex items-center gap-3 py-3 border-b last:border-0 border-[#e8dfe5]"
                    >
                      <span
                        className={`subject-icon ${i === 1 ? "rose" : i === 2 ? "gold" : ""}`}
                      >
                        {t.done ? <Check size={15} /> : <BookOpen size={15} />}
                      </span>
                      <div>
                        <p className="text-[11px] font-medium">{t.name}</p>
                        <p className="text-[9px] text-muted mt-1">{t.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tool-art h-[90px]!">
                  <div className="art-clock top-2! w-16! h-16!" />
                  <span className="absolute bottom-2 left-4 text-[9px] text-[#65775e]">
                    Make a little time for you.
                  </span>
                </div>
              </div>
              <div className="rounded-2xl bg-[#99849f] text-[#fffaf2] flex flex-col justify-center items-center px-3 py-4">
                <span className="text-[10px] text-center leading-4">
                  Room to
                  <br />
                  grow
                </span>
                <div className="w-[65px] h-[65px] rounded-full border-4 border-[#e6bece] border-r-[#bca7bc] flex items-center justify-center my-5 text-xl font-medium">
                  78%
                </div>
                <span className="text-[9px] text-center leading-4">
                  Progress,
                  <br />
                  not perfection.
                </span>
                <Sparkles size={15} className="mt-7 text-[#f2d68d]" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 text-[9px] text-muted">
              <span className="flex gap-1 items-center">
                <Clock3 size={11} />A space to take it one step at a time
              </span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </section>
        <section id="features" className="landing-features">
          <p className="eyebrow">The little things that make a difference</p>
          <h2 className="text-3xl font-medium mt-3">
            Your whole study day, in one place.
          </h2>
          <div className="landing-feature-grid">
            {features.map((f, i) => (
              <div key={f.title}>
                <span
                  className={`subject-icon mb-4 ${i % 3 === 1 ? "rose" : i % 3 === 2 ? "gold" : ""}`}
                >
                  <f.icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-muted text-xs leading-6 mt-2">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="how-it-works" className="px-6 sm:px-15 py-14">
          <div className="flex justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow">Start small</p>
              <h2 className="text-3xl font-medium mt-3">
                A rhythm that works for you.
              </h2>
            </div>
            <Link href="/signup" className="action self-center">
              Let&apos;s get you started <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-7 mt-8">
            {[
              {
                title: "Make it yours",
                text: "Add your subjects, exam dates, and the time you have.",
              },
              {
                title: "Find your rhythm",
                text: "Follow your plan, focus, and explore your study material.",
              },
              {
                title: "Keep moving forward",
                text: "Practice with quizzes and use your progress to guide your next step.",
              },
            ].map((s, i) => (
              <div key={s.title} className="border-t border-[#d9ced8] pt-5">
                <p className="text-[#a88cad] text-xs mb-3">0{i + 1}</p>
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-xs text-muted leading-6 mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="flex justify-between gap-4 flex-wrap px-6 sm:px-15 py-6 border-t border-[#e2d9df] text-[10px] text-muted">
        <span>FocusGeek · A little more focus, every day.</span>
        <span>Made with care, for curious minds.</span>
      </footer>
    </div>
  );
}
