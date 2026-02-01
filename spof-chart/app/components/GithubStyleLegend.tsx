import { getSeries, Metric } from "@/lib/health";

export function GithubStyleLegend({ metric }: { metric: Metric }) {
  const { series } = getSeries(metric);

  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {series.map((s) => {
        const valueText =
          metric === "percent" ? `${s.percent.toFixed(1)}%` : String(s.count);

        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden="true"
            />
            <span className="font-medium text-slate-900">{s.key}</span>
            <span className="tabular-nums text-slate-600">{valueText}</span>
          </li>
        );
      })}
    </ul>
  );
}

