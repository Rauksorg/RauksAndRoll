import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import firebase from 'gatsby-plugin-firebase'
import { Button } from 'gatsby-theme-material-ui'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Paper from '@material-ui/core/Paper'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Map, Popup, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import { markersUpdateField, markersDelete, markersCreate } from '../../../../state/markersSlice'
import { paramsUpdateField } from '../../../../state/paramsSlice'

const useStyles = makeStyles((theme) => ({
  height70: {
    height: '70vh',
  },
  width100: {
    width: '100%',
  },
  small: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
  buttonSpacing: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

const ColorSelect = ({ gameId, color, markerId }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  // default value {color='blue'} doesn't works if color is empty string
  const correctColor = color ? color : 'blue'

  const handleChange = (event) => {
    const color = event.target.value
    const name = event.target.name
    // blue is default in db used for geojson export
    const dbColor = color === 'blue' ? '' : color
    dispatch(markersUpdateField({ gameId, markerId: name, data: { color: dbColor } }))
  }

  return (
    <Select value={correctColor} onChange={handleChange} name={markerId} disableUnderline>
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

const EditableChip = (props) => {
  const dispatch = useDispatch()
  const { label = '', color, markerId, edit, gameId, ...other } = props
  const [statusText, setStatusText] = useState(label)
  const [statusTextWidth, setStatusTextWidth] = useState('')
  const [editing, setEditing] = useState(false)

  const handleChange = (event) => {
    const newValue = event.target.value
    setStatusText(newValue)
  }

  const setEditTrue = () => {
    setEditing(true)
  }

  const handleClickAway = () => {
    setEditing(false)
    dispatch(markersUpdateField({ gameId, markerId, data: { name: statusText } }))
  }

  const enterPressed = (event) => {
    if (event.key === 'Enter') {
      setEditing(false)
      dispatch(markersUpdateField({ gameId, markerId, data: { name: statusText } }))
    }
  }

  // useEffect(() => {
  //   if (editing) edit(markerId, true)
  //   if (!editing) edit(markerId, false)
  // }, [editing, edit, markerId])

  useEffect(() => {
    setStatusTextWidth(statusText.length * 0.5 + 7 + 'em')
  }, [statusText])

  const myChip = <Chip style={{ backgroundColor: color }} label={statusText} onClick={() => {}} onMouseDown={setEditTrue} {...other} /> //onMouseDown to permit to edit just after leaving an other chip, onClick allow hover
  const myText = (
    <ClickAwayListener mouseEvent='onMouseDown' touchEvent='onTouchStart' onClickAway={handleClickAway}>
      <Input
        name={markerId}
        style={{ width: statusTextWidth, maxWidth: '500px' }}
        value={statusText}
        disableUnderline={true}
        onKeyDown={enterPressed}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position='start'>
            <ColorSelect color={color} markerId={markerId} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              onClick={() => {
                dispatch(markersDelete({ gameId, markerId }))
              }}
            >
              <DeleteIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </ClickAwayListener>
  )
  return editing ? myText : myChip
}

const NewChipInput = ({ gameId }) => {
  const dispatch = useDispatch()
  const LngLat = useSelector((state) => state.params.paramsList.map.LngLat)
  const [newChipText, setNewChipText] = useState('')

  // Does it needs useState ?
  const [newChipTextWidth, setNewChipTextWidth] = useState('')

  const handleBlur = () => {
    if (newChipText) {
      dispatch(markersCreate({ gameId, data: { name: newChipText, LngLat } }))
      setNewChipText('')
    }
  }

  const enterPressed = (event) => {
    if (event.key === 'Enter' && newChipText) {
      dispatch(markersCreate({ gameId, data: { name: newChipText, LngLat } }))
      setNewChipText('')
    }
  }

  const handleChange = (event) => {
    setNewChipText(event.target.value)
  }

  useEffect(() => {
    setNewChipTextWidth(newChipText.length * 0.5 + 7 + 'em')
  }, [newChipText, setNewChipTextWidth])

  return (
    <Input
      style={{ width: newChipTextWidth, maxWidth: '500px' }}
      autoComplete='off'
      value={newChipText}
      onKeyDown={enterPressed}
      onBlur={handleBlur}
      onChange={handleChange}
      id='input-with-icon-grid'
      label='With a grid'
      disableUnderline={true}
      placeholder='Ajouter...'
    />
  )
}
const resize = () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

const MyMapModif = ({ location }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')

  const [mapLoaded, setMapLoaded] = useState(false)

  const mapRef = useRef(null)
  const markerRef = useRef({})
  const popupRef = useRef({})

  const markers = useSelector((state) => state.markers.markersList)
  const markersLoading = useSelector((state) => state.markers.loading)
  const mapParams = useSelector((state) => state.params.paramsList.map)
  const paramsLoading = useSelector((state) => state.params.loading)
  const generalLayer = useSelector((state) => state.layers.layersList.general)
  const layersLoading = useSelector((state) => state.layers.loading)

  const showHidePopup = (popupId, edit) => {
    if (edit) popupRef.current[popupId].addTo(mapRef.current)
    if (!edit) popupRef.current[popupId].remove()
  }

  const downloadJsonMarkers = () => {
    const features = Object.keys(markers).map((key) => {
      const current = markers[key]
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: current.LngLat,
        },
        properties: {
          title: current.name,
          'marker-color': current.color,
        },
      }
    })
    const geojson = {
      type: 'FeatureCollection',
      features,
    }
    // Create the file to save
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(geojson)], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'markers.geojson'
    document.body.appendChild(element) // Required for FireFox
    element.click()
  }

  const updateCenter = () => {
    const zoom = mapRef.current.getZoom()
    const { lng, lat } = mapRef.current.getCenter()
    dispatch(paramsUpdateField({ gameId, param: 'map', data: { LngLat: [lng, lat], zoom } }))
  }

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const map = new Map({
      attributionControl: false,
      container: 'map',
      style: 'https://api.maptiler.com/maps/26d5835c-e2ed-4494-bf8d-2fd2d97b787c/style.json?key=PS6lrXSMa4E9FzduhwA2',
      center: [0, 0],
      zoom: [1],
    })
    map.on('load', () => {
      setMapLoaded(true)
    })
    mapRef.current = map
    return () => {
      setMapLoaded(false)
      mapRef.current.off()
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    if (paramsLoading !== 'idle') return
    const { zoom, LngLat } = mapParams
    mapRef.current.setZoom(zoom)
    mapRef.current.setCenter(LngLat)
  }, [paramsLoading, mapParams])

  useEffect(() => {
    if (!mapLoaded || layersLoading !== 'idle') return
    const generalGeojson = JSON.parse(generalLayer.geojson)
    if (mapRef.current.getLayer('zone')) mapRef.current.removeLayer('zone')
    if (mapRef.current.getLayer('points')) mapRef.current.removeLayer('points')
    if (mapRef.current.getLayer('lines')) mapRef.current.removeLayer('lines')
    if (mapRef.current.getSource('general')) mapRef.current.removeSource('general')

    mapRef.current.addSource('general', {
      type: 'geojson',
      data: generalGeojson,
    })
    mapRef.current.addLayer({
      id: 'zone',
      type: 'fill',
      source: 'general',
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
      source: 'general',
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
      source: 'general',
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
  }, [mapLoaded, layersLoading, generalLayer])

  useEffect(() => {
    if (!mapLoaded || markersLoading !== 'idle') return

    const savePosition = (e) => {
      const markerId = e.target.feature.id
      const { lng, lat } = e.target.getLngLat()
      dispatch(markersUpdateField({ gameId, markerId, data: { LngLat: [lng, lat] } }))
    }

    Object.keys(markerRef.current).forEach((key) => {
      markerRef.current[key].remove()
    })
    Object.keys(markers).forEach((key) => {
      const current = markers[key]
      const color = current.color ? current.color : 'blue'
      const newPopup = new Popup().setText(current.name)
      const newMarker = new Marker({ draggable: true, color }).setLngLat(current.LngLat).addTo(mapRef.current).setPopup(newPopup)
      // what is name for ?
      newMarker.feature = { id: key, name: current.name }
      newMarker.on('dragend', savePosition)
      popupRef.current[key] = newPopup
      markerRef.current[key] = newMarker
    })
  }, [mapLoaded, markersLoading, markers, dispatch, gameId])

  return (
    <div>
      <div className={clsx(classes.height70, classes.width100)} id='map'></div>
      <div style={{ marginBottom: '15px' }} className={classes.buttonSpacing}>
        <Button onClick={updateCenter} variant='outlined'>
          Update Center
        </Button>
        <Button to={`/12345/admin/map/geojson/`} variant='outlined'>
          Geojson Layer
        </Button>
        <Button onClick={downloadJsonMarkers} variant='outlined'>
          Download Markers
        </Button>
      </div>
      <div>
        {markersLoading === 'idle' ? (
          <Paper variant='outlined' style={{ margin: '10px 0px 10px 0px', padding: '10px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, left: 12, backgroundColor: 'white' }}>Marqueurs</div>
            <Grid container spacing={1} alignItems='flex-end'>
              {Object.keys(markers).map((key) => {
                const current = markers[key]
                return (
                  <Grid item key={key}>
                    <EditableChip variant='outlined' gameId={gameId} markerId={key} label={current.name} color={current.color} edit={showHidePopup} />
                  </Grid>
                )
              })}
              <Grid item>{paramsLoading === 'idle' ? <NewChipInput gameId={gameId} /> : 'Loading...'}</Grid>
            </Grid>
          </Paper>
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  )
}

const MyMapModifOld = () => {
  const classes = useStyles()
  const mapRef = useRef(null)
  const markerRef = useRef([])
  const popupRef = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [mapLayer, setMapLayer] = useState(null)
  const [markersChip, setMarkersChip] = useState([])
  const [mapCenter, setMapCenter] = useState([])

  const downloadJsonMarkers = () => {
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
          features.push(featureTemplate)
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
        const { lng, lat } = map.getCenter()
        setMapCenter([lng, lat])
        map.on('moveend', () => {
          const { lng, lat } = map.getCenter()
          setMapCenter([lng, lat])
        })
      })

    return () => {
      mapRef.current.off()
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`layers`)
      .doc('xNMZJLF9yLNEZGGUPLQc')
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.data()
        setMapLayer(JSON.parse(data.geojson))
      })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (isLoaded && mapLayer) {
      if (mapRef.current.getLayer('zone')) mapRef.current.removeLayer('zone')
      if (mapRef.current.getLayer('points')) mapRef.current.removeLayer('points')
      if (mapRef.current.getLayer('lines')) mapRef.current.removeLayer('lines')
      if (mapRef.current.getSource('xNMZJLF9yLNEZGGUPLQc')) mapRef.current.removeSource('xNMZJLF9yLNEZGGUPLQc')
      mapRef.current.addSource('xNMZJLF9yLNEZGGUPLQc', {
        type: 'geojson',
        data: mapLayer,
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
    }
  }, [isLoaded, mapLayer])

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`markersv2`)
      .orderBy('order')
      .onSnapshot((querySnapshot) => {
        // Delete Previous Markers and refs to start from scratch
        markerRef.current.forEach((element) => {
          element.remove()
        })
        markerRef.current = []
        popupRef.current = []
        const markers = []
        let i = 0
        querySnapshot.forEach((element) => {
          const elementData = element.data()
          const id = element.id
          markers.push({ ...elementData, id: id, refKey: i })
          i++
          const color = elementData.color ? elementData.color : 'blue'
          const newPopup = new Popup().setText(elementData.name)
          const newMarker = new Marker({ draggable: true, color: color }).setLngLat(elementData.LngLat).addTo(mapRef.current).setPopup(newPopup)
          newMarker.on('dragend', savePosition)
          newMarker.feature = { id: id, name: elementData.name }
          markerRef.current.push(newMarker)
          popupRef.current.push(newPopup)
        })
        setMarkersChip(markers)
      })
    return unsubscribe
  }, [])

  const showHidePopup = (popupRefKey, edit) => {
    if (edit) popupRef.current[popupRefKey].addTo(mapRef.current)
    if (!edit) popupRef.current[popupRefKey].remove()
  }

  return (
    <div>
      <div style={{ width: '100%', height: '70vh' }} id='map'></div>
      <div style={{ marginBottom: '15px' }} className={classes.buttonSpacing}>
        <Button onClick={updateCenter} variant='outlined'>
          Update Center
        </Button>
        <Button to={`/12345/admin/map/geojson/`} variant='outlined'>
          Geojson Layer
        </Button>
        <Button onClick={downloadJsonMarkers} variant='outlined'>
          Download Markers
        </Button>
      </div>
      <div>
        <Paper variant='outlined' style={{ margin: '10px 0px 10px 0px', padding: '10px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -10, left: 12, backgroundColor: 'white' }}>Marqueurs</div>
          <Grid container spacing={1} alignItems='flex-end'>
            {markersChip.map((element) => {
              return (
                <Grid item key={element.id}>
                  <EditableChip variant='outlined' markerId={element.id} label={element.name} popupRefKey={element.refKey} color={element.color} edit={showHidePopup} />
                </Grid>
              )
            })}
            <Grid item>
              <NewChipInput mapCenter={mapCenter} />
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  )
}

export default MyMapModif
