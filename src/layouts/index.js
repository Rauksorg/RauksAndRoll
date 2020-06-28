import React, { useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import RoomIcon from '@material-ui/icons/Room'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import DescriptionIcon from '@material-ui/icons/Description'
import Container from '@material-ui/core/Container'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import AppBar from '@material-ui/core/AppBar'
import { BottomNavigationAction } from 'gatsby-theme-material-ui'
import MapContext from '../components/state'
import { useDispatch } from 'react-redux'
import { playersUpdate, playersLoaded } from '../state/playersSlice'
import { markersUpdate, markersLoaded } from '../state/markersSlice'
import { paramsUpdate, paramsLoaded } from '../state/paramsSlice'
import { layersUpdate, layersLoaded } from '../state/layersSlice'

const useStyles = makeStyles({
  paper: {
    paddingBottom: 56,
  },
})

const useListner = (gameId, collection, update, loaded) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`games`)
      .doc(gameId)
      .collection(collection)
      .onSnapshot((querySnapshot) => {
        // eslint-disable-next-line no-sequences
        const arrayToObj = querySnapshot.docs.reduce((obj, doc) => ((obj[doc.id] = doc.data()), obj), {})
        dispatch(update(arrayToObj))
        dispatch(loaded())
      })
    return unsubscribe
  }, [dispatch, gameId, collection, update, loaded])
}

const FirestoreRedux = ({ gameId }) => {
  useListner(gameId, 'players', playersUpdate, playersLoaded)
  useListner(gameId, 'markers', markersUpdate, markersLoaded)
  useListner(gameId, 'params', paramsUpdate, paramsLoaded)
  useListner(gameId, 'layers', layersUpdate, layersLoaded)
  return null
}

const BottomNav = ({ children, location }) => {
  const classes = useStyles()
  const search = location.search
  const navLocation = location.pathname.split('/')[3]
  const playerId = location.pathname.split('/')[2]
  const [value, setValue] = useState(navLocation)

  const handleChange = (_, newValue) => {
    setValue(newValue)
  }

  return (
    <div>
      <Container disableGutters className={classes.paper} maxWidth='md'>
        {children}
      </Container>
      <AppBar component={'div'} position='fixed' style={{ top: 'auto', bottom: 0 }}>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction to={`/games/${playerId}/players/${search}`} label='Players' value='players' icon={<FormatListBulletedIcon />} />
          <BottomNavigationAction to={`/games/${playerId}/character/${search}`} label='Character' value='character' icon={<DescriptionIcon />} />
          <BottomNavigationAction to={`/games/${playerId}/map/${search}`} label='Maps' value='map' icon={<RoomIcon />} />
          <BottomNavigationAction to={`/games/${playerId}/dice/${search}`} label='Dice' value='dice' icon={<PlayArrowIcon />} />
        </BottomNavigation>
      </AppBar>
    </div>
  )
}

const Layout = ({ children, location, pageContext }) => {
  const [mapOptions, setMapOptions] = useState({ LngLat: [10,10], zoom: [5] })

  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')

  const changeMap = (center, zoom) => {
    setMapOptions({ LngLat: center, zoom: zoom })
  }

  // useEffect(() => {
  //   const unsubscribe = firebase
  //     .firestore()
  //     .collection(`params`)
  //     .doc('map')
  //     .onSnapshot((querySnapshot) => {
  //       setMapOptions(querySnapshot.data())
  //     })
  //   return unsubscribe
  // }, [])

  // if (pageContext.layout === 'setup') {
  //   return (
  //     <Container maxWidth='md'>
  //       <FirebaseRedux gameId={gameId} />
  //       {children}
  //     </Container>
  //   )
  // }
  if (pageContext.layout === 'noLayout') {
    return (
      <MapContext.Provider value={[mapOptions, changeMap]}>
        {children}
        <FirestoreRedux gameId={gameId} />
      </MapContext.Provider>
    )
  }
  if (pageContext.layout === 'admin') {
    return (
      <Container maxWidth='xl'>
        {children}
        <FirestoreRedux gameId={gameId} />
      </Container>
    )
  }
  return (
    <MapContext.Provider value={[mapOptions, changeMap]}>
      <BottomNav children={children} location={location} />
      <FirestoreRedux gameId={gameId} />
    </MapContext.Provider>
  )
}
export default Layout
