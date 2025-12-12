"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function LineChart({ data }: { data: Array<{ time: string; value: number }> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 300,
    });

    const line = (chart as any).addLineSeries();
    line.setData(data);

    return () => chart.remove();
  }, [data]);

  return <div ref={ref} className="w-full" />;
}
