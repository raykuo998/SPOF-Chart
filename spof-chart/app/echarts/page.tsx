import Link from "next/link";
import { MetricSwitcher } from "@/app/components/MetricSwitcher";
import { GithubStyleLegend } from "@/app/components/GithubStyleLegend";
import { parseMetric } from "@/lib/health";
import { EchartsStackedBar } from "./EchartsStackedBar";

export default function EchartsPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const metric = parseMetric(
    typeof searchParams?.metric === "string" ? searchParams.metric : undefined,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link className="text-sm font-medium text-slate-700 hover:underline" href="/">
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-xl font-semibold text-slate-900">ECharts</h1>
          </div>
          <MetricSwitcher metric={metric} />
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-semibold text-slate-900">
            Repository Health Distribution (by Repository {metric === "percent" ? "Percent" : "Count"})
          </div>
          <div className="mt-4 h-[18px]">
            <EchartsStackedBar metric={metric} />
          </div>
          <GithubStyleLegend metric={metric} />
        </div>
      </main>
    </div>
  );
}

