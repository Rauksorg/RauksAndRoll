import React from 'react';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

const Map = () => {
  const mapRef = React.useRef(null);
  const markRef = React.useRef(null);
  const layerRef = React.useRef(null);

  const onMapClick = (e) => {
    console.log('clicloc', e.latlng)
    console.log('narkloc', markRef.current.getLatLng())
  }

  React.useEffect(() => {
    // Fix icon import
    const DefaultIcon = L.icon({
      ...L.Icon.Default.prototype.options,
      iconUrl: icon,
      iconRetinaUrl: iconRetina,
      shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    mapRef.current = L.map('map', {
      attributionControl: false,
      center: [49.8419, 24.0315],
      zoom: 10,
      layers: [L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')]
    });

    
    mapRef.current.on('click', onMapClick);
    return () => {
      // Cleanup the map
      mapRef.current.off();
      mapRef.current.remove();
    }
  }, []);

  React.useEffect(() => {
    layerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  React.useEffect(() => {
    layerRef.current.clearLayers();
    markRef.current = L.marker([49.8419, 24.0315], { title: 'Hello', draggable: true })
      .addTo(layerRef.current)
      .bindPopup("<b>Hello world!</b><br>I am a popup.")
  }, []);

  return <div style={{ width: '100%', height: '400px' }} id="map"></div>
}

export default Map
