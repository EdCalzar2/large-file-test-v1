import React, { useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, FeatureGroup } from "react-leaflet";
import mapMarker from '../../assets/final_logo.png'
import './SafetyMap.css'
import L from "leaflet";

import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css'; 
import 'leaflet-draw/dist/leaflet.draw.css'
import osm from "../osm-providers.js";
import markerShadow from 'leaflet/dist/images/marker-shadow.png';



// Override the default icon for ALL markers (including drawing tools)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: mapMarker,
    iconRetinaUrl: mapMarker,
    shadowUrl: markerShadow, // Remove shadow if you don't want it
    iconSize: [30, 50],
    iconAnchor: [15, 50],
    popupAnchor: [0, -50],
    shadowSize: [41, 41],      // Default Leaflet shadow size
    shadowAnchor: [13, 41],
})

export const Safety_map = () => {
    const [center, setCenter] = useState({ lat: 14.412687356644929, lng: 120.98123147922286 })
    const ZOOM_LEVEL = 20;
    const mapRef = useRef();

    const _created = (e) => {
    // Check if the created layer is a marker (not a shape)
    if (e.layerType === 'marker') {
        const marker = e.layer;
        const position = marker.getLatLng();
        const lat = position.lat;
        const lng = position.lng;

        // Enable dragging for the marker
        marker.dragging.enable();

        // Function to update popup content
        const updatePopup = (lat, lng) => `
            <b>Latitude:</b> ${lat.toFixed(6)}<br/>
            <b>Longitude:</b> ${lng.toFixed(6)}
        `;

        // Bind the popup to the marker and open it
        marker.bindPopup(updatePopup(lat, lng), { autoPan: false }).openPopup();

        // Listen for marker move and update popup
        marker.on('moveend', function (event) {
            const newPos = event.target.getLatLng();
            marker.setPopupContent(updatePopup(newPos.lat, newPos.lng)).openPopup();
        });
        }
    };

    return (
  <>
    <div className='safetyMap'>
      <h2>Safety Map</h2>
      
        <MapContainer
          center={[center.lat, center.lng]}
            zoom={ZOOM_LEVEL}
            ref={mapRef}
            style={{ height: '500px', width: '80%', margin: '0 auto' }}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            keyboard={false}
            zoomControl={false}
        >
          <FeatureGroup>
            <EditControl
              position='topright'
              onCreated={_created}
              draw={{
                rectangle: false,
                circle: false,
                circlemarker: false,
                polygon: false,
                polyline: false
              }}
            />
          </FeatureGroup>
          <TileLayer
            url={osm.mapTiler.url}
            attribution={osm.mapTiler.attribution}
          />
        </MapContainer>
      </div>
  </>
)
}