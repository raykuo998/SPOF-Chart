import { getSeries, Metric } from "@/lib/health";

export function D3StackedBar({ metric }: { metric: Metric }) {
  const { total, series } = getSeries(metric);
  const max = metric === "percent" ? 100 : total;

  // GitHub-style: thin, axis-less, full-width stacked bar.
  const width = 1000;
  const height = 18;
  const barH = 10;
  const barY = (height - barH) / 2;
  const radius = barH / 2;

  const segments = series.map((s, idx) => {
    const x0 = series.slice(0, idx).reduce((sum, item) => sum + item.value, 0);
    const x1 = x0 + s.value;
    return { ...s, x0, x1 };
  });

  return (
    <svg
      role="img"
      aria-label="Horizontal stacked bar chart"
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
    >
      <defs>
        <clipPath id="roundedTrack">
          <rect x="0" y={barY} width={width} height={barH} rx={radius} ry={radius} />
        </clipPath>
      </defs>

      <g clipPath="url(#roundedTrack)">
        {segments.map((s) => {
          const segX = (s.x0 / max) * width;
          const segW = Math.max(0, ((s.x1 - s.x0) / max) * width);
          return (
            <rect key={s.key} x={segX} y={barY} width={segW} height={barH} fill={s.color}>
              <title>
                {s.key}{" "}
                {metric === "percent" ? `${s.percent.toFixed(1)}%` : String(s.count)}
              </title>
            </rect>
          );
        })}
      </g>
    </svg>
  );
}

