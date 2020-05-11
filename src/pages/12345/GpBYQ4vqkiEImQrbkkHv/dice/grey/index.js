import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'
import { Button } from 'gatsby-theme-material-ui'

const useStyles = makeStyles({
  diceButton: {
    width: '50%',
    height: '300px',
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
  return (
    <div>
      <div>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/grey/D2A/`}>
          -2
        </GreyButton>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/grey/D1/`}>
          1
        </GreyButton>
      </div>
      <div>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/grey/D2/`}>
          2
        </GreyButton>
        <GreyButton className={classes.diceButton} disableElevation size='large' variant='contained' color='primary' to={`/12345/${playerId}/dice/grey/D3/`}>
          3
        </GreyButton>
      </div>
    </div>
  )
}

export default DestinyDiceSelect
