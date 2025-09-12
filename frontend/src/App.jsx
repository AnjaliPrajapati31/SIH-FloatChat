import React, { useState, useRef } from 'react'
import Chatbox from './components/Chatbox'
import MapView from './components/MapView'
import ChartView from './components/ChartView'
import dummy from './data/dummy.json'


export default function App() {
const [chartMode, setChartMode] = useState('temperature') // 'temperature' or 'salinity'
const [highlightNearest, setHighlightNearest] = useState(false)
const [darkMode, setDarkMode] = useState(false);
const [buoyCompare, setBuoyCompare] = useState(null) 
// e.g. { buoy1: "AS-001", buoy2: "BOB-001" }


const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };


// Chat commands handler
const [compareMode, setCompareMode] = useState(false)

function handleCommand(cmd) {
  const t = cmd.trim().toLowerCase()

  // Case: "comparison AS-001 and BOB-001 temperature"
  if (t.includes("comparison") && t.includes("and")) {
    const parts = t.split(" ")
    const buoy1 = parts.find(p => p.includes("as-"))?.toUpperCase()
    const buoy2 = parts.find(p => p.includes("bob-"))?.toUpperCase()

    if (t.includes("salinity")) {
      setChartMode("salinity")
      setBuoyCompare({ buoy1, buoy2 })
      setCompareMode(false) // not Aug vs Sep, but buoy vs buoy
      return `Showing salinity comparison between ${buoy1} and ${buoy2}.`
    }
    if (t.includes("temperature")) {
      setChartMode("temperature")
      setBuoyCompare({ buoy1, buoy2 })
      setCompareMode(false)
      return `Showing temperature comparison between ${buoy1} and ${buoy2}.`
    }
  }

  // Case: "comparison temperature" or "comparison salinity" (old logic)
  if (t.includes("comparison")) {
    if (t.includes("salinity")) {
      setChartMode("salinity")
      setCompareMode(true)
      setBuoyCompare(null)
      return "Showing comparison of salinity (Aug 1 vs Sep 1)."
    }
    if (t.includes("temperature")) {
      setChartMode("temperature")
      setCompareMode(true)
      setBuoyCompare(null)
      return "Showing comparison of temperature (Aug 1 vs Sep 1)."
    }
    setCompareMode(true)
    setBuoyCompare(null)
    return `Showing comparison of ${chartMode} (Aug 1 vs Sep 1).`
  }

  // Single-day modes
  if (t.includes("salinity")) {
    setChartMode("salinity")
    setCompareMode(false)
    setBuoyCompare(null)
    return "Showing salinity chart (Sep 1)."
  }
  if (t.includes("temperature")) {
    setChartMode("temperature")
    setCompareMode(false)
    setBuoyCompare(null)
    return "Showing temperature chart (Sep 1)."
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
data={dummy}
highlight={highlightNearest}
onToggleTheme={toggleTheme}
/> 

</div>
<div className="chart-area">
<ChartView data={dummy} mode={chartMode} compare={compareMode} buoyCompare={buoyCompare} />
</div>
</main>
</div>
)
}