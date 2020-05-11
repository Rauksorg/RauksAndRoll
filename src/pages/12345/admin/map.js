import React, { useEffect, useRef, useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'gatsby-plugin-firebase'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Map, Popup, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  small: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}))

const ColorSelect = ({ markerId, color = 'blue' }) => {
  const classes = useStyles()
  const [menuColor, setMenuColor] = useState(color)

  const handleChange = (event) => {
    const color = event.target.value
    const name = event.target.name
    setMenuColor(color)
    firebase.firestore().collection(`markersv2`).doc(name).update({
      color: color,
    })
  }

  useEffect(() => {
    setMenuColor(color)
  }, [color])

  return (
    <Select value={menuColor} onChange={handleChange} name={markerId}>
      <MenuItem value={'blue'}>
        <Avatar style={{ backgroundColor: 'blue' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
      <MenuItem value={'orange'}>
        <Avatar style={{ backgroundColor: 'orange' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
      <MenuItem value={'green'}>
        <Avatar style={{ backgroundColor: 'green' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
    </Select>
  )
}

const MyMapModif = () => {
  const timer = useRef(null)
  const classes = useStyles()
  const mapRef = useRef(null)
  const markerRef = useRef([])
  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }), {})

  const handleChange = (evt) => {
    // with a very fsat and unsual field swith it is possible to skip the save
    clearTimeout(timer.current)
    const name = evt.target.name
    const newData = userInput[name]
    newData.name = evt.target.value
    setUserInput({ [name]: newData })
    timer.current = setTimeout(() => {
      firebase.firestore().collection(`markersv2`).doc(name).update({
        name: newData.name,
      })
    }, 400)
  }

  const addMarker = () => {
    const newMarkerRef = firebase.firestore().collection('markersv2').doc()
    console.log(newMarkerRef.id)
    const { lng, lat } = mapRef.current.getCenter()
    const newOrder = Date.now()
    const payload = { name: '', LngLat: [lng, lat], order: newOrder }
    newMarkerRef.set(payload).catch((error) => {
      console.error('Error adding document: ', error)
    })
    setUserInput({ [newMarkerRef.id]: payload })
  }

  const deleteMarker = (id) => {
    const newData = userInput[id]
    newData.deleted = true
    setUserInput({ [id]: newData })
    firebase.firestore().collection('markersv2').doc(id).update({ deleted: true })
  }

  const downloadMarkers = () => {
    firebase
      .firestore()
      .collection(`markersv2`)
      .orderBy('order')
      .get()
      .then((querySnapshot) => {
        const features = []
        querySnapshot.forEach((doc) => {
          const serverData = doc.data()
          const featureTemplate = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: serverData.LngLat,
            },
            properties: {
              name: serverData.name,
              color: serverData.color,
              order: serverData.order,
              id: doc.id,
            },
          }
          if (!serverData.deleted) {
            features.push(featureTemplate)
          }
        })
        const geojson = {
          type: 'FeatureCollection',
          features: features,
        }
        // Create the file to save
        const element = document.createElement('a')
        const file = new Blob([JSON.stringify(geojson)], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = 'markers.json'
        document.body.appendChild(element) // Required for FireFox
        element.click()
      })
  }

  const savePosition = (e) => {
    const key = e.target.feature.id
    const { lng, lat } = e.target.getLngLat()
    firebase
      .firestore()
      .collection('markersv2')
      .doc(key)
      .update({ LngLat: [lng, lat] })
      .catch(function (error) {
        console.error('Error writing document: ', error)
      })
  }

  useEffect(() => {
    mapRef.current = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/26d5835c-e2ed-4494-bf8d-2fd2d97b787c/style.json?key=PS6lrXSMa4E9FzduhwA2',
      center: [11.47535, 53.09155],
      zoom: 15,
    })
    return () => {
      // Cleanup the map
      mapRef.current.off()
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    // Add markers to map
    const unsubscribe = firebase
      .firestore()
      .collection(`markersv2`)
      .orderBy('order')
      .onSnapshot((querySnapshot) => {
        // Delete Previous Markers and refs
        markerRef.current.forEach((element) => {
          element.remove()
        })
        markerRef.current = []
        querySnapshot.forEach((element) => {
          const elementData = element.data()
          const id = element.id
          const color = elementData.color ? elementData.color : 'blue'
          if (!elementData.deleted) {
            // hide deleted MArkers
            const newMarker = new Marker({ draggable: true, color: color }).setLngLat(elementData.LngLat).addTo(mapRef.current).setPopup(new Popup().setText(elementData.name).addTo(mapRef.current))
            newMarker.on('dragend', savePosition)
            newMarker.feature = { id: id, name: elementData.name }
            markerRef.current.push(newMarker)
          }
        })
        // add the TextFields if from server
        if (!querySnapshot.metadata.hasPendingWrites) {
          const obj = {}
          querySnapshot.forEach((element) => {
            const id = element.id
            obj[id] = element.data()
          })
          setUserInput(obj)
        }
      })
    return unsubscribe
  }, [])

  let i = 0
  return (
    <div>
      <div style={{ width: '100%', height: '600px' }} id='map'></div>
      <div style={{ marginBottom: '15px' }}>
        <Button onClick={addMarker} variant='contained'>
          Add
        </Button>
      </div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          {Object.keys(userInput).map((element) => {
            const name = userInput[element].name
            const color = userInput[element].color
            if (userInput[element].deleted) return <span key={element}></span>
            i++
            return (
              <Grid item xs={3} key={element}>
                <TextField
                  style={{ width: '100%' }}
                  variant='outlined'
                  name={element}
                  key={element}
                  label={`Marker ${i}`}
                  value={name != null ? name : '...'}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <ColorSelect markerId={element} color={color} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          name={element}
                          onClick={() => {
                            deleteMarker(element)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )
          })}
        </Grid>
      </div>
      <div>
        <Button onClick={downloadMarkers} variant='contained'>
          Download
        </Button>
      </div>
    </div>
  )
}

export default MyMapModif
