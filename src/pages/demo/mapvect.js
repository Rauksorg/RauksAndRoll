import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/6e26ffd3-8488-4bf7-aea3-2188a0e72192/style.json?key=sAY5rQ2VcCnfqg94kLHD',
      center: [11.47535, 53.09155],
      zoom: 15
    });
    markerRef.current = new mapboxgl.Marker({  draggable: true })
      .setLngLat([11.47535, 53.09155])
      .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
      .addTo(mapRef.current);
    return () => {
      // Cleanup the map
      mapRef.current.off();
      mapRef.current.remove();
    }
  }, []);

  return <div style={{ width: '100%', height: '400px' }} id='map'></div>
}

export default Map