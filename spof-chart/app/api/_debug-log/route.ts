import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

function getLogPath() {
  // Next dev server typically runs with cwd at `spof-chart/`.
  // The debug log lives at workspace root `../.cursor/debug.log`.
  return path.resolve(process.cwd(), "../.cursor/debug.log");
}

export async function POST(req: Request) {
  const logPath = getLogPath();
  const dir = path.dirname(logPath);

  let payload: unknown = null;
  try {
    payload = await req.json();
  } catch {
    // ignore parse errors
  }

  try {
    await mkdir(dir, { recursive: true });
    await appendFile(logPath, `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // ignore logging failures
  }

  return new Response(null, { status: 204 });
}

