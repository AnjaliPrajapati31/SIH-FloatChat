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

export default function ChartView({ 
  data = [], 
  mode = 'temperature', 
  compare = false, 
  compareTwoFloats = false,
  selectedBuoys = [],
  originalData = null 
}) {
  const getParam = (d) => {
    switch(mode) {
      case "salinity": return d.salinity
      case "pressure": return d.pressure
      case "depth": return d.pressure * 1.019716
      default: return d.temperature
    }
  }

  const getYAxisLabel = () => {
    switch(mode) {
      case "salinity": return 'Salinity (PSU)'
      case "pressure": return 'Pressure (dbar)'
      case "depth": return 'Depth (meters)'
      default: return 'Temperature (°C)'
    }
  }

  const colors = ['#ff0000', '#0000ff', '#00ff00', '#ff6600', '#9900cc']

  let chartData = { labels: [], datasets: [] }

  if (compareTwoFloats && selectedBuoys.length >= 2) {
    // Compare different floats/buoys
    const buoy1Id = selectedBuoys[0]
    const buoy2Id = selectedBuoys[1]
    
    const buoy1Data = originalData.find(b => b.id === buoy1Id)
    const buoy2Data = originalData.find(b => b.id === buoy2Id)
    
    if (buoy1Data && buoy2Data) {
      const buoy1Cycles = Object.entries(buoy1Data.cycles)
      const buoy2Cycles = Object.entries(buoy2Data.cycles)
      
      if (buoy1Cycles.length > 0 && buoy2Cycles.length > 0) {
        const [timestamp1, cycle1] = buoy1Cycles[0]
        const [timestamp2, cycle2] = buoy2Cycles[0]
        
        const maxMeasurements = Math.min(
          cycle1.measurements.length, 
          cycle2.measurements.length, 
          100
        )
        
        chartData = {
          labels: cycle1.measurements.slice(0, maxMeasurements).map((m, index) => 
            mode === 'depth' || mode === 'pressure' ? 
            `${(m.pressure || index).toFixed(1)}` : 
            `Measurement ${index + 1}`
          ),
          datasets: [
            {
              label: `Buoy ${buoy1Id} - ${new Date(timestamp1).toLocaleDateString()}`,
              data: cycle1.measurements.slice(0, maxMeasurements).map(m => getParam(m)),
              borderColor: colors[0],
              backgroundColor: `${colors[0]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
            {
              label: `Buoy ${buoy2Id} - ${new Date(timestamp2).toLocaleDateString()}`,
              data: cycle2.measurements.slice(0, maxMeasurements).map(m => getParam(m)),
              borderColor: colors[1],
              backgroundColor: `${colors[1]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }
      }
    }
  } else if (compare && originalData) {
    // Compare time periods for same buoy (existing functionality)
    const buoyToUse = selectedBuoys.length > 0 ? 
      originalData.find(b => b.id === selectedBuoys[0]) : 
      originalData[0]
      
    if (buoyToUse) {
      const cycles = Object.entries(buoyToUse.cycles)
      
      if (cycles.length >= 2) {
        const [timestamp1, cycle1] = cycles[0]
        const [timestamp2, cycle2] = cycles[1]
        
        const maxMeasurements = Math.min(
          cycle1.measurements.length, 
          cycle2.measurements.length, 
          100
        )
        
        chartData = {
          labels: cycle1.measurements.slice(0, maxMeasurements).map((m, index) => 
            mode === 'depth' || mode === 'pressure' ? 
            `${(m.pressure || index).toFixed(1)}` : 
            `Measurement ${index + 1}`
          ),
          datasets: [
            {
              label: `${new Date(timestamp1).toLocaleDateString()} ${mode}`,
              data: cycle1.measurements.slice(0, maxMeasurements).map(m => getParam(m)),
              borderColor: colors[0],
              backgroundColor: `${colors[0]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
            {
              label: `${new Date(timestamp2).toLocaleDateString()} ${mode}`,
              data: cycle2.measurements.slice(0, maxMeasurements).map(m => getParam(m)),
              borderColor: colors[1],
              backgroundColor: `${colors[1]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }
      } else {
        // Fallback to single cycle
        const [timestamp, cycle] = cycles[0]
        const maxMeasurements = Math.min(cycle.measurements.length, 100)
        
        chartData = {
          labels: cycle.measurements.slice(0, maxMeasurements).map((m, index) => 
            mode === 'depth' || mode === 'pressure' ? 
            `${(m.pressure || index).toFixed(1)}` : 
            `Measurement ${index + 1}`
          ),
          datasets: [
            {
              label: `${new Date(timestamp).toLocaleDateString()} ${mode}`,
              data: cycle.measurements.slice(0, maxMeasurements).map(m => getParam(m)),
              borderColor: colors[0],
              backgroundColor: `${colors[0]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }
      }
    }
  } else {
    // Single buoy, single time period
    let filteredData = data
    
    // Filter by selected buoy if specified
    if (selectedBuoys.length > 0) {
      filteredData = data.filter(d => selectedBuoys.includes(d.id))
    }
    
    const uniqueDates = [...new Set(filteredData.map(d => d.date))]
    if (uniqueDates.length > 0) {
      const firstCycleData = filteredData.filter(d => d.date === uniqueDates[0]).slice(0, 100)
      
      if (firstCycleData.length > 0) {
        chartData = {
          labels: firstCycleData.map((d, index) => 
            mode === 'depth' || mode === 'pressure' ? 
            `${(d.pressure || index).toFixed(1)}` : 
            `Measurement ${index + 1}`
          ),
          datasets: [
            {
              label: `Buoy ${firstCycleData[0].id} - ${new Date(uniqueDates[0]).toLocaleDateString()} ${mode}`,
              data: firstCycleData.map(d => getParam(d)),
              borderColor: colors[0],
              backgroundColor: `${colors[0]}20`,
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        }
      }
    }
  }

  const getChartTitle = () => {
    if (compareTwoFloats && selectedBuoys.length >= 2) {
      return `${mode.charAt(0).toUpperCase() + mode.slice(1)} Comparison - Buoys ${selectedBuoys[0]} vs ${selectedBuoys[1]}`
    } else if (compare) {
      const buoyId = selectedBuoys.length > 0 ? selectedBuoys[0] : (originalData?.[0]?.id || 'Unknown')
      return `${mode.charAt(0).toUpperCase() + mode.slice(1)} Time Comparison - Buoy ${buoyId}`
    } else {
      const buoyId = selectedBuoys.length > 0 ? selectedBuoys[0] : (originalData?.[0]?.id || 'Unknown')
      return `${mode.charAt(0).toUpperCase() + mode.slice(1)} Profile - Buoy ${buoyId}`
    }
  }

  return <Line data={chartData} options={{ 
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: getChartTitle()
      },
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: getYAxisLabel()
        }
      },
      x: {
        title: {
          display: true,
          text: mode === 'depth' || mode === 'pressure' ? 'Pressure (dbar)' : 'Measurement Index'
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 6
      }
    }
  }} />
}