import React, { useEffect, useRef } from "react";
import firebase from "gatsby-plugin-firebase";
import { Map, Popup, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MyMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef([]);

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
        console.log(querySnapshot.size)
        // Delete Previous Markers
        markerRef.current.forEach(((element, i, arr) => {
          element.remove()
          console.log('removed', i)
        }))
        markerRef.current = []


        querySnapshot.forEach((element) => {
          const elementData = element.data()
          console.log(element.id)
          markerRef.current[element.id] = new Marker()
            .setLngLat(elementData.LngLat)
            .addTo(mapRef.current)
            .setPopup(new Popup().setText(elementData.name))

        });
      })

    return unsubscribe
  }, []);

  return <div style={{ width: '100%', height: '600px' }} id='map'></div>
}

export default MyMap