"use client";

import type { Metric } from "@/lib/health";
import dynamic from "next/dynamic";

const RechartsStackedBar = dynamic(
  () => import("./RechartsStackedBar").then((m) => m.RechartsStackedBar),
  { ssr: false },
);

export function RechartsStackedBarClient({ metric }: { metric: Metric }) {
  return <RechartsStackedBar metric={metric} />;
}

