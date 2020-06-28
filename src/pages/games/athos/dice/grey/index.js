import React,{useEffect} from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { Button } from 'gatsby-theme-material-ui'

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

const GreyButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(grey[800]),
    backgroundColor: grey[800],
    '&:hover': {
      backgroundColor: grey[900],
    },
  },
}))(Button)

const DestinyDiceSelect = ({ location }) => {
  const playerId = location.pathname.split('/')[2]
  const classes = useStyles()
  const search = location.search

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

  return (
    <div className={classes.height100} >
      <div style={{height:'50%'}}>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/games/${playerId}/dice/grey/D2A/${search}`}>
          -2
        </GreyButton>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/games/${playerId}/dice/grey/D1/${search}`}>
          1
        </GreyButton>
      </div>
      <div style={{height:'50%'}}>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/games/${playerId}/dice/grey/D2/${search}`}>
          2
        </GreyButton>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/games/${playerId}/dice/grey/D3/${search}`}>
          3
        </GreyButton>
      </div>
    </div>
  )
}

export default DestinyDiceSelect
