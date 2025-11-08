'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useState, useRef } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

// ----- helpers -----
function getWeekFromDateString(dateStr: string): number {
  const clean = dateStr.split(',')[0].trim() // "2024/06/23"
  const [year, month, day] = clean.split('/').map(Number)
  const d = new Date(year, month - 1, day)
  const temp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = temp.getUTCDay() || 7
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+temp - +yearStart) / 86400000 + 1) / 7)
  return weekNo
}

function getDateRangeForWeek(week: number): { start: string; end: string } {
  const baseYear = 2024
  const firstDay = new Date(baseYear, 0, 1)
  const start = new Date(firstDay.getTime() + (week - 1) * 7 * 86400000)
  const end = new Date(start.getTime() + 6 * 86400000)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return { start: fmt(start), end: fmt(end) }
}

// ----- component -----
export default function AttackByWeekChart({
  data: allData,
}: {
  data: Array<{
    date_time: string
    location: string
    activity: string
    description?: string
    fatal?: boolean
    provoked?: boolean
    shark?: string
  }>
}) {
  const chartRef = useRef<any>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  // build 52 bins
  const allWeeks = Array(52).fill(0)
  const unprovokedWeeks = Array(52).fill(0)
  const fatalWeeks = Array(52).fill(0)
  const surfWeeks = Array(52).fill(0) // 🟣 new

  for (const entry of allData ?? []) {
    const w = getWeekFromDateString(entry.date_time) - 1 // 0-based
    if (w >= 0 && w < 52) {
      allWeeks[w]++

      const isProvoked = entry.provoked === true
      const isFatal = entry.fatal === true
      const act = entry.activity?.toLowerCase() || ''

      if (!isProvoked) unprovokedWeeks[w]++
      if (isFatal) fatalWeeks[w]++
      if (act.includes('surfing') || act.includes('body boarding'))
        surfWeeks[w]++ // add to purple line
    }
  }

  const labels = Array.from({ length: 52 }, (_, i) => '')
  const monthBoundaries = {
    0: 'Jan',
    4: 'Feb',
    8: 'Mar',
    13: 'Apr',
    17: 'May',
    21: 'Jun',
    26: 'Jul',
    30: 'Aug',
    35: 'Sep',
    39: 'Oct',
    43: 'Nov',
    48: 'Dec',
  } as Record<number, string>

  const data = {
    labels,
    datasets: [
      {
        label: 'All',
        data: allWeeks,
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.15)',
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 6,
        hitRadius: 10,
        hidden: true,
      },
      {
        label: 'Unprovoked',
        data: unprovokedWeeks,
   
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.15)',
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 6,
        hitRadius: 10,
      },
      {
        label: 'Surfing & Body Boarding',
        data: surfWeeks,
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.15)',
        tension: 0.45,
        pointRadius: 4,
        pointHoverRadius: 6,
        hitRadius: 10,
      },
      {
        label: 'Fatal',
        data: fatalWeeks,
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.15)',
        tension: 0.45,
        pointRadius: 5,
        pointHoverRadius: 7,
        hitRadius: 12,
        hidden: true,
      },

    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: (items: any) => {
            if (!items?.length) return ''
            const weekIndex = items[0].dataIndex
            const { start, end } = getDateRangeForWeek(weekIndex + 1)
            return `Week ${weekIndex + 1} (${start} – ${end})`
          },
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          drawBorder: false,
          color: (ctx: any) => {
            const index = ctx?.tick?.value
            if (index in monthBoundaries) return 'rgba(0,0,0,0.35)'
            return 'rgba(0,0,0,0.05)'
          },
          lineWidth: (ctx: any) => {
            const index = ctx?.tick?.value
            if (index in monthBoundaries) return 1.2
            return 0.4
          },
        },
        ticks: {
          callback: (val: any) => monthBoundaries[val] ?? '',
        },
      },
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
    onHover: (event: any, elements: any) => {
      const target = event?.native?.target as HTMLElement
      if (target) {
        target.style.cursor = elements.length ? 'pointer' : 'default'
      }
    },
    onClick: (event: any, elements: any) => {
      const chart = chartRef.current
      if (!chart) return
      const points = chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        true,
      )
      if (!points.length) {
        setSelectedWeek(null)
        return
      }
      const firstPoint = points[0]
      setSelectedWeek(firstPoint.index)
    },
  }

  // filter data for selected week
  let selectedAttacks: typeof allData = []
  if (selectedWeek !== null) {
    selectedAttacks = (allData ?? []).filter((entry) => {
      const w = getWeekFromDateString(entry.date_time) - 1
      return w === selectedWeek
    })
  }

  return (
    <div className="space-y-4">
      <div style={{ height: 360 }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <p className="text-center text-sm text-gray-500 mt-1">
        Tip: Click the colored labels above to hide or show each dataset.
      </p>

      {selectedWeek !== null && (
        <div className="rounded-md border p-3 space-y-2">
          {(() => {
            const { start, end } = getDateRangeForWeek(selectedWeek + 1)
            return (
              <h2 className="font-semibold">
                Week {selectedWeek + 1} ({start} – {end}) —{' '}
                {selectedAttacks.length} incident
                {selectedAttacks.length === 1 ? '' : 's'}
              </h2>
            )
          })()}

          {selectedAttacks.length === 0 ? (
            <p className="text-sm text-gray-500">No incidents for this week.</p>
          ) : (
            <ul className="space-y-2">
              {selectedAttacks.map((a, i) => (
                <li key={i} className="border rounded p-2 text-sm">
                  <div className="font-medium">{a.date_time}</div>
                  <div>{a.location}</div>
                  <div className="text-xs text-gray-500">
                    {a.activity}
                    {a.fatal ? ' • FATAL' : ''}
                    {a.provoked ? ' • provoked' : ''}
                  </div>
                  {a.description ? (
                    <div className="text-xs mt-1">
                      {a.description} {a.shark ? `• ${a.shark}` : ''}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
