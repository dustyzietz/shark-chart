// app/attacks/page.tsx
import attacks from "../../sharkData.json";
import { buildWeeklyCounts } from "../../lib/groupByWeek";
import AttackByWeekChart from "../components/AttackByWeekChart";
import SharkInfo from "../components/SharkInfo";

export default function Page() {
  const { labels, data } = buildWeeklyCounts(attacks as any[]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Shark Incidents by Week</h1>
      <p>Combined across all years from your JSON.</p>
      {/* pass the raw data too */}
      <AttackByWeekChart data={attacks as any[]} />
      <SharkInfo />
    </main>
  );
}
