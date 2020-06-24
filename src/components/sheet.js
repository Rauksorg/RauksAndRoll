import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import Grid from '@material-ui/core/Grid'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Chip from '@material-ui/core/Chip'
import Rating from '@material-ui/lab/Rating'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
  chip: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}))

const StyledRating = withStyles({
  iconFilled: {
    color: '#e50000',
  },
  iconHover: {
    color: '#ff0000',
  },
  iconEmpty: {
    opacity: '0.1',
  },
})(Rating)

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon style={{ fontSize: 30 }} />,
    label: 'Neutralized',
  },
  2: {
    icon: <SentimentDissatisfiedIcon style={{ fontSize: 30 }} />,
    label: 'Badly Injured',
  },
  3: {
    icon: <SentimentVerySatisfiedIcon style={{ fontSize: 30 }} />,
    label: 'Fine',
  },
}
const IconContainer = (props) => {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

const Sheet = ({ sheetId }) => {
  const classes = useStyles()

  const playerSheet = useSelector((state) => state.playersList[sheetId])
  const loading = useSelector((state) => state.loading)

    return loading === 'idle' ? (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant='h5'>{playerSheet.identification}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography style={{ textAlign: 'right' }} variant='h4'>
            {playerSheet.reroll} <AutorenewIcon />
          </Typography>
        </Grid>
      </Grid>
      <Typography variant='body1' className={classes.preserveLineBreak}>
        {playerSheet.attributes}
      </Typography>
      <Typography variant='h6'>Skills</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {playerSheet.skills}
      </Typography>
      <Typography variant='h6'>Traits</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {playerSheet.perks}
      </Typography>
      <Typography variant='h6'>Traumas</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {playerSheet.traumas}
      </Typography>
      <Typography variant='h6'>Notes</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {playerSheet.notes}
      </Typography>
      <Typography variant='h6'>Etats</Typography>
      <div className={classes.chip}>
        {playerSheet.statusDesc.map((item, index) => {
          return <Chip key={index} label={item} variant='outlined' />
        })}
      </div>
      <StyledRating readOnly name='customized-icons' max={3} value={playerSheet.status} IconContainerComponent={IconContainer} />
    </div>
  ) : (
    'Loading...'
  )
}

export default Sheet
