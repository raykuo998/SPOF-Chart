import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Repository Health Charts
          </h1>
          <p className="max-w-2xl text-slate-600">
            Four implementations of the same horizontal stacked bar chart using
            D3.js, Chart.js, Recharts, and ECharts. Use the metric toggle on each
            page to switch between Count and Percent via the{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-slate-900">
              ?metric=
            </code>{" "}
            query parameter.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { name: "D3.js (SVG)", slug: "d3" },
            { name: "Chart.js (Canvas)", slug: "chartjs" },
            { name: "Recharts (React)", slug: "recharts" },
            { name: "ECharts", slug: "echarts" },
          ].map((item) => (
            <div
              key={item.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="text-lg font-semibold text-slate-900">
                {item.name}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  className="inline-flex h-10 items-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
                  href={{ pathname: `/${item.slug}`, query: { metric: "count" } }}
                >
                  View Count
                </Link>
                <Link
                  className="inline-flex h-10 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
                  href={{
                    pathname: `/${item.slug}`,
                    query: { metric: "percent" },
                  }}
                >
                  View Percent
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
