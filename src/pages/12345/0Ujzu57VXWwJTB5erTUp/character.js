import React, { useReducer, useRef, useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'
import Paper from '@material-ui/core/Paper'
import Rating from '@material-ui/lab/Rating'
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied'
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied'
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
})

const StyledRating = withStyles({
  iconFilled: {
    color: '#e50000',
  },
  iconHover: {
    color: '#ff0000',
  },
  iconEmpty: {
    opacity: '0.2',
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
    icon: <SentimentSatisfiedIcon fontSize='large' />,
    label: 'Injured',
  },
  4: {
    icon: <SentimentVerySatisfiedIcon fontSize='large' />,
    label: 'Fine',
  },
}

const IconContainer = (props) => {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

const marks = [
  { value: 0, label: '0' },
  { value: 1 },
  { value: 2, label: '2' },
  { value: 3 },
  { value: 4, label: '4' },
  { value: 5 },
  { value: 6, label: '6' },
  { value: 7 },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
]
// find a way to include identification field without mnessing with render
const inputsFields = [
  { name: 'attributes', title: '' },
  { name: 'skills', title: 'Skills' },
  { name: 'perks', title: 'Traits' },
  { name: 'traumas', title: 'Traumas' },
  { name: 'notes', title: 'Notes' },
]

const Character = ({ location }) => {
  const classes = useStyles()
  const timer = useRef(null)
  const playerId = location.pathname.split('/')[2]
  const [reroll, setReroll] = useState(null)
  const [status, setStatus] = useState(null)
  const [statusText, setStatusText] = useState('')
  const [statusChip, setStatusChip] = useState([])

  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }), {
    identification: null,
    attributes: null,
    skills: null,
    perks: null,
    traumas: null,
    notes: null,
  })

  const handleChange = (evt) => {
    clearTimeout(timer.current)
    const name = evt.target.name
    const newValue = evt.target.value
    setUserInput({ [name]: newValue })
    timer.current = setTimeout(() => {
      firebase
        .firestore()
        .doc(`players/${playerId}`)
        .update({
          [name]: newValue,
        })
    }, 400)
  }

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot((doc) => {
        const data = doc.data()
        if (!doc.metadata.hasPendingWrites) {
          inputsFields.forEach((element) => {
            setUserInput({ [element.name]: doc.data()[element.name] })
          })
          setUserInput({ identification: doc.data().identification })
        }
        setReroll(data.reroll)
        setStatusChip(data.statusDesc)
        setStatus(data.status)
      })
    return unsubscribe
  }, [playerId])

  const handleRerollChange = (_, newValue) => {
    firebase.firestore().doc(`players/${playerId}`).update({
      reroll: newValue,
    })
  }
  const handleStatusChange = (event, newValue) => {
    if (newValue === null) return
    setStatus(newValue)
    firebase.firestore().doc(`players/${playerId}`).update({
      status: newValue,
    })
  }
  const handleStatusChipChange = (event, newValue) => {
    setStatusChip(newValue)
    setStatusText('')
    firebase.firestore().doc(`players/${playerId}`).update({ statusDesc: newValue })
  }
  const handleStatusTextChange = (event) => {
    setStatusText(event.target.value)
  }
  const handleStatusTextBlur = () => {
    if (!statusText) return
    setStatusChip([...statusChip, statusText])
    setStatusText('')
    firebase
      .firestore()
      .doc(`players/${playerId}`)
      .update({ statusDesc: [...statusChip, statusText] })
  }
  return (
    <Paper style={{ padding: '15px', margin: '5px 15px 5px 15px' }}>
      <form noValidate autoComplete='off'>
        <TextField name='identification' label='Id' multiline value={userInput.identification != null ? userInput.identification : '...'} onChange={handleChange} variant='outlined' className={classes.root} />
        <Typography id='discrete-slider-custom' gutterBottom style={{ marginTop: '10px' }}>
          Relances
        </Typography>
        <Slider value={reroll != null ? reroll : 5} onChange={handleRerollChange} aria-labelledby='discrete-slider-custom' step={1} valueLabelDisplay='auto' marks={marks} max={9} />
        {inputsFields.map((element, i) => {
          const value = userInput[element.name]
          return (
            <TextField
              key={i}
              name={element.name}
              label={element.title}
              multiline
              value={value != null ? value : '...'}
              onChange={handleChange}
              variant='outlined'
              className={classes.root}
              style={{ marginTop: '10px' }}
            />
          )
        })}
        <Autocomplete
          multiple
          id='tags-filled'
          style={{ marginTop: '10px' }}
          options={[]}
          value={statusChip}
          onChange={handleStatusChipChange}
          freeSolo
          renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant='outlined' label={option} {...getTagProps({ index })} />)}
          renderInput={(params) => <TextField value={statusText} onChange={handleStatusTextChange} onBlur={handleStatusTextBlur} variant='outlined' {...params} label='Etats' placeholder='Ajouter...' />}
        />
        <StyledRating
          name='customized-icons'
          max={4}
          value={status}
          style={{ marginTop: '10px' }}
          onChange={handleStatusChange}
          getLabelText={(value) => customIcons[value].label}
          IconContainerComponent={IconContainer}
        />
      </form>
    </Paper>
  )
}

export default Character
