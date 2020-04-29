import React, { useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MyMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const popupsRef = useRef([])
  const [popups, setPopups] = useState([])

  const saveMarkers = () => {
    markerRef.current.forEach((element, i) => {
      console.log(popups[i], element.getLngLat())
    })
  }

  const addMarker = () => {
    markerRef.current.push(new Marker({ draggable: true })
      .setLngLat([11.47435, 53.09155])
      .addTo(mapRef.current)
    )
    setPopups([...popups, 'hello'])
  }

  useEffect(() => {
    const markersList = [{ name: 'Phare', LngLat: [11.47535, 53.09155] }, { name: 'Maison', LngLat: [11.47595, 53.09155] }]
    mapRef.current = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/6e26ffd3-8488-4bf7-aea3-2188a0e72192/style.json?key=sAY5rQ2VcCnfqg94kLHD',
      center: [11.47535, 53.09155],
      zoom: 15
    });

    // Need to separate popups from markers to change popus name without recreating the markers
    markersList.forEach((element, i) => {
      markerRef.current[i] = new Marker({ draggable: true })
        .setLngLat(element.LngLat)
        .addTo(mapRef.current);
      setPopups(p => [...p, element.name])
    })

    return () => {
      // Cleanup the map
      mapRef.current.off();
      mapRef.current.remove();
    }
  }, []);
  

  useEffect(() => {
    // Add popups to markers
    markerRef.current.forEach((element, i) => {
      element.setPopup(popupsRef.current[i] = new Popup().setHTML(`<h1>${popups[i]}</h1>`))
    })

  }, [popups]);

  return (
    <div>
      <div style={{ width: '100%', height: '400px' }} id='map'></div>
      <Button onClick={addMarker} variant="contained">Add</Button>
      <Button onClick={saveMarkers} variant="contained">Save</Button>
    </div>
  )
}

export default MyMap