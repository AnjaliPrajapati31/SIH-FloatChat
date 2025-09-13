import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as EL from "esri-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// fix default icon paths for many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapActions({ lat, lon, highlight }) {
  const map = useMap();
  useEffect(() => {
    if (highlight) {
      map.setView([lat, lon], 8, { animate: true });
    }
  }, [highlight, lat, lon, map]);
  return null;
}

export default function MapView({ data = [], highlight = false, onToggleTheme }) {
  // Get unique positions (one per cycle)
  const uniquePositions = [];
  const seenDates = new Set();
  
  data.forEach(d => {
    if (!seenDates.has(d.date)) {
      seenDates.add(d.date);
      uniquePositions.push(d);
    }
  });

  const first = uniquePositions[0];
  const lat = first?.latitude ?? 0;
  const lon = first?.longitude ?? 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden shadow-lg">
      {/* Local Header */}
      <div className="flex items-center justify-between px-4 py-2 shadow bg-gray-100 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Float Map - Buoy {uniquePositions[0]?.id || 'Unknown'}
        </h2>
        <button
          onClick={onToggleTheme}
          className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          Toggle Theme
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1">
        <MapContainer
          center={[lat, lon]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles © <a href="https://www.esri.com/">Esri</a>'
          />

          {uniquePositions.map((d, i) => (
            <Marker key={i} position={[d.latitude, d.longitude]}>
              <Popup>
                <div>
                  <div><strong>Buoy ID:</strong> {d.id}</div>
                  <div><strong>Date:</strong> {new Date(d.date).toLocaleString()}</div>
                  <div><strong>Lat:</strong> {d.latitude.toFixed(4)}</div>
                  <div><strong>Lon:</strong> {d.longitude.toFixed(4)}</div>
                  <div><strong>Measurements:</strong> Multiple depth profiles</div>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapActions lat={lat} lon={lon} highlight={highlight} />
        </MapContainer>
      </div>
    </div>
  );
}