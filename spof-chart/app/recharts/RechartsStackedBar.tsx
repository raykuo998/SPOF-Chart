"use client";

import { getSeries, Metric } from "@/lib/health";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = {
  name: string;
  Healthy: number;
  "Needs Attention": number;
  Critical: number;
};

export function RechartsStackedBar({ metric }: { metric: Metric }) {
  const { series } = getSeries(metric);

  const row: Row = {
    name: "All repos",
    Healthy: series.find((s) => s.key === "Healthy")?.value ?? 0,
    "Needs Attention": series.find((s) => s.key === "Needs Attention")?.value ?? 0,
    Critical: series.find((s) => s.key === "Critical")?.value ?? 0,
  };

  const xDomain: [number, number] | undefined =
    metric === "percent" ? [0, 100] : undefined;
  const barRadius = 6;
  const lastIdx = Math.max(0, series.length - 1);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={[row]}
        layout="vertical"
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        barSize={10}
      >
        <XAxis type="number" domain={xDomain} hide />
        <YAxis type="category" dataKey="name" hide />
        <Tooltip
          formatter={(value: unknown, name: unknown) => {
            const key = String(name);
            const s = series.find((x) => x.key === key);
            return s
              ? metric === "percent"
                ? `${s.key} ${s.percent.toFixed(1)}%`
                : `${s.key} ${s.count}`
              : String(value);
          }}
        />
        {series.map((s, idx) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            stackId="health"
            fill={s.color}
            radius={
              idx === 0
                ? [barRadius, 0, 0, barRadius]
                : idx === lastIdx
                  ? [0, barRadius, barRadius, 0]
                  : 0
            }
            isAnimationActive={false}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

