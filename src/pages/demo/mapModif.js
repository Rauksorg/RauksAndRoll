import React, { useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Is it possible to consolidate ref of markers and popup while separating them in different useEffect ?
const MyMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const popupsRef = useRef([])
  const [popups, setPopups] = useState([])

  const handleChange = (id, event) => {
    // is there a betterway to update array of State ?
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

  const deleteMarker = (id) => {
    markerRef.current[id].remove()
    markerRef.current.splice(id, 1)
    popupsRef.current.splice(id, 1)
    let newValue = [...popups]
    newValue.splice(id, 1)
    setPopups(newValue)
  }

  useEffect(() => {
    const markersList = [{ name: 'Phare', LngLat: [11.47535, 53.09155] }, { name: 'Maison', LngLat: [11.47595, 53.09155] }]
    mapRef.current = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/26d5835c-e2ed-4494-bf8d-2fd2d97b787c/style.json?key=PS6lrXSMa4E9FzduhwA2',
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
      element.setPopup(popupsRef.current[i] = new Popup().setText(popups[i]).addTo(mapRef.current))
    })

  }, [popups]);

  return (
    <div>
      <div style={{ width: '100%', height: '600px' }} id='map'></div>
      <div>
        <Button onClick={addMarker} variant="contained">Add</Button>
        <Button onClick={saveMarkers} variant="contained">Save</Button>
      </div>
      <div>
        {popups.map((element, i) => (
          <div key={i}>
            <TextField key={i} label={`Marker ${i + 1}`} value={element}
              InputProps={{
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => { deleteMarker(i) }}><DeleteIcon /></IconButton></InputAdornment>,
              }}
              onChange={(e) => handleChange(i, e)} />
          </div>))}
      </div>
    </div>
  )
}

export default MyMap