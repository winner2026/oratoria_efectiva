"use client";

import { useState } from "react";
import { getMonthDays } from "@/utils/date";

export default function Calendar() {
  const [today] = useState(new Date());
  const days = getMonthDays(today);

  return (
    <div className="grid grid-cols-7 gap-2 text-center text-sm p-4 bg-white rounded-xl shadow border">
      {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
        <div key={i} className="font-semibold">
          {d}
        </div>
      ))}

      {days.map((day, i) => (
        <div
          key={i}
          className={`p-2 rounded-lg ${
            day.isToday ? "bg-blue-500 text-white font-bold" : "bg-gray-100"
          }`}
        >
          {day.number}
        </div>
      ))}
    </div>
  );
}
