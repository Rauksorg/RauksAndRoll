import React,{useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { blue, orange, red, grey } from '@material-ui/core/colors'
import { Button } from 'gatsby-theme-material-ui'
import CasinoOutlinedIcon from '@material-ui/icons/CasinoOutlined'

const useStyles = makeStyles({
  diceButton: {
    width: '50%',
    height: '100%',
  },
  height100: {
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100 - 56px)',
  },
})

const BlueButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[600]),
    backgroundColor: blue[600],
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button)

const OrangeButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: orange[600],
    '&:hover': {
      backgroundColor: orange[700],
    },
  },
}))(Button)

const RedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[800],
    },
  },
}))(Button)

const GreyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: grey[900],
    },
  },
}))(Button)

const ActionDiceSelect = ({ location }) => {
  const playerId = location.pathname.split('/')[2]
  const classes = useStyles()

  const resize = () => {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={classes.height100}>
      <div style={{ height: '50%' }}>
        <BlueButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/blue/`}>
          <CasinoOutlinedIcon />
        </BlueButton>
        <OrangeButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/orange/`}>
          <CasinoOutlinedIcon />
        </OrangeButton>
      </div>
      <div style={{ height: '50%' }}>
        <RedButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/red/`}>
          <CasinoOutlinedIcon />
        </RedButton>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/grey/`}>
          <CasinoOutlinedIcon />
        </GreyButton>
      </div>
    </div>
  )
}

export default ActionDiceSelect
