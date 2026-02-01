"use client";

import { getSeries, Metric } from "@/lib/health";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function ChartJsStackedBar({ metric }: { metric: Metric }) {
  const { total, series } = getSeries(metric);

  const max = metric === "percent" ? 100 : total;
  const lastIdx = Math.max(0, series.length - 1);

  const data = {
    labels: ["All repos"],
    datasets: series.map((s, idx) => ({
      // GitHub-style legend is rendered outside the chart; keep this for tooltip only.
      label: metric === "percent" ? `${s.key} ${s.percent.toFixed(1)}%` : `${s.key} ${s.count}`,
      data: [s.value],
      backgroundColor: s.color,
      borderWidth: 0,
      stack: "health",
      borderSkipped: false,
      borderRadius:
        idx === 0
          ? { topLeft: 6, bottomLeft: 6, topRight: 0, bottomRight: 0 }
          : idx === lastIdx
            ? { topLeft: 0, bottomLeft: 0, topRight: 6, bottomRight: 6 }
            : 0,
      barThickness: 10,
    })),
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y" as const,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => String(ctx.dataset.label ?? ""),
        },
      },
    },
    scales: {
      x: {
        display: false,
        stacked: true,
        beginAtZero: true,
        min: 0,
        max,
      },
      y: {
        display: false,
        stacked: true,
      },
    },
  };

  return <Bar aria-label="Horizontal stacked bar chart" data={data} options={options} />;
}

