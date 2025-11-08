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
      <p className="text-center text-gray-600 text-sm mt-2">
  The shark attack data is from{" "}
  <a
    href="https://dlnr.hawaii.gov/sharks/shark-incidents/incidents-list"
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 underline hover:text-blue-600"
  >
    DLNR Hawaiʻi Shark Incident Database
  </a>
  . This dataset includes reported shark attacks in Hawaiʻi from 1995 to 2025,
  compiled from official state incident reports.
</p>
      {/* pass the raw data too */}
      <AttackByWeekChart data={attacks as any[]} />
      <SharkInfo />
    </main>
  );
}
