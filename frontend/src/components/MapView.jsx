import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Create custom colored markers
const createColoredIcon = (color) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="
      background-color: ${color}; 
      width: 25px; 
      height: 25px; 
      border-radius: 50%; 
      border: 2px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 12]
  });
};

function MapActions({ lat, lon, highlight }) {
  const map = useMap();
  useEffect(() => {
    if (highlight) {
      map.setView([lat, lon], 8, { animate: true });
    }
  }, [highlight, lat, lon, map]);
  return null;
}

export default function MapView({ data = [], highlight = false, onToggleTheme, selectedBuoys = [] }) {
  // Get unique positions (one per cycle per buoy)
  const uniquePositions = [];
  const seenCombos = new Set();
  
  data.forEach(d => {
    const combo = `${d.id}-${d.date}`;
    if (!seenCombos.has(combo)) {
      seenCombos.add(combo);
      uniquePositions.push(d);
    }
  });

  // Group positions by buoy
  const buoyPositions = {};
  uniquePositions.forEach(pos => {
    if (!buoyPositions[pos.id]) {
      buoyPositions[pos.id] = [];
    }
    buoyPositions[pos.id].push(pos);
  });

  const first = uniquePositions[0];
  const lat = first?.latitude ?? 0;
  const lon = first?.longitude ?? 0;

  const colors = ['#ff0000', '#0000ff', '#00ff00', '#ff6600', '#9900cc'];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden shadow-lg">
      {/* Local Header */}
      
      <div className="floatmap-header flex items-center justify-between px-4 py-2 shadow">
        <h2 className="title">
          Float Map - {selectedBuoys.length > 0 ? `Buoys ${selectedBuoys.join(', ')}` : 'All Buoys'}
        </h2>
        <button
          onClick={onToggleTheme}
          className="theme-toggle-btn px-3 py-1 rounded-lg"
        >
          Toggle Theme
        </button>
      </div>

      {/* Map Area */}
      <div className="flex-1">
        <MapContainer
          center={[lat, lon]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles © <a href="https://www.esri.com/">Esri</a>'
          />

          {Object.entries(buoyPositions).map(([buoyId, positions], buoyIndex) => {
            const isSelected = selectedBuoys.length === 0 || selectedBuoys.includes(buoyId);
            const color = selectedBuoys.includes(buoyId) ? colors[selectedBuoys.indexOf(buoyId)] : '#666666';
            const icon = isSelected ? createColoredIcon(color) : createColoredIcon('#cccccc');
            
            return positions.map((d, posIndex) => (
              <Marker 
                key={`${buoyId}-${posIndex}`} 
                position={[d.latitude, d.longitude]}
                icon={icon}
                opacity={isSelected ? 1 : 0.5}
              >
                <Popup>
                  <div>
                    <div><strong>Buoy ID:</strong> {d.id}</div>
                    <div><strong>Date:</strong> {new Date(d.date).toLocaleString()}</div>
                    <div><strong>Lat:</strong> {d.latitude.toFixed(4)}</div>
                    <div><strong>Lon:</strong> {d.longitude.toFixed(4)}</div>
                    <div><strong>Max Pressure:</strong> {d.pressure ? `${d.pressure.toFixed(1)} dbar` : 'N/A'}</div>
                    <div><strong>Est. Max Depth:</strong> {d.pressure ? `${(d.pressure * 1.019716).toFixed(0)} m` : 'N/A'}</div>
                    <div><strong>Status:</strong> {isSelected ? 'Selected' : 'Available'}</div>
                  </div>
                </Popup>
              </Marker>
            ))
          })}

          <MapActions lat={lat} lon={lon} highlight={highlight} />
        </MapContainer>
      </div>
    </div>
  );
}