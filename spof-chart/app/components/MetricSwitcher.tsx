"use client";

import { Metric } from "@/lib/health";
import { usePathname, useRouter } from "next/navigation";

export function MetricSwitcher({ metric }: { metric: Metric }) {
  const router = useRouter();
  const pathname = usePathname();

  function setMetric(next: Metric) {
    const params = new URLSearchParams(window.location.search);
    params.set("metric", next);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <label className="inline-flex items-center gap-3 text-sm">
      <span className="text-slate-600">View:</span>
      <select
        className="h-10 rounded-md border border-slate-300 bg-white px-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        value={metric}
        onChange={(e) => setMetric(e.target.value as Metric)}
        aria-label="Select metric view"
      >
        <option value="count">Count</option>
        <option value="percent">Percent</option>
      </select>
    </label>
  );
}

