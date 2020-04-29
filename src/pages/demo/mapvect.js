import React, { useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Is it possible to consolidate ref of markers and popup while separating them in different useEffect ?
const MyMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const popupsRef = useRef([])
  const [popups, setPopups] = useState([])

  const handleChange = (id, event) => {
    let newValue = [...popups]
    newValue[id] = event.target.value
    setPopups(newValue);
  };

  const saveMarkers = () => {
    markerRef.current.forEach((element, i) => {
      console.log(popups[i], element.getLngLat())
    })
  }

  const addMarker = () => {
    markerRef.current.push(new Marker({ draggable: true })
      .setLngLat(mapRef.current.getCenter())
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
    // Need to separate popups from markers to change popus name without recreating the markers and saving theur positions
    markerRef.current.forEach((element, i) => {
      element.setPopup(popupsRef.current[i] = new Popup().setText(popups[i]))
    })

  }, [popups]);

  return (
    <div>
      <div style={{ width: '100%', height: '400px' }} id='map'></div>
      <div>
        <Button onClick={addMarker} variant="contained">Add</Button>
        <Button onClick={saveMarkers} variant="contained">Save</Button>
      </div>
      <div>
        {popups.map((element, i) => <TextField key={i} label="Marker Name" value={element} onChange={(e) => handleChange(i, e)} />)}
      </div>
    </div>
  )
}

export default MyMap