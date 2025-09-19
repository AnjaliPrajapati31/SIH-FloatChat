import React, { useState } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
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

function App() {
  const [chartMode, setChartMode] = useState("temperature");
  const [selectedBuoys, setSelectedBuoys] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [compareTwoFloats, setCompareTwoFloats] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);

  const transformedData = transformData(dummy);
  const availableBuoys = getAvailableBuoys(dummy);

  // Function to get buoys that have data for a specific parameter
  const getBuoysWithParameter = (parameter) => {
    const buoysWithData = [];

    dummy.forEach((buoy) => {
      let hasParameterData = false;

      Object.values(buoy.cycles).forEach((cycle) => {
        if (cycle.data && cycle.data.length > 0) {
          cycle.data.forEach((dataPoint) => {
            switch (parameter) {
              case "temperature":
                if (
                  dataPoint.temperature !== undefined &&
                  dataPoint.temperature !== null
                ) {
                  hasParameterData = true;
                }
                break;
              case "salinity":
                if (
                  dataPoint.salinity !== undefined &&
                  dataPoint.salinity !== null
                ) {
                  hasParameterData = true;
                }
                break;
              case "pressure":
                if (
                  dataPoint.pressure !== undefined &&
                  dataPoint.pressure !== null
                ) {
                  hasParameterData = true;
                }
                break;
              case "depth":
                if (dataPoint.depth !== undefined && dataPoint.depth !== null) {
                  hasParameterData = true;
                }
                break;
            }
          });
        }
      });

      if (hasParameterData) {
        buoysWithData.push(buoy.id);
      }
    });

    return buoysWithData.slice(0, 6); // Limit to 6 buoys for better visualization
  };

  // Define known commands that should trigger visualizations
  const knownCommands = [
    "temperature",
    "salinity",
    "pressure",
    "depth",
    "map",
    "compare floats",
    "compare buoys",
    "comparison",
    "buoy",
  ];

  // Check if command contains any known command keywords
  const isKnownCommand = (cmd) => {
    const t = cmd.trim().toLowerCase();

    return (
      knownCommands.some((knownCmd) => {
        if (knownCmd === "buoy") {
          return t.includes("buoy") && /buoy\s+\d+/.test(t);
        }
        if (knownCmd === "compare floats" || knownCmd === "compare buoys") {
          return (
            (t.includes("compare floats") || t.includes("compare buoys")) &&
            /\d+/.test(t)
          );
        }
        return t.includes(knownCmd);
      }) || t === "help"
    );
  };

  function handleCommand(cmd) {
    const t = cmd.trim().toLowerCase();

    // Only process known commands for visualizations
    if (!isKnownCommand(cmd)) {
      return `I don't recognize that command. Type "help" to see available commands.`;
    }

    // Handle help command first - hide everything and reset
    if (t.includes("help")) {
      setShowVisualization(false);
      setShowChart(false);
      setMapInitialized(false);
      setSelectedBuoys([]);
      return `Available commands:
• "temperature", "salinity", "pressure", "depth" - view data
• "comparison [parameter]" - compare time periods for buoy 1902050
• "compare floats [id1] [id2]" - compare different buoys
• "buoy [id]" - select specific buoy
• "map" - show buoy locations
Available buoys: ${availableBuoys.join(", ")}`;
    }

    // Show loading states for known data commands
    setIsMapLoading(true);
    setIsChartLoading(true);

    // Clear loading states after delay
    setTimeout(() => {
      setIsMapLoading(false);
      setIsChartLoading(false);
    }, 1000);

    // Show visualization panel for known data commands
    setShowVisualization(true);
    setMapInitialized(true);

    // Handle "map" command specifically
    if (t === "map") {
      setSelectedBuoys([]); // Show all buoys
      return "Showing all buoy locations on satellite map.";
    }

    // For all other known data commands, show chart
    setShowChart(true);

    // Compare two different floats
    if (t.includes("compare floats") || t.includes("compare buoys")) {
      const buoyMatches = t.match(/(\d+)/g);
      if (buoyMatches && buoyMatches.length >= 2) {
        const buoy1 = buoyMatches[0];
        const buoy2 = buoyMatches[1];

        const validBuoys = [buoy1, buoy2].filter((id) =>
          availableBuoys.includes(id)
        );

        if (validBuoys.length < 2) {
          setShowVisualization(false);
          setShowChart(false);
          setMapInitialized(false);
          setSelectedBuoys([]);
          return `One or more buoys not found. Available buoys: ${availableBuoys.join(
            ", "
          )}`;
        }

        setSelectedBuoys(validBuoys);
        setCompareTwoFloats(true);
        setCompareMode(false);

        if (t.includes("temperature")) setChartMode("temperature");
        else if (t.includes("salinity")) setChartMode("salinity");
        else if (t.includes("pressure")) setChartMode("pressure");
        else if (t.includes("depth")) setChartMode("depth");

        return `Comparing ${chartMode} data between buoys ${validBuoys.join(
          " and "
        )}. Highlighted on map.`;
      }

      setShowVisualization(false);
      setShowChart(false);
      setMapInitialized(false);
      setSelectedBuoys([]);
      return "Please specify two buoy IDs. Example: 'compare floats 1901910 1902050'";
    }

    // Time period comparison for single buoy
    if (t.includes("comparison")) {
      const buoyWithMultipleCycles = dummy.find(
        (buoy) => Object.keys(buoy.cycles).length > 1
      );

      if (!buoyWithMultipleCycles) {
        setShowVisualization(false);
        setShowChart(false);
        setMapInitialized(false);
        setSelectedBuoys([]);
        return `No single buoy has multiple time periods with data for comparison. Try "compare floats ${availableBuoys[0]} ${availableBuoys[1]} temperature" instead.`;
      }

      setSelectedBuoys([buoyWithMultipleCycles.id]);

      if (t.includes("salinity")) {
        setChartMode("salinity");
        setCompareMode(true);
        return `Showing salinity comparison between different time periods for buoy ${buoyWithMultipleCycles.id}. Highlighted on map.`;
      }
      if (t.includes("temperature")) {
        setChartMode("temperature");
        setCompareMode(true);
        return `Showing temperature comparison between different time periods for buoy ${buoyWithMultipleCycles.id}. Highlighted on map.`;
      }
      if (t.includes("pressure")) {
        setChartMode("pressure");
        setCompareMode(true);
        return `Showing pressure comparison between different time periods for buoy ${buoyWithMultipleCycles.id}. Highlighted on map.`;
      }
      if (t.includes("depth")) {
        setChartMode("depth");
        setCompareMode(true);
        return `Showing depth comparison between different time periods for buoy ${buoyWithMultipleCycles.id}. Highlighted on map.`;
      }

      setChartMode("temperature");
      setCompareMode(true);
      return `Showing temperature comparison between different time periods for buoy ${buoyWithMultipleCycles.id}. Highlighted on map.`;
    }

    // Handle buoy selection
    if (t.includes("buoy")) {
      const buoyMatch = t.match(/buoy\s+(\d+)/);
      if (buoyMatch) {
        const buoyId = buoyMatch[1];
        if (availableBuoys.includes(buoyId)) {
          setSelectedBuoys([buoyId]);
          setCompareMode(false);
          setCompareTwoFloats(false);
          return `Selected buoy ${buoyId}. Showing ${chartMode} data and highlighted on map.`;
        } else {
          setShowVisualization(false);
          setShowChart(false);
          setMapInitialized(false);
          setSelectedBuoys([]);
          return `Buoy ${buoyId} not found. Available buoys: ${availableBuoys.join(
            ", "
          )}`;
        }
      }

      setShowVisualization(false);
      setShowChart(false);
      setMapInitialized(false);
      setSelectedBuoys([]);
      return "Please specify a buoy ID. Example: 'buoy 1901910'";
    }

    // Single parameter modes - Auto-select buoys with that parameter
    if (t.includes("salinity")) {
      const buoysWithSalinity = getBuoysWithParameter("salinity");
      setChartMode("salinity");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys(buoysWithSalinity);
      return `Showing salinity data from ${
        buoysWithSalinity.length
      } buoys with salinity measurements. Highlighted floats on map: ${buoysWithSalinity.join(
        ", "
      )}.`;
    }

    if (t.includes("temperature")) {
      const buoysWithTemperature = getBuoysWithParameter("temperature");
      setChartMode("temperature");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys(buoysWithTemperature);
      return `Showing temperature data from ${
        buoysWithTemperature.length
      } buoys with temperature measurements. Highlighted floats on map: ${buoysWithTemperature.join(
        ", "
      )}.`;
    }

    if (t.includes("pressure")) {
      const buoysWithPressure = getBuoysWithParameter("pressure");
      setChartMode("pressure");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys(buoysWithPressure);
      return `Showing pressure profile data from ${
        buoysWithPressure.length
      } buoys with pressure measurements. Highlighted floats on map: ${buoysWithPressure.join(
        ", "
      )}.`;
    }

    if (t.includes("depth")) {
      const buoysWithDepth = getBuoysWithParameter("depth");
      setChartMode("depth");
      setCompareMode(false);
      setCompareTwoFloats(false);
      setSelectedBuoys(buoysWithDepth);
      return `Showing depth profile data from ${
        buoysWithDepth.length
      } buoys with depth measurements. Highlighted floats on map: ${buoysWithDepth.join(
        ", "
      )}.`;
    }

    // Fallback
    setShowVisualization(false);
    setShowChart(false);
    setMapInitialized(false);
    setSelectedBuoys([]);
    return `Unknown command: ${cmd}. Type "help" for available commands.`;
  }

  const closeVisualization = () => {
    setShowVisualization(false);
    setShowChart(false);
    setMapInitialized(false);
    setSelectedBuoys([]);
  };

  const getVisualizationTitle = () => {
    const modeTitle = chartMode.charAt(0).toUpperCase() + chartMode.slice(1);
    if (selectedBuoys.length > 0) {
      return `${modeTitle} Data - ${selectedBuoys.length} Buoys Selected`;
    }
    return `Marine Data Visualization`;
  };

  return (
    <ThemeProvider>
      <div className="app-grid">
        <Navbar
          title="FloatChat"
          showBackButton={showVisualization}
          onBack={closeVisualization}
        />

        <div className="app-content">
          <aside
            className={`left-panel ${
              showVisualization ? "with-visualization" : ""
            }`}
          >
            <Chatbox onSend={handleCommand} />
          </aside>

          <main className={`right-panel ${showVisualization ? "show" : ""}`}>
            {showVisualization && (
              <>
                <div className="visualization-header">
                  <h3>{getVisualizationTitle()}</h3>
                  <button onClick={closeVisualization} className="close-btn">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="visualizations-container">
                  {/* Map Section */}
                  {mapInitialized && (
                    <div className="map-section">
                      <div className="map-header">
                        <h4>
                          🛰️ Satellite View
                          {selectedBuoys.length > 0 && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                fontSize: "0.7rem",
                                color: "var(--accent-primary)",
                                fontWeight: "normal",
                              }}
                            >
                              ({selectedBuoys.length} highlighted)
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="map-area-compact">
                        {isMapLoading ? (
                          <div className="map-loading">
                            Loading satellite map...
                          </div>
                        ) : (
                          <MapView
                            data={transformedData}
                            selectedBuoys={selectedBuoys}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Chart Section */}
                  {showChart && (
                    <div className="chart-section">
                      <div className="chart-header">
                        <h4>📊 {getVisualizationTitle()}</h4>
                      </div>
                      <div className="chart-area">
                        {isChartLoading ? (
                          <div className="chart-loading">Loading chart...</div>
                        ) : (
                          <ChartView
                            data={transformedData}
                            mode={chartMode}
                            compare={compareMode}
                            compareTwoFloats={compareTwoFloats}
                            selectedBuoys={selectedBuoys}
                            originalData={dummy}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
