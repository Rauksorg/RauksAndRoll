import React, { useReducer, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import Grid from '@material-ui/core/Grid'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Chip from '@material-ui/core/Chip'
import Rating from '@material-ui/lab/Rating'

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
    icon: <SentimentVeryDissatisfiedIcon fontSize='large' />,
    label: 'Neutralized',
  },
  2: {
    icon: <SentimentDissatisfiedIcon fontSize='large' />,
    label: 'Badly Injured',
  },
  3: {
    icon: <SentimentVerySatisfiedIcon fontSize='large' />,
    label: 'Fine',
  },
}
const IconContainer = (props) => {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

const Sheet = ({ sheetId }) => {
  const classes = useStyles()
  const [reroll, setReroll] = useState(null)
  const [status, setStatus] = useState(null)
  const [statusChip, setStatusChip] = useState([])

  const [sheetField, setSheetField] = useReducer((state, newState) => ({ ...state, ...newState }), {
    identification: null,
    attributes: null,
    skills: null,
    perks: null,
    traumas: null,
    notes: null,
  })

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${sheetId}`)
      .onSnapshot((snapshot) => {
        const data = snapshot.data()
        setSheetField({
          identification: data.identification,
          attributes: data.attributes,
          skills: data.skills,
          perks: data.perks,
          traumas: data.traumas,
          notes: data.notes,
        })
        setReroll(data.reroll)
        setStatus(data.status)
        setStatusChip(data.statusDesc)
      })
    return unsubscribe
  }, [sheetId])
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Typography variant='h5'>{sheetField.identification != null ? sheetField.identification : 'Loading...'}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography style={{ textAlign: 'right' }} variant='h4'>
            {reroll != null ? reroll : '.'} <AutorenewIcon />
          </Typography>
        </Grid>
      </Grid>
      <Typography variant='body1' className={classes.preserveLineBreak}>
        {sheetField.attributes != null ? sheetField.attributes : 'Loading...'}
      </Typography>
      <Typography variant='h6'>Skills</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {sheetField.skills != null ? sheetField.skills : 'Loading...'}
      </Typography>
      <Typography variant='h6'>Traits</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {sheetField.perks != null ? sheetField.perks : 'Loading...'}
      </Typography>
      <Typography variant='h6'>Traumas</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {sheetField.traumas != null ? sheetField.traumas : 'Loading...'}
      </Typography>
      <Typography variant='h6'>Notes</Typography>
      <Typography variant='body2' className={classes.preserveLineBreak}>
        {sheetField.notes != null ? sheetField.notes : 'Loading...'}
      </Typography>
      <Typography variant='h6'>Etats</Typography>
      <div className={classes.chip}>
        {statusChip.map((item, index) => {
          return <Chip label={item} variant='outlined' />
        })}
      </div>
      <StyledRating readOnly name='customized-icons' max={3} value={status} IconContainerComponent={IconContainer} />
    </div>
  )
}

export default Sheet
