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

const useStyles = makeStyles({
  paper: {
    paddingBottom: 56,
  },
})

const BottomNav = ({ children, location }) => {
  const classes = useStyles()

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
          <BottomNavigationAction to={`/12345/${playerId}/players`} label='Players' value='players' icon={<FormatListBulletedIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/character`} label='Character' value='character' icon={<DescriptionIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/map`} label='Maps' value='map' icon={<RoomIcon />} />
          <BottomNavigationAction to={`/12345/${playerId}/dice`} label='Dice' value='dice' icon={<PlayArrowIcon />} />
        </BottomNavigation>
      </AppBar>
    </div>
  )
}

const Layout = ({ children, location, pageContext }) => {
  const [mapOptions, setMapOptions] = useState(null)

  const changeMap = (center, zoom) => {
    setMapOptions({ LngLat: center, zoom: zoom })
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`params`)
      .doc('mapCenter')
      .onSnapshot((querySnapshot) => {
        setMapOptions(querySnapshot.data())
      })
    return unsubscribe
  }, [])

  if (pageContext.layout === 'noLayout') {
    return <Container maxWidth='md'>{children}</Container>
  }
  if (pageContext.layout === 'admin') {
    return <Container maxWidth='xl'>{children}</Container>
  }
  return (
    <MapContext.Provider value={[mapOptions, changeMap]}>
      <BottomNav children={children} location={location} />
    </MapContext.Provider>
  )
}
export default Layout
