import React, { useEffect, useRef, useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'gatsby-plugin-firebase'
import { Button } from 'gatsby-theme-material-ui'
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
  const classes = useStyles()

  const timer = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)
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
              title: serverData.name,
              'marker-color': serverData.color,
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
        element.download = 'markers.geojson'
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

  const updateCenter = () => {
    const zoom = mapRef.current.getZoom()
    const { lng, lat } = mapRef.current.getCenter()
    firebase
      .firestore()
      .collection('params')
      .doc('mapCenter')
      .update({ LngLat: [lng, lat], zoom: zoom })
      .catch(function (error) {
        console.error('Error writing document: ', error)
      })
  }

  useEffect(() => {
    firebase
      .firestore()
      .collection('params')
      .doc('mapCenter')
      .get()
      .then((doc) => {
        const { LngLat, zoom } = doc.data()
        const map = new Map({
          attributionControl: false,
          container: 'map',
          style: 'https://api.maptiler.com/maps/26d5835c-e2ed-4494-bf8d-2fd2d97b787c/style.json?key=PS6lrXSMa4E9FzduhwA2',
          center: LngLat,
          zoom: zoom,
        })
        mapRef.current = map
        map.on('load', () => {
          setIsLoaded(true)
        })
      })

    return () => {
      // Cleanup the map
      mapRef.current.off()
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const unsubscribe = firebase
        .firestore()
        .collection(`layers`)
        .doc('xNMZJLF9yLNEZGGUPLQc')
        .onSnapshot((querySnapshot) => {
          if (mapRef.current.getLayer('zone')) mapRef.current.removeLayer('zone')
          if (mapRef.current.getLayer('points')) mapRef.current.removeLayer('points')
          if (mapRef.current.getLayer('lines')) mapRef.current.removeLayer('lines')
          if (mapRef.current.getSource('xNMZJLF9yLNEZGGUPLQc')) mapRef.current.removeSource('xNMZJLF9yLNEZGGUPLQc')
          const data = querySnapshot.data()
          const obj = JSON.parse(data.geojson)
          mapRef.current.addSource('xNMZJLF9yLNEZGGUPLQc', {
            type: 'geojson',
            data: obj,
          })
          mapRef.current.addLayer({
            id: 'zone',
            type: 'fill',
            source: 'xNMZJLF9yLNEZGGUPLQc',
            paint: {
              'fill-color': ['case', ['to-boolean', ['get', 'fill']], ['get', 'fill'], 'grey'],
              'fill-opacity': ['case', ['to-boolean', ['get', 'fill-opacity']], ['get', 'fill-opacity'], 0.4],
            },
            filter: ['==', '$type', 'Polygon'],
          })
          mapRef.current.addLayer({
            id: 'points',
            type: 'symbol',
            minzoom: 10,
            source: 'xNMZJLF9yLNEZGGUPLQc',
            paint: {
              'text-color': '#404040',
            },
            layout: {
              'icon-image': 'circle-11',
              'text-field': ['get', 'title'],
              'text-font': ['Roboto sans-serif', 'Arial Unicode MS Regular'],
              'text-offset': [0, 0.6],
              'text-anchor': 'top',
              'text-size': 12,
            },
            filter: ['==', '$type', 'Point'],
          })
          mapRef.current.addLayer({
            id: 'lines',
            type: 'line',
            source: 'xNMZJLF9yLNEZGGUPLQc',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': ['case', ['to-boolean', ['get', 'stroke']], ['get', 'stroke'], 'grey'],
              'line-width': ['case', ['to-boolean', ['get', 'stroke-width']], ['get', 'stroke-width'], 1],
              'line-opacity': ['case', ['to-boolean', ['get', 'stroke-opacity']], ['get', 'stroke-opacity'], 1],
            },
            filter: ['==', '$type', 'LineString'],
          })
        })
      return unsubscribe
    }
  }, [isLoaded])

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
        <Button onClick={updateCenter} variant='contained'>
          Update Center
        </Button>
        <Button to={`/12345/admin/map/geojson/`} variant='contained'>
          Geojson
        </Button>
        <Button onClick={downloadMarkers} variant='contained'>
          Download
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
    </div>
  )
}

export default MyMapModif
