"use client";

import Sidebar from "@/components/Sidebar";

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
{day:"Mon",hours:2},
{day:"Tue",hours:4},
{day:"Wed",hours:3},
{day:"Thu",hours:5},
{day:"Fri",hours:4},
{day:"Sat",hours:6},
{day:"Sun",hours:3},
];

const pie = [
{name:"Completed",value:78},
{name:"Remaining",value:22},
];

const COLORS=["#4F46E5","#E5E7EB"];

export default function Analytics(){

return(

<div className="flex min-h-screen bg-slate-50">

<Sidebar/>

<main className="ml-64 flex-1 p-10">

<h1 className="text-4xl font-bold">

Analytics 📊

</h1>

<p className="text-gray-500 mt-2">

Monitor your study habits and readiness.

</p>

<div className="grid lg:grid-cols-3 gap-6 mt-10">

<div className="card">

<h2 className="font-semibold">
Study Hours
</h2>

<p className="text-5xl font-bold mt-4">
32h
</p>

</div>

<div className="card">

<h2 className="font-semibold">
Focus Score
</h2>

<p className="text-5xl font-bold mt-4">
91%
</p>

</div>

<div className="card">

<h2 className="font-semibold">
Exam Readiness
</h2>

<p className="text-5xl font-bold mt-4 text-green-600">
78%
</p>

</div>

</div>

<div className="grid lg:grid-cols-2 gap-8 mt-10">

<div className="card">

<h2 className="text-2xl font-bold mb-6">

Weekly Study Hours

</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={weekly}>

<XAxis dataKey="day"/>

<Tooltip/>

<Bar dataKey="hours" fill="#4F46E5"/>

</BarChart>

</ResponsiveContainer>

</div>

<div className="card">

<h2 className="text-2xl font-bold mb-6">

Readiness

</h2>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie

data={pie}

innerRadius={70}

outerRadius={110}

dataKey="value"

>

{pie.map((entry,index)=>(

<Cell

key={index}

fill={COLORS[index]}

/>

))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

<div className="text-center">

<h1 className="text-5xl font-bold">

78%

</h1>

<p className="text-gray-500">

Course Completed

</p>

</div>

</div>

</div>

<div className="card mt-10">

<h2 className="text-2xl font-bold mb-5">

AI Insights

</h2>

<ul className="space-y-4">

<li>✅ You're studying consistently 5 days a week.</li>

<li>📈 Increase DBMS practice by 2 hours.</li>

<li>🎯 Complete CN revision before Friday.</li>

<li>🔥 Maintain your 14-day study streak.</li>

</ul>

</div>

</main>

</div>

)

}