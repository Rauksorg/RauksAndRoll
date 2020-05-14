import React, { useEffect, useRef, useContext, useState } from 'react'
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

  const [isLoaded, setIsLoaded] = useState(false)
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
    map.on('load', () => {
      setIsLoaded(true)
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
    const unsubscribe = firebase
      .firestore()
      .collection(`markersv2`)
      .onSnapshot((querySnapshot) => {
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
