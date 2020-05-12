import React, { useEffect, useRef } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { Map, Popup, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const useStyles = makeStyles({
  height100: {
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100)',
  },
})

const MyMap = () => {
  const classes = useStyles()

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
