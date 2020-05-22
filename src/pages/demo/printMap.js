import React, { useEffect, useRef, useContext, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapContext from '../../components/state'
import { Button } from 'gatsby-theme-material-ui'

// add a modal for loading to hide scrollbar

const PrintMap = () => {
  const [mapOptions] = useContext(MapContext)
  const mapRef = useRef(null)
  const [mapLayer, setMapLayer] = useState(null)
  const [mapMarkers, setMapMarkers] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const map = new Map({
      attributionControl: false,
      container: 'map',
      preserveDrawingBuffer: 'true',
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
    firebase
      .firestore()
      .collection(`layers`)
      .doc('xNMZJLF9yLNEZGGUPLQc')
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.data()
        setMapLayer(JSON.parse(data.geojson))
      })
  }, [])

  useEffect(() => {
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

        setMapMarkers(geojson)
      })
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
    if (isLoaded && mapMarkers) {
      if (mapRef.current.getLayer('markers')) mapRef.current.removeLayer('markers')
      if (mapRef.current.getSource('markersSource')) mapRef.current.removeSource('markersSource')
      mapRef.current.addSource('markersSource', {
        type: 'geojson',
        data: mapMarkers,
      })
      mapRef.current.addLayer({
        id: 'markers',
        type: 'symbol',
        minzoom: 10,
        source: 'markersSource',
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
    }
  }, [isLoaded, mapMarkers])

  const downloadMap = () => {
    const img = mapRef.current.getCanvas().toDataURL('image/png')
    const element = document.createElement('a')
    element.href = img
    element.download = 'map.png'
    document.body.appendChild(element) // Required for FireFox
    element.click()
  }

  return (
    <div>
      <Button onClick={downloadMap} variant='contained'>
        Download
      </Button>
      <div style={{ width: '1189mm', height: '841mm', visibility: 'hidden' }} id='map'></div>
    </div>
  )
}

export default PrintMap
