import React, { useState, useRef } from "react";
import Chatbox from "./components/Chatbox";
import MapView from "./components/MapView";
import ChartView from "./components/ChartView";
import dummy from "./data/dummy.json";

// Transform the new JSON structure to flat array format for compatibility
function transformData(jsonArray) {
  const transformedData = [];

  jsonArray.forEach((buoyData) => {
    const buoyId = buoyData.id;

    Object.entries(buoyData.cycles).forEach(([timestamp, cycleData]) => {
      cycleData.measurements.forEach((measurement, index) => {
        transformedData.push({
          id: buoyId,
          date: timestamp,
          latitude: cycleData.latitude,
          longitude: cycleData.longitude,
          pressure: measurement.pressure,
          temperature: measurement.temperature,
          salinity: measurement.salinity,
          measurementIndex: index,
        });
      });
    });
  });

  return transformedData;
}

// Get available buoy IDs
function getAvailableBuoys(jsonArray) {
  return jsonArray.map((buoy) => buoy.id);
}

export default function App() {
  const [chartMode, setChartMode] = useState("temperature");
  const [highlightNearest, setHighlightNearest] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBuoys, setSelectedBuoys] = useState([]); // Array of selected buoy IDs
  const [compareMode, setCompareMode] = useState(false);
  const [compareTwoFloats, setCompareTwoFloats] = useState(false);

  // Transform the data and get available buoys
  const transformedData = transformData(dummy);
  const availableBuoys = getAvailableBuoys(dummy);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  function handleCommand(cmd) {
    const t = cmd.trim().toLowerCase();

    // Compare two different floats
    if (t.includes("compare floats") || t.includes("compare buoys")) {
      const buoyMatches = t.match(/(\d+)/g);
      if (buoyMatches && buoyMatches.length >= 2) {
        const buoy1 = buoyMatches[0];
        const buoy2 = buoyMatches[1];

        // Check if both buoys exist
        const validBuoys = [buoy1, buoy2].filter((id) =>
          availableBuoys.includes(id)
        );
        if (validBuoys.length === 2) {
          setSelectedBuoys([buoy1, buoy2]);
          setCompareTwoFloats(true);
          setCompareMode(false);

          // Extract parameter if specified
          if (t.includes("salinity")) {
            setChartMode("salinity");
            return `Comparing salinity data between buoys ${buoy1} and ${buoy2}.`;
          } else if (t.includes("temperature")) {
            setChartMode("temperature");
            return `Comparing temperature data between buoys ${buoy1} and ${buoy2}.`;
          } else if (t.includes("pressure")) {
            setChartMode("pressure");
            return `Comparing pressure data between buoys ${buoy1} and ${buoy2}.`;
          }
          return `Comparing ${chartMode} data between buoys ${buoy1} and ${buoy2}.`;
        } else {
          return `Invalid buoy IDs. Available buoys: ${availableBuoys.join(
            ", "
          )}`;
        }
      } else {
        return `Please specify two buoy IDs. Example: "compare floats 1901910 1902050". Available: ${availableBuoys.join(
          ", "
        )}`;
      }
    }

    // Time comparison for single buoy - THIS IS THE FIX
    if (t.includes("comparison")) {
      setCompareTwoFloats(false);
      setSelectedBuoys([]);

      // Find a buoy that has multiple cycles with data
      const buoyWithMultipleCycles = dummy.find((buoy) => {
        const cycles = Object.entries(buoy.cycles);
        const cyclesWithData = cycles.filter(
          ([_, cycle]) => cycle.measurements && cycle.measurements.length > 0
        );
        return cyclesWithData.length >= 2;
      });

      if (!buoyWithMultipleCycles) {
        // If no buoy has multiple cycles, suggest comparing different buoys
        return `No single buoy has multiple time periods with data for comparison. Try "compare floats ${availableBuoys[0]} ${availableBuoys[1]} temperature" instead.`;
      }

      // Set the buoy for comparison
      setSelectedBuoys([buoyWithMultipleCycles.id]);

      if (t.includes("salinity")) {
        setChartMode("salinity");
        setCompareMode(true);
        return `Showing salinity comparison between different time periods for buoy ${buoyWithMultipleCycles.id}.`;
      }
      if (t.includes("temperature")) {
        setChartMode("temperature");
        setCompareMode(true);
        return `Showing temperature comparison between different time periods for buoy ${buoyWithMultipleCycles.id}.`;
      }
      if (t.includes("pressure")) {
        setChartMode("pressure");
        setCompareMode(true);
        return `Showing pressure comparison between different time periods for buoy ${buoyWithMultipleCycles.id}.`;
      }
      if (t.includes("depth")) {
        setChartMode("depth");
        setCompareMode(true);
        return `Showing depth comparison between different time periods for buoy ${buoyWithMultipleCycles.id}.`;
      }
      setCompareMode(true);
      return `Showing comparison of ${chartMode} between different time periods for buoy ${buoyWithMultipleCycles.id}.`;
    }

    // Single buoy selection
    const buoyMatch = t.match(/buoy\s+(\d+)|float\s+(\d+)/);
    if (buoyMatch) {
      const buoyId = buoyMatch[1] || buoyMatch[2];
      if (availableBuoys.includes(buoyId)) {
        setSelectedBuoys([buoyId]);
        setCompareMode(false);
        setCompareTwoFloats(false);
        return `Selected buoy ${buoyId}. Showing ${chartMode} data.`;
      } else {
        return `Buoy ${buoyId} not found. Available buoys: ${availableBuoys.join(
          ", "
        )}`;
      }
    }

    // Single parameter modes
    if (t.includes("salinity")) {
      setChartMode("salinity");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys([]);
      return "Showing salinity data.";
    }
    if (t.includes("temperature")) {
      setChartMode("temperature");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys([]);
      return "Showing temperature data.";
    }
    if (t.includes("pressure")) {
      setChartMode("pressure");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys([]);
      return "Showing pressure profile data.";
    }
    if (t.includes("depth")) {
      setChartMode("depth");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys([]);
      return "Showing depth profile data.";
    }

    // Show available commands
    if (t.includes("help")) {
      return `Available commands:
• "temperature", "salinity", "pressure", "depth"
• "comparison [parameter]" - compare time periods for buoy 1902050
• "compare floats [id1] [id2]" - compare different buoys
• "buoy [id]" - select specific buoy
Available buoys: ${availableBuoys.join(", ")}`;
    }

    return `Unknown command: ${cmd}. Type "help" for available commands.`;
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
            selectedBuoys={selectedBuoys}
          />
        </div>
        <div className="chart-area">
          <ChartView
            data={transformedData}
            mode={chartMode}
            compare={compareMode}
            compareTwoFloats={compareTwoFloats}
            selectedBuoys={selectedBuoys}
            originalData={dummy}
          />
        </div>
      </main>
    </div>
  );
}
