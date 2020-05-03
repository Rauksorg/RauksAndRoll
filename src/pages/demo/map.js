import React, { useEffect, useRef, useReducer, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import firebase from "gatsby-plugin-firebase";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const MyMapModif = () => {
  const timer = useRef(null)
  const classes = useStyles();
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const [numberOfmarker, setNumberOfmarker] = useState(null)
  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }), {});

  const handleChange = (evt) => {
    // with a very fat and unsual field swith it is possible to skip the save
    clearTimeout(timer.current);
    const name = evt.target.name;
    const newData = userInput[name]
    newData.name = evt.target.value;
    setUserInput({ [name]: newData });
    timer.current = setTimeout(() => {
      console.log('saved')
      firebase
        .firestore()
        .collection(`markersv2`)
        .doc(name)
        .update({
          name: newData.name
        })
    }, 400);
  }

  const addMarker = () => {
    const { lng, lat } = mapRef.current.getCenter()
    const newOrder = numberOfmarker + 1
    const payload = { name: "", LngLat: [lng, lat], order: newOrder }

    firebase.firestore().collection("markersv2").add(payload)
      .then((docRef) => {
        setUserInput({ [docRef.id]: payload });
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  const deleteMarker = (id) => {
    const newData = userInput[id]
    newData.deleted = true
    setUserInput({ [id]: newData });
    firebase.firestore().collection("markersv2").doc(id).update({ deleted: true })
  }

  const savePosition = (e) => {
    const key = e.target.feature.id
    const { lng, lat } = e.target.getLngLat()
    firebase.firestore().collection("markersv2").doc(key).update({ LngLat: [lng, lat] })
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
      .collection(`markersv2`)
      .orderBy("order")
      .onSnapshot(querySnapshot => {
        setNumberOfmarker(querySnapshot.size)
        // Delete Previous Markers and refs
        markerRef.current.forEach(((element) => { element.remove() }))
        markerRef.current = []
        querySnapshot.forEach((element) => {

          const elementData = element.data()
          const id = element.id
          const newMarker = new Marker({ draggable: true })
            .setLngLat(elementData.LngLat)

          if (!elementData.deleted) {
            // hide deleted MArkers
            newMarker.addTo(mapRef.current)
              .setPopup(new Popup().setText(elementData.name).addTo(mapRef.current));
            newMarker.on('dragend', savePosition)
          }

          newMarker.feature = { id: id, name: elementData.name }
          newMarker.on('dragend', savePosition)
          markerRef.current.push(newMarker)
        });

        // add the TextFields
        if (!querySnapshot.metadata.hasPendingWrites) {
          console.log('ext')
          const obj = {}
          querySnapshot.forEach((element) => {
            const id = element.id
            obj[id] = element.data()
          })
          setUserInput(obj)
        }
      })
    return unsubscribe
  }, []);
  let i = 0
  return (

    <div>
      <div style={{ width: '100%', height: '600px' }} id='map'></div>
      <div style={{ marginBottom: '15px' }}>
        <Button onClick={addMarker} variant="contained">Add</Button>
      </div>
      <div className={classes.root}>
        <Grid container spacing={3} >
          {Object.keys(userInput).map((element) => {
            const name = userInput[element].name
            if (userInput[element].deleted) return <span key={element}></span>
            i++
            return (
              <Grid item xs={3} key={element} >
                <TextField style={{ width: '100%' }} variant="outlined" name={element} key={element} label={`Marker ${i}`} value={name != null ? name : '...'} onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><IconButton name={element} onClick={() => { deleteMarker(element) }}><DeleteIcon /></IconButton></InputAdornment>,
                  }}
                />
              </Grid>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default MyMapModif;