import React, { useEffect, useRef, useMemo, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths - do this only once
if (!L.Icon.Default.prototype._getIconUrl) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// Memoized icon creation - create only when needed
const iconCache = new Map();
const createColoredIcon = (color) => {
  if (iconCache.has(color)) {
    return iconCache.get(color);
  }

  const icon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background-color: ${color}; 
      width: 22px; 
      height: 22px; 
      border-radius: 50%; 
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

  iconCache.set(color, icon);
  return icon;
};

// Optimized MapActions component
const MapActions = memo(({ center, zoom }) => {
  const map = useMap();
  const lastCenter = useRef(null);

  useEffect(() => {
    if (
      center &&
      (!lastCenter.current ||
        lastCenter.current[0] !== center[0] ||
        lastCenter.current[1] !== center[1])
    ) {
      map.setView(center, zoom, { animate: true });
      lastCenter.current = center;
    }
  }, [center, zoom, map]);

  return null;
});

// Main MapView component
const MapView = memo(({ data = [], selectedBuoys = [] }) => {
  const mapRef = useRef(null);
  const colors = [
    "#ff4444",
    "#0077b6",
    "#00aa44",
    "#ff6600",
    "#9900cc",
    "#ff1493",
  ];

  // Memoize processed data to avoid recalculation
  const { uniquePositions, mapCenter, mapZoom } = useMemo(() => {
    // Get unique positions efficiently
    const positions = [];
    const seenCombos = new Set();

    data.forEach((d) => {
      const combo = `${d.id}-${d.date}`;
      if (!seenCombos.has(combo) && d.latitude && d.longitude) {
        seenCombos.add(combo);
        positions.push({
          ...d,
          key: combo, // Add unique key for React
        });
      }
    });

    // Calculate map center and zoom
    let center = [20, 60]; // Default center
    let zoom = 4;

    if (positions.length > 0) {
      if (selectedBuoys.length > 0) {
        // Focus on selected buoys
        const selectedPositions = positions.filter((p) =>
          selectedBuoys.includes(p.id)
        );
        if (selectedPositions.length > 0) {
          const lats = selectedPositions.map((p) => p.latitude);
          const lngs = selectedPositions.map((p) => p.longitude);
          center = [
            (Math.min(...lats) + Math.max(...lats)) / 2,
            (Math.min(...lngs) + Math.max(...lngs)) / 2,
          ];
          zoom = selectedPositions.length === 1 ? 8 : 6;
        }
      } else {
        // Show all data
        const lats = positions.map((p) => p.latitude);
        const lngs = positions.map((p) => p.longitude);
        center = [
          (Math.min(...lats) + Math.max(...lats)) / 2,
          (Math.min(...lngs) + Math.max(...lngs)) / 2,
        ];
        zoom = 5;
      }
    }

    return { uniquePositions: positions, mapCenter: center, mapZoom: zoom };
  }, [data, selectedBuoys]);

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => {
    return uniquePositions.map((d, index) => {
      const isSelected =
        selectedBuoys.length === 0 || selectedBuoys.includes(d.id);
      const colorIndex = selectedBuoys.indexOf(d.id);
      const color =
        isSelected && colorIndex !== -1
          ? colors[colorIndex % colors.length]
          : isSelected
          ? "#0077b6"
          : "#cccccc";

      const icon = createColoredIcon(color);

      return (
        <Marker
          key={d.key}
          position={[d.latitude, d.longitude]}
          icon={icon}
          opacity={isSelected ? 1 : 0.5}
        >
          <Popup>
            <div
              style={{ fontSize: "12px", minWidth: "160px", lineHeight: "1.4" }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                🌊 Buoy {d.id}
              </div>
              <div>
                <strong>📅 Date:</strong>{" "}
                {new Date(d.date).toLocaleDateString()}
              </div>
              <div>
                <strong>📍 Position:</strong> {d.latitude.toFixed(3)},{" "}
                {d.longitude.toFixed(3)}
              </div>
              {d.pressure && (
                <>
                  <div>
                    <strong>🌊 Max Pressure:</strong> {d.pressure.toFixed(1)}{" "}
                    dbar
                  </div>
                  <div>
                    <strong>📏 Est. Depth:</strong>{" "}
                    {(d.pressure * 1.019716).toFixed(0)} m
                  </div>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [uniquePositions, selectedBuoys, colors]);

  return (
    <div
      className="map-container"
      style={{ height: "100%", width: "100%", position: "relative" }}
    >
      <MapContainer
        ref={mapRef}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
        preferCanvas={true}
        updateWhenIdle={true}
        updateWhenZooming={false}
      >
        {/* Satellite Imagery Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© Esri, Maxar, Earthstar Geographics"
          maxZoom={18}
          updateWhenIdle={true}
          keepBuffer={4}
        />

        {/* Hybrid layer with labels (optional overlay) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          maxZoom={18}
          opacity={0.8}
        />

        {markers}

        <MapActions center={mapCenter} zoom={mapZoom} />
      </MapContainer>
    </div>
  );
});

MapView.displayName = "MapView";

export default MapView;
