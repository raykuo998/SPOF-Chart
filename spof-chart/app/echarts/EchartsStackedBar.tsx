"use client";

import dynamic from "next/dynamic";
import { getSeries, Metric } from "@/lib/health";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function EchartsStackedBar({ metric }: { metric: Metric }) {
  const { total, series } = getSeries(metric);
  const max = metric === "percent" ? 100 : total;

  type TooltipParam = { seriesName?: string };

  const option = {
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: false },
    tooltip: {
      trigger: "item",
      formatter: (params: TooltipParam) => {
        const seriesName = params.seriesName ?? "";
        const s = series.find((x) => x.key === seriesName);
        return s
          ? metric === "percent"
            ? `${s.key} ${s.percent.toFixed(1)}%`
            : `${s.key} ${s.count}`
          : String(seriesName);
      },
    },
    legend: { show: false },
    xAxis: {
      type: "value",
      min: 0,
      max,
      show: false,
    },
    yAxis: {
      type: "category",
      data: ["All repos"],
      show: false,
    },
    series: series.map((s, idx) => {
      const r = 6;
      const lastIdx = Math.max(0, series.length - 1);
      const borderRadius =
        idx === 0
          ? [r, 0, 0, r]
          : idx === lastIdx
            ? [0, r, r, 0]
            : 0;

      return {
        name: s.key,
        type: "bar",
        stack: "health",
        barWidth: 10,
        data: [s.value],
        itemStyle: { color: s.color, borderRadius },
        emphasis: { focus: "series" },
        label: { show: false },
      };
    }),
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: "100%", width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

