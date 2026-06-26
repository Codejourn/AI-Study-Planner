"use client";

import Link from "next/link";

import {
LayoutDashboard,
Calendar,
Notebook,
Brain,
BarChart3,
Timer
} from "lucide-react";

export default function Sidebar(){

return(

<div className="w-64 h-screen bg-white shadow-md p-6 fixed">

<h1 className="text-3xl font-bold text-indigo-600 mb-10">
FocusGeek
</h1>

<div className="flex flex-col gap-2">

<Link href="/dashboard" className="sidebar-item">
<LayoutDashboard size={20}/>
Dashboard
</Link>

<Link href="/planner" className="sidebar-item">
<Calendar size={20}/>
Planner
</Link>

<Link href="/notes" className="sidebar-item">
<Notebook size={20}/>
Notes AI
</Link>

<Link href="/focus" className="sidebar-item">
<Timer size={20}/>
Focus Mode
</Link>

<Link href="/quiz" className="sidebar-item">
<Brain size={20}/>
Quiz
</Link>

<Link href="/analytics" className="sidebar-item">
<BarChart3 size={20}/>
Analytics
</Link>

</div>

</div>

)

}