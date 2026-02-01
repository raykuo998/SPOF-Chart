export type GaugeSegmentKey =
  | "Bottom"
  | "Lower"
  | "Neutral"
  | "Upper"
  | "Top";

export type GaugeSegment = {
  key: GaugeSegmentKey;
  /** inclusive start */
  from: number;
  /** exclusive end (except last segment may equal max) */
  to: number;
  color: string;
};

export type GaugeSpec = {
  min: number;
  max: number;
  /** left side of the gauge, in degrees */
  startAngleDeg: number;
  /** right side of the gauge, in degrees */
  endAngleDeg: number;
  /** angular gap between segments */
  gapDeg: number;
  segments: GaugeSegment[];
};

export const defaultGaugeSpec: GaugeSpec = {
  min: 0,
  max: 100,
  // Left-to-right, top semicircle (angles decrease from 180 -> 0).
  startAngleDeg: 180,
  endAngleDeg: 0,
  gapDeg: 3,
  segments: [
    // Percentile buckets: 0–25, 26–45, 46–55, 56–75, 76–100
    // Boundaries are set at x.5 so integer percentiles map cleanly.
    { key: "Bottom", from: 0, to: 25.5, color: "#ef4444" }, // red
    { key: "Lower", from: 25.5, to: 45.5, color: "#f97316" }, // orange
    { key: "Neutral", from: 45.5, to: 55.5, color: "#eab308" }, // yellow
    { key: "Upper", from: 55.5, to: 75.5, color: "#84cc16" }, // lime
    { key: "Top", from: 75.5, to: 100, color: "#10b981" }, // green
  ],
};

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function valueToAngleDeg(value: number, spec: Pick<GaugeSpec, "min" | "max" | "startAngleDeg" | "endAngleDeg">) {
  const { min, max, startAngleDeg, endAngleDeg } = spec;
  const v = clamp(value, min, max);
  const t = max === min ? 0 : (v - min) / (max - min);
  return startAngleDeg + (endAngleDeg - startAngleDeg) * t;
}

export function shrinkAngleRangeDeg(
  startDeg: number,
  endDeg: number,
  gapDeg: number,
): { startDeg: number; endDeg: number } {
  const half = gapDeg / 2;
  if (!Number.isFinite(gapDeg) || gapDeg <= 0) return { startDeg, endDeg };

  // If angles decrease (typical gauge), trim inward from both ends.
  if (startDeg > endDeg) return { startDeg: startDeg - half, endDeg: endDeg + half };
  // If angles increase, trim inward from both ends.
  return { startDeg: startDeg + half, endDeg: endDeg - half };
}

export function getSegmentAngleRangeDeg(segment: GaugeSegment, spec: GaugeSpec) {
  const rawStart = valueToAngleDeg(segment.from, spec);
  const rawEnd = valueToAngleDeg(segment.to, spec);
  return shrinkAngleRangeDeg(rawStart, rawEnd, spec.gapDeg);
}

/**
 * Convert a gauge angle (0°=right, 90°=up, 180°=left) into D3 arc angle radians
 * (0 at 12 o'clock, positive clockwise).
 */
export function gaugeDegToD3Rad(gaugeDeg: number) {
  return degToRad(90 - gaugeDeg);
}

export function getIndicatorXY({
  value,
  spec,
  cx,
  cy,
  radius,
}: {
  value: number;
  spec: Pick<GaugeSpec, "min" | "max" | "startAngleDeg" | "endAngleDeg">;
  cx: number;
  cy: number;
  /** distance from center to the dot */
  radius: number;
}) {
  const angleDeg = valueToAngleDeg(value, spec);
  const a = degToRad(angleDeg);
  // SVG coordinate system has +y downward; subtract sin() to move "up" for positive angles.
  const x = cx + radius * Math.cos(a);
  const y = cy - radius * Math.sin(a);

  return { x, y, angleDeg };
}

