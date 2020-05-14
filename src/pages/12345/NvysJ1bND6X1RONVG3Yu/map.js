import React, { useEffect, useRef, useContext } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { Map, Popup, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapContext from '../../../components/state'

const useStyles = makeStyles({
  height100: {
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100 - 56px)',
  },
})

const MyMap = () => {
  const classes = useStyles()

  const [mapOptions] = useContext(MapContext)

  const mapRef = useRef(null)
  const markerRef = useRef([])

  const resize = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
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
      center: [10, 10],
      zoom: [5],
    })
    mapRef.current = map
    return () => {
      mapRef.current.off()
      mapRef.current.remove()
    }
  }, [])

  useEffect(() => {
    if (mapOptions) {
      mapRef.current.setZoom(mapOptions.zoom)
      mapRef.current.setCenter(mapOptions.LngLat)
    }
  }, [mapOptions])

  // removed coz perf problems
  // useEffect(() => {
  //   mapRef.current.on('dragend', function () {
  //     const { lng, lat } = mapRef.current.getCenter()
  //     changeMap([lng, lat], mapRef.current.getZoom())
  //   })
  //   mapRef.current.on('zoomend', function () {
  //     // update position between navigation trigger infinit loop because of first setzoom
  //     // const { lng, lat } = mapRef.current.getCenter()
  //     // changeMap([lng, lat], mapRef.current.getZoom())
  //   })
  // }, [changeMap])

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`layers`)
      .doc('xNMZJLF9yLNEZGGUPLQc')
      .onSnapshot((querySnapshot) => {
        if (mapRef.current.getLayer('zone')) mapRef.current.removeLayer('zone')
        if (mapRef.current.getLayer('points')) mapRef.current.removeLayer('points')
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
            'fill-color': '#888888',
            'fill-opacity': 0.4,
          },
          filter: ['==', '$type', 'Polygon'],
        })
        mapRef.current.addLayer({
          id: 'points',
          type: 'symbol',
          source: 'xNMZJLF9yLNEZGGUPLQc',
          layout: {
            'icon-image': 'circle-11',
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 0.6],
            'text-anchor': 'top',
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
            'line-color': '#888',
            'line-width': 8,
          },
          filter: ['==', '$type', 'LineString'],
        })
      })
    return unsubscribe
  }, [])

  useEffect(() => {
    // Add markers
    const unsubscribe = firebase
      .firestore()
      .collection(`markersv2`)
      .onSnapshot((querySnapshot) => {
        // Delete Previous Markers and refs
        markerRef.current.forEach((element) => {
          element.remove()
        })
        markerRef.current = []
        querySnapshot.forEach((element) => {
          if (!element.data().deleted) {
            const elementData = element.data()
            const color = elementData.color ? elementData.color : 'blue'
            const newMarkerRef = new Marker({ color: color }).setLngLat(elementData.LngLat).addTo(mapRef.current).setPopup(new Popup().setText(elementData.name))
            markerRef.current.push(newMarkerRef)
          }
        })
      })
    return unsubscribe
  }, [])

  return <div className={classes.height100} style={{ width: '100%' }} id='map'></div>
}

export default MyMap
