import React, { useEffect, useRef } from "react";
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MyMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapRef.current = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/6e26ffd3-8488-4bf7-aea3-2188a0e72192/style.json?key=sAY5rQ2VcCnfqg94kLHD',
      center: [11.47535, 53.09155],
      zoom: 15
    });
    markerRef.current = new Marker({ draggable: true })
      .setLngLat([11.47535, 53.09155])
      .setPopup(new Popup().setHTML("<h1>Hello World!</h1>"))
      .addTo(mapRef.current);
    return () => {
      // Cleanup the map
      mapRef.current.off();
      mapRef.current.remove();
    }
  }, []);

  return <div style={{ width: '100%', height: '400px' }} id='map'></div>
}

export default MyMap