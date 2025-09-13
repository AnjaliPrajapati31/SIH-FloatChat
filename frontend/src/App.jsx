import React, { useState, useRef } from 'react'
import Chatbox from './components/Chatbox'
import MapView from './components/MapView'
import ChartView from './components/ChartView'
import dummy from './data/dummy.json'

// Transform the new JSON structure to flat array format for compatibility
function transformData(jsonData) {
  const transformedData = []
  const buoyId = jsonData.id
  
  Object.entries(jsonData.cycles).forEach(([timestamp, cycleData]) => {
    // For each measurement in the cycle, create a data point
    cycleData.measurements.forEach((measurement, index) => {
      transformedData.push({
        id: buoyId,
        date: timestamp,
        latitude: cycleData.latitude,
        longitude: cycleData.longitude,
        pressure: measurement.pressure,
        temperature: measurement.temperature,
        salinity: measurement.salinity,
        // Add a unique identifier for each measurement
        measurementIndex: index
      })
    })
  })
  
  return transformedData
}

export default function App() {
  const [chartMode, setChartMode] = useState('temperature')
  const [highlightNearest, setHighlightNearest] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [buoyCompare, setBuoyCompare] = useState(null)

  // Transform the data
  const transformedData = transformData(dummy)

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const [compareMode, setCompareMode] = useState(false)

  function handleCommand(cmd) {
    const t = cmd.trim().toLowerCase()

    // Since we only have one buoy now, update the comparison logic
    if (t.includes("comparison")) {
      if (t.includes("salinity")) {
        setChartMode("salinity")
        setCompareMode(true)
        setBuoyCompare(null)
        return "Showing salinity comparison between different time periods."
      }
      if (t.includes("temperature")) {
        setChartMode("temperature")
        setCompareMode(true)
        setBuoyCompare(null)
        return "Showing temperature comparison between different time periods."
      }
      setCompareMode(true)
      setBuoyCompare(null)
      return `Showing comparison of ${chartMode} between different time periods.`
    }

    // Single modes
    if (t.includes("salinity")) {
      setChartMode("salinity")
      setCompareMode(false)
      setBuoyCompare(null)
      return "Showing salinity data."
    }
    if (t.includes("temperature")) {
      setChartMode("temperature")
      setCompareMode(false)
      setBuoyCompare(null)
      return "Showing temperature data."
    }

    return `Unknown command: ${cmd}`
  }

  return (
    <div className="app-grid">
      <aside className="left-panel">
        <Chatbox onSend={handleCommand} />
      </aside>

      <main className="right-panel">
        <div className="map-area">
          <MapView
            data={transformedData}
            highlight={highlightNearest}
            onToggleTheme={toggleTheme}
          /> 
        </div>
        <div className="chart-area">
          <ChartView 
            data={transformedData} 
            mode={chartMode} 
            compare={compareMode} 
            buoyCompare={buoyCompare}
            originalData={dummy} // Pass original data for more advanced processing if needed
          />
        </div>
      </main>
    </div>
  )
}