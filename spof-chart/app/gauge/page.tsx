import type { ReactNode } from "react";
import Link from "next/link";
import { D3Gauge } from "./D3Gauge";

function performanceLabelFromPercentile(percentileInt: number) {
  if (percentileInt <= 25) return "Strongly Underperforming";
  if (percentileInt <= 45) return "Underperforming";
  if (percentileInt <= 55) return "Flat";
  if (percentileInt <= 75) return "Outperforming";
  return "Strongly Outperforming";
}

function clampPercentile(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function GaugePage() {
  // UI demo only: percentile rank (0–100).
  const thisWeekPercentile = 28;

  const value = clampPercentile(thisWeekPercentile);
  const bucketLabel = performanceLabelFromPercentile(value);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              className="text-sm font-medium text-slate-700 hover:underline"
              href="/charts"
            >
              Charts
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-xl font-semibold text-slate-900">Performance Gauge</h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Rolling 4-week performance percentile rank (0–100), bucketed into five bands.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4">
          <Card title="Bucket label (D3)">
            <D3Gauge value={value} label={bucketLabel} />
          </Card>
        </div>
      </main>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-4 flex justify-center">{children}</div>
    </div>
  );
}
