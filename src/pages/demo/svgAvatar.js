import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
// import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
// import imageJpg from '../../images/FrancisClose.jpg'
import imageSVGBandW from '../../images/Francis.svg'
import arakelSvg from '../../images/Arakel.svg'
import arakel from '../../images/Arakel.png'
import arakelBW from '../../images/ArakelBW.png'

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  imageOutline: {
    filter: 'drop-shadow(5px 5px 5px black) drop-shadow(-3px -3px 3px black)',
  },
  imageOutline2: {
    filter: 'drop-shadow(2px 0px 0 black) drop-shadow(-2px 0px 0 black)',
  },
  blended: {
    borderRadius: '50%',
    backgroundImage: `url(${arakelBW})`,
    backgroundColor: '#790081',
    backgroundBlendMode: 'hard-light',
    backgroundSize: 'cover',
    filter: 'drop-shadow(3px 3px 10px black) drop-shadow(-2px -2px 10px black)',
  },
}))

const SvgAvatar = () => {
  const classes = useStyles()
  return (
    <div>
      {/* <div style={{ backgroundImage: `url(${imageSVGBandW})`, width: '500px', height: '500px', backgroundColor: '#eb0000', backgroundBlendMode: 'hard-light' }}></div> */}
      <List>
        <ListItem button>
          <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
            <div style={{ position: 'relative' }}>
              <Avatar className={classes.large} src={imageSVGBandW} imgProps={{ style: { filter: 'drop-shadow(2px 2px 2px black) drop-shadow(-1px -1px 1px black)' } }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#eb0000', mixBlendMode: 'overlay' }} />
            </div>
          </ListItemAvatar>
          <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
            <div style={{ position: 'relative' }}>
              <Avatar className={classes.large} src={arakelBW} imgProps={{ style: { backgroundColor: '#790081', filter: 'drop-shadow(3px 3px 10px black) drop-shadow(-2px -2px 10px black)' } }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#790081', mixBlendMode: 'overlay' }} />
            </div>
          </ListItemAvatar>
          <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
            <div style={{ position: 'relative' }}>
              <Avatar className={classes.large} src={arakelBW}>
                ABC
              </Avatar>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#790081', mixBlendMode: 'overlay' }} />
            </div>
          </ListItemAvatar>
        </ListItem>
        <ListItem button>
          <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
            <div style={{ position: 'relative' }}>
              <Avatar className={classes.large} src={arakel} />
            </div>
          </ListItemAvatar>
        </ListItem>
      </List>
      <div>
        <div style={{ width: '288px', height: '288px', position: 'absolute', backgroundColor: '#eb0000' }} />
        <img alt='test' className={classes.imageOutline} src={arakelSvg} style={{ width: '288px', height: '288px', mixBlendMode: 'hard-light' }} />
      </div>
      <img alt='test' src={arakel} />
      <div >
        <div style={{ width: '56px', height: '56px', position: 'absolute', backgroundColor: '#790081',borderRadius: '50%' }} />
        <img alt='test' className={classes.imageOutline2} src={arakelBW} style={{ width: '56px', height: '56px', mixBlendMode: 'hard-light',borderRadius: '50%' }} />
      </div>
      <div style={{ width: '288px', height: '288px' }} className={classes.blended} />
    </div>
  )
}

export default SvgAvatar
