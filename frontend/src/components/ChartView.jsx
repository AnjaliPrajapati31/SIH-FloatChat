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

export default function ChartView({ data = [], mode = 'temperature', compare = false, buoyCompare = null, originalData = null }) {
  const getParam = (d) => mode === "salinity" ? d.salinity : d.temperature

  let chartData = { labels: [], datasets: [] }

  if (originalData && compare) {
    // Use original data for better time series comparison
    const cycles = Object.entries(originalData.cycles)
    
    if (cycles.length >= 2) {
      const [timestamp1, cycle1] = cycles[0]
      const [timestamp2, cycle2] = cycles[1]
      
      // Create labels based on measurement indices or pressure levels
      const labels = cycle1.measurements.map((_, index) => `Measurement ${index + 1}`)
      
      chartData = {
        labels: labels,
        datasets: [
          {
            label: `${new Date(timestamp1).toLocaleDateString()} ${mode}`,
            data: cycle1.measurements.map(m => mode === "salinity" ? m.salinity : m.temperature),
            borderColor: "red",
            tension: 0.3,
          },
          {
            label: `${new Date(timestamp2).toLocaleDateString()} ${mode}`,
            data: cycle2.measurements.map(m => mode === "salinity" ? m.salinity : m.temperature),
            borderColor: "blue",
            tension: 0.3,
          },
        ],
      }
    } else {
      // Fallback to single cycle
      const [timestamp, cycle] = cycles[0]
      const labels = cycle.measurements.map((_, index) => `Measurement ${index + 1}`)
      
      chartData = {
        labels: labels,
        datasets: [
          {
            label: `${new Date(timestamp).toLocaleDateString()} ${mode}`,
            data: cycle.measurements.map(m => mode === "salinity" ? m.salinity : m.temperature),
            borderColor: "blue",
            tension: 0.3,
          },
        ],
      }
    }
  } else {
    // Use transformed data for simple display
    // Group by unique timestamps and take first few measurements
    const uniqueDates = [...new Set(data.map(d => d.date))]
    if (uniqueDates.length > 0) {
      const firstCycleData = data.filter(d => d.date === uniqueDates[0]).slice(0, 50) // Limit to first 50 measurements
      const labels = firstCycleData.map((_, index) => `Measurement ${index + 1}`)
      
      chartData = {
        labels: labels,
        datasets: [
          {
            label: `${new Date(uniqueDates[0]).toLocaleDateString()} ${mode}`,
            data: firstCycleData.map(d => getParam(d)),
            borderColor: "blue",
            tension: 0.3,
          },
        ],
      }
    }
  }

  return <Line data={chartData} options={{ 
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Profile - Buoy ${originalData?.id || 'Unknown'}`
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: mode === 'salinity' ? 'Salinity (PSU)' : 'Temperature (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Measurement Depth/Index'
        }
      }
    }
  }} />
}