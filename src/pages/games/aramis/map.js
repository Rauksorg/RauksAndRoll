import React, { useEffect, useRef, useContext, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { Map, Popup, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useSelector } from 'react-redux'

import MapContext from '../../../components/state'

const useStyles = makeStyles({
  height100: {
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100 - 56px)',
  },
})

const resize = () => {
  let vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

const MyMap = () => {
  const classes = useStyles()
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapParams = useSelector((state) => state.params.paramsList.map)
  const paramsLoading = useSelector((state) => state.params.loading)
  const generalLayer = useSelector((state) => state.layers.layersList.general)
  const layersLoading = useSelector((state) => state.layers.loading)
  const markers = useSelector((state) => state.markers.markersList)
  const markersLoading = useSelector((state) => state.markers.loading)
  const mapRef = useRef(null)
  const markerRef = useRef([])

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
      zoom: [10],
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
    const { zoom, center } = mapParams
    mapRef.current.setZoom(zoom)
    mapRef.current.setCenter(center)
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
    markerRef.current.forEach((element) => {
      element.remove()
    })
    markerRef.current = Object.keys(markers).map((key) => {
      const current = markers[key]
      const color = current.color ? current.color : 'blue'
      return new Marker({ color: color }).setLngLat(current.LngLat).addTo(mapRef.current).setPopup(new Popup().setText(current.name))
    })
  }, [mapLoaded, markersLoading, markers])

  return <div className={classes.height100} style={{ width: '100%' }} id='map'></div>
}

export default MyMap
