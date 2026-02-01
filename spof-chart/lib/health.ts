export type Metric = "count" | "percent";

export type HealthKey = "Healthy" | "Needs Attention" | "Critical";

export const healthOrder: HealthKey[] = ["Healthy", "Needs Attention", "Critical"];

export const healthColors: Record<HealthKey, string> = {
  Healthy: "#10b981",
  "Needs Attention": "#f59e0b",
  Critical: "#ef4444",
};

export const healthCounts: Record<HealthKey, number> = {
  Healthy: 6,
  "Needs Attention": 4,
  Critical: 2,
};

export function getTotal(counts: Record<HealthKey, number> = healthCounts) {
  return healthOrder.reduce((sum, k) => sum + (counts[k] ?? 0), 0);
}

export function toPercent(count: number, total: number) {
  if (!Number.isFinite(count) || !Number.isFinite(total) || total <= 0) return 0;
  return (count / total) * 100;
}

export function formatPercent(value: number, digits = 1) {
  const v = Number.isFinite(value) ? value : 0;
  return `${v.toFixed(digits)}%`;
}

export function parseMetric(raw?: string | null): Metric {
  return raw === "percent" ? "percent" : "count";
}

export type HealthSeriesItem = {
  key: HealthKey;
  color: string;
  count: number;
  percent: number;
  /** Value used for bar length based on metric. */
  value: number;
  /** Label for legend/tooltips (includes count or percent). */
  displayLabel: string;
};

export function getSeries(metric: Metric, counts: Record<HealthKey, number> = healthCounts) {
  const total = getTotal(counts);

  const series: HealthSeriesItem[] = healthOrder.map((key) => {
    const count = counts[key] ?? 0;
    const percent = toPercent(count, total);
    const value = metric === "percent" ? percent : count;
    const displayLabel =
      metric === "percent" ? `${key} (${formatPercent(percent)})` : `${key} (${count})`;

    return {
      key,
      color: healthColors[key],
      count,
      percent,
      value,
      displayLabel,
    };
  });

  return { total, series };
}

