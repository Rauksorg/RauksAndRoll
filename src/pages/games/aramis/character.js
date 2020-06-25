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
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Chip from '@material-ui/core/Chip'
import Autocomplete from '@material-ui/lab/Autocomplete'
import debounce from 'lodash/debounce'
import { useSelector, useDispatch } from 'react-redux'
import { modifyField } from '../../../state/configureStore'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  top10px: {
    marginTop: '10px',
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
  { field: 'attributes', title: '' },
  { field: 'skills', title: 'Skills' },
  { field: 'perks', title: 'Traits' },
  { field: 'traumas', title: 'Traumas' },
  { field: 'notes', title: 'Notes' },
]

const updateFieldInDb = debounce(
  // Can it goes in the reducer ?
  (gameId, playerId, field, value) => {
    console.log('deb')
    firebase
      .firestore()
      .doc(`games/${gameId}/players/${playerId}`)
      .update({
        [field]: value,
      })
  },
  500,
  { leading: false }
)

const CaracText = ({ title, field, gameId, playerId, style }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.playersList[playerId][field])

  const handleChange = (evt) => {
    const newValue = evt.target.value
    dispatch(modifyField({ value: newValue, field: field, playerId: playerId }))
    updateFieldInDb(gameId, playerId, field, newValue)
  }

  return <TextField label={title} multiline value={fieldValue} onChange={handleChange} variant='outlined' fullWidth />
}

const RerollSlider = ({ title, field, gameId, playerId }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.playersList[playerId][field])

  const handleChange = (_, newValue) => {
    if (fieldValue === newValue) return
    dispatch(modifyField({ value: newValue, field: field, playerId: playerId }))
    updateFieldInDb(gameId, playerId, field, newValue)
  }

  return (
    <React.Fragment>
      <Typography gutterBottom>{title}</Typography>
      <Slider value={fieldValue} onChange={handleChange} step={1} valueLabelDisplay='auto' marks={marks} max={9} />
    </React.Fragment>
  )
}

const StatusDesc = ({ title, field, gameId, playerId }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.playersList[playerId][field])

  // Not in redux only local state
  const [statusText, setStatusText] = useState('')
  const handleInputChange = (event) => {
    setStatusText(event.target.value)
  }

  const handleChange = (_, newValue) => {
    dispatch(modifyField({ value: newValue, field: field, playerId: playerId }))
    setStatusText('')
    firebase
      .firestore()
      .doc(`games/${gameId}/players/${playerId}`)
      .update({ [field]: newValue })
  }

  const handleBlur = () => {
    if (!statusText) return
    dispatch(modifyField({ value: [...fieldValue, statusText], field: field, playerId: playerId }))
    setStatusText('')
    firebase
      .firestore()
      .doc(`games/${gameId}/players/${playerId}`)
      .update({ [field]: [...fieldValue, statusText] })
  }

  return (
    <Autocomplete
      multiple
      id='tags-filled'
      style={{ marginTop: '10px' }}
      options={[]}
      value={fieldValue}
      onChange={handleChange}
      freeSolo
      renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant='outlined' label={option} {...getTagProps({ index })} />)}
      renderInput={(params) => <TextField value={statusText} onChange={handleInputChange} onBlur={handleBlur} variant='outlined' {...params} label={title} placeholder='Ajouter...' />}
    />
  )
}

const Character = ({ location }) => {
  const classes = useStyles()
  const loading = useSelector((state) => state.loading)
  const playerId = location.pathname.split('/')[2]
  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')
  return loading === 'idle' ? (
    <Paper style={{ padding: '15px', margin: '5px 15px 5px 15px' }}>
      <form noValidate autoComplete='off'>
        <CaracText title='Id' field='identification' playerId={playerId} gameId={gameId} />
        <div className={classes.top10px}>
          <RerollSlider title='Relances' field='reroll' playerId={playerId} gameId={gameId} />
        </div>
        {inputsFields.map((element) => (
          <div key={element.field} className={classes.top10px}>
            <CaracText title={element.title} field={element.field} playerId={playerId} gameId={gameId} />
          </div>
        ))}
        <StatusDesc title='Etats' field='statusDesc' playerId={playerId} gameId={gameId} />
      </form>
    </Paper>
  ) : (
    'Loading...'
  )
}

const CharacterOld = ({ location }) => {
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

  // underscor debounce
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
          max={3}
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
