import React, { useEffect, useRef, useState } from "react";
import firebase from "gatsby-plugin-firebase";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MyMapModif = () => {
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const [markersReact, setmarkersReact] = useState([])

  const handleChange = (id, event) => {
    // Perf problem if deleting fast or typing fast because textfiel are recreated on markerchanges and/or updated twice
    firebase
      .firestore()
      .doc(`markers/${id}`)
      .update({
        name: event.target.value
      })
  };

  const addMarker = () => {
    const { lng, lat } = mapRef.current.getCenter()
    const key = markersReact.length
    console.log( markersReact)
    const payload = { name: "", LngLat: [lng, lat] }

    firebase.firestore().collection("markers").doc(key.toString()).set(payload)
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  const deleteMarker = (id) => {
    firebase.firestore().collection("markers").doc(id.toString()).delete()
  }

  const savePosition = (e) => {
    const key = e.target.feature.id
    const { lng, lat } = e.target.getLngLat()


    firebase.firestore().collection("markers").doc(key.toString()).update({LngLat: [lng, lat] })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  useEffect(() => {
    mapRef.current = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/26d5835c-e2ed-4494-bf8d-2fd2d97b787c/style.json?key=PS6lrXSMa4E9FzduhwA2',
      center: [11.47535, 53.09155],
      zoom: 15
    });

    return () => {
      // Cleanup the map
      mapRef.current.off();
      mapRef.current.remove();
    }
  }, []);

  useEffect(() => {
    // Add markers
    const unsubscribe = firebase
      .firestore()
      .collection(`markers`)
      .onSnapshot(querySnapshot => {
        // Delete Previous Markers and refs  
        markerRef.current.forEach(((element) => {
          element.remove()
        }))
        markerRef.current = []
        const markers = []

        querySnapshot.forEach((element) => {
          const elementData = element.data()
          const id = element.id
          markers[id] = { ...elementData, id } // add document id to the array
          const newMarker = new Marker({ draggable: true })
            .setLngLat(elementData.LngLat)
            .addTo(mapRef.current)
            .setPopup(new Popup().setText(elementData.name).addTo(mapRef.current));
          newMarker.feature = { id: id, title: elementData.name }
          newMarker.on('dragend', savePosition)
          markerRef.current[element.id] = newMarker
        });
        setmarkersReact(markers)
      })
    return unsubscribe
  }, []);

  return (
    <div>
      <div style={{ width: '100%', height: '600px' }} id='map'></div>
      <div>
        <Button onClick={addMarker} variant="contained">Add</Button>
      </div>
      <div>
        {/* Perf problem if deleting fast or typing fast because textfiel are recreated on markerchanges */}
        {markersReact.map((element) => {
          const id = element.id
          return (
            <div key={id}>
              <TextField key={id} label={`Marker ${parseInt(id, 10) + 1}`} value={element.name} onChange={(e) => handleChange(id, e)}
                InputProps={{
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => { deleteMarker(id) }}><DeleteIcon /></IconButton></InputAdornment>,
                }}
              />
            </div>)
        })}
      </div>
    </div>
  )
}

export default MyMapModif