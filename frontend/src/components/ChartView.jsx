import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(PointElement, LineElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

import { Line } from 'react-chartjs-2'

export default function ChartView({ data = [], mode = 'temperature', compare = false, buoyCompare = null }) {
  const getParam = (d) => mode === "salinity" ? d.salinity : d.temperature

  let chartData = { labels: [], datasets: [] }

  if (buoyCompare) {
    // Buoy vs Buoy comparison
    const { buoy1, buoy2 } = buoyCompare

    const buoy1Data = data.filter(d => d.id === buoy1 && d.date.startsWith("2025-09-01"))
    const buoy2Data = data.filter(d => d.id === buoy2 && d.date.startsWith("2025-09-01"))

    const timeLabels = buoy1Data.map(d => d.date.split(" ")[1])

    chartData = {
      labels: timeLabels,
      datasets: [
        {
          label: `${buoy1} ${mode}`,
          data: buoy1Data.map(d => getParam(d)),
          borderColor: "red",
          tension: 0.3,
        },
        {
          label: `${buoy2} ${mode}`,
          data: buoy2Data.map(d => getParam(d)),
          borderColor: "green",
          tension: 0.3,
        },
      ],
    }
  } else if (compare) {
    // Old logic: Aug vs Sep for same buoy
    const septData = data.filter(d => d.date.startsWith("2025-09-01"))
    const augData = data.filter(d => d.date.startsWith("2025-08-01"))
    const timeLabels = septData.map(d => d.date.split(" ")[1])

    chartData = {
      labels: timeLabels,
      datasets: [
        {
          label: `Aug 1 ${mode}`,
          data: augData.map(d => getParam(d)),
          borderColor: "red",
          tension: 0.3,
        },
        {
          label: `Sep 1 ${mode}`,
          data: septData.map(d => getParam(d)),
          borderColor: "blue",
          tension: 0.3,
        },
      ],
    }
  } else {
    // Single buoy single-day chart (Sep 1)
    const septData = data.filter(d => d.date.startsWith("2025-09-01"))
    const timeLabels = septData.map(d => d.date.split(" ")[1])

    chartData = {
      labels: timeLabels,
      datasets: [
        {
          label: `Sep 1 ${mode}`,
          data: septData.map(d => getParam(d)),
          borderColor: "blue",
          tension: 0.3,
        },
      ],
    }
  }

  return <Line data={chartData} options={{ responsive: true }} />
}

