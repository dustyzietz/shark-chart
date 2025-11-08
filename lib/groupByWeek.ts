// lib/groupByWeek.ts

// ISO week 1–53
function getISOWeek(date: Date): number {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7);
  }
  
  // your JSON date looks like "2025/07/18, 3:00 pm"
  // sometimes yours had extra text after the comma — we drop everything after the first comma
  function parseDateFromJson(raw: string): Date | null {
    if (!raw) return null;
    const justDate = raw.split(",")[0].trim(); // "2025/07/18"
    const iso = justDate.replace(/\//g, "-");  // "2025-07-18"
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }
  
  export function buildWeeklyCounts(attacks: Array<{ date_time?: string }>) {
    const counts: Record<number, number> = {};
    for (let w = 1; w <= 53; w++) counts[w] = 0;
  
    for (const a of attacks) {
      const raw = a.date_time;
      if (!raw) continue;
      const d = parseDateFromJson(raw);
      if (!d) continue;
      const week = getISOWeek(d);
      counts[week] = (counts[week] || 0) + 1;
    }
  
    const labels: string[] = [];
    const data: number[] = [];
    for (let w = 1; w <= 53; w++) {
      labels.push(`W${w}`);
      data.push(counts[w] ?? 0);
    }
  
    return { labels, data };
  }
  