"use client";

import { useRef } from "react";
import { arc as d3Arc } from "d3-shape";
import {
  defaultGaugeSpec,
  type GaugeSpec,
  gaugeDegToD3Rad,
  getIndicatorXY,
  getSegmentAngleRangeDeg,
} from "@/lib/gauge";

export function D3Gauge({
  value,
  label,
  labelColor,
  spec = defaultGaugeSpec,
}: {
  value: number;
  label: string;
  labelColor?: string;
  spec?: GaugeSpec;
}) {
  const W = 360;
  const H = 220;
  const cx = W / 2;
  const cy = 190;
  const outerRadius = 160;
  const innerRadius = 132;

  const bandThickness = outerRadius - innerRadius;
  const dotOversize = 2;
  const dotCircleR = bandThickness / 2 + dotOversize;
  const dotStrokeWidth = 4;
  // Keep overall diameter equal to the band thickness by shrinking the fill radius.
  const dotFillR = Math.max(0, dotCircleR - dotStrokeWidth / 2);

  const arcGen = d3Arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(999);

  // Place the dot at the middle of the band so it doesn't "stick out".
  const dotRadius = (innerRadius + outerRadius) / 2;
  const dot = getIndicatorXY({
    value,
    spec,
    cx,
    cy,
    radius: dotRadius,
  });

  const textY = cy - innerRadius / 2;
  const display = `${Math.round(value)}/100`;

  const lastLoggedValueRef = useRef<number | null>(null);
  if (lastLoggedValueRef.current !== value) {
    lastLoggedValueRef.current = value;
    // #region agent log
    const payload = {
      sessionId: "debug-session",
      runId: "post-fix",
      hypothesisId: "VERIFY",
      location: "app/gauge/D3Gauge.tsx",
      message: "Gauge render values (post-fix verify)",
      data: {
        value,
        display_current: display,
        specMin: spec.min,
        specMax: spec.max,
        dotAngleDeg: dot.angleDeg,
      },
      timestamp: Date.now(),
    };
    fetch("http://127.0.0.1:7249/ingest/80774515-3493-4388-b7dc-3e122ddba8b2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
    fetch("/api/_debug-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
    // #endregion
  }

  return (
    <svg
      role="img"
      aria-label="D3 gauge chart"
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="block"
    >
      <g transform={`translate(${cx}, ${cy})`}>
        {spec.segments.map((seg) => {
          const { startDeg, endDeg } = getSegmentAngleRangeDeg(seg, spec);
          const startAngle = gaugeDegToD3Rad(startDeg);
          const endAngle = gaugeDegToD3Rad(endDeg);

          const d = arcGen({ startAngle, endAngle, innerRadius, outerRadius });
          if (!d) return null;

          return <path key={seg.key} d={d} fill={seg.color} />;
        })}
      </g>

      <circle
        cx={dot.x}
        cy={dot.y}
        r={dotFillR}
        fill="#111827"
        stroke="#ffffff"
        strokeWidth={dotStrokeWidth}
      />

      <text
        x={cx}
        y={textY}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-900"
        style={{ fontSize: 44, fontWeight: 700 }}
      >
        {display}
      </text>
      <text
        x={cx}
        y={textY + 44}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-slate-700"
        style={{ fontSize: 20, fontWeight: 500, fill: labelColor }}
      >
        {label}
      </text>
    </svg>
  );
}

