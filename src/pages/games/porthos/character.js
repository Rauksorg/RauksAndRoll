import React, { useState } from 'react'
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
import { useSelector, useDispatch } from 'react-redux'
import { modifyFieldDb, modifyFieldDbDebounced } from '../../../state/playersSlice'

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

const inputsFields = [
  { field: 'attributes', title: '' },
  { field: 'skills', title: 'Skills' },
  { field: 'perks', title: 'Traits' },
  { field: 'traumas', title: 'Traumas' },
  { field: 'notes', title: 'Notes' },
]

const CaracText = ({ title, field, gameId, playerId }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.players.playersList[playerId][field])

  const handleChange = (evt) => {
    const newValue = evt.target.value
    dispatch(modifyFieldDbDebounced({ value: newValue, field: field, playerId: playerId, gameId: gameId }))
  }

  return <TextField label={title} multiline value={fieldValue} onChange={handleChange} variant='outlined' fullWidth />
}

const RerollSlider = ({ title, field, gameId, playerId }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.players.playersList[playerId][field])

  const handleChange = (_, newValue) => {
    if (fieldValue === newValue) return
    dispatch(modifyFieldDbDebounced({ value: newValue, field: field, playerId: playerId, gameId: gameId }))
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
  const fieldValue = useSelector((state) => state.players.playersList[playerId][field])

  const [statusText, setStatusText] = useState('')
  const handleInputChange = (event) => {
    setStatusText(event.target.value)
  }

  const handleChange = (_, newValue) => {
    dispatch(modifyFieldDb({ value: newValue, field: field, playerId: playerId, gameId: gameId }))
    setStatusText('')
  }

  const handleBlur = () => {
    if (!statusText) return
    dispatch(modifyFieldDb({ value: [...fieldValue, statusText], field: field, playerId: playerId, gameId: gameId }))
    setStatusText('')
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

const Status = ({ field, gameId, playerId }) => {
  const dispatch = useDispatch()
  const fieldValue = useSelector((state) => state.players.playersList[playerId][field])

  const handleChange = (_, newValue) => {
    if (newValue === null) return
    dispatch(modifyFieldDbDebounced({ value: newValue, field: field, playerId: playerId, gameId: gameId }))
  }

  return <StyledRating name='customized-icons' max={3} value={fieldValue} onChange={handleChange} getLabelText={(value) => customIcons[value].label} IconContainerComponent={IconContainer} />
}

const Character = ({ location }) => {
  const classes = useStyles()
  const loading = useSelector((state) => state.players.loading)
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
        <div className={classes.top10px}>
          <Status field='status' playerId={playerId} gameId={gameId} />
        </div>
      </form>
    </Paper>
  ) : (
    'Loading...'
  )
}

export default Character
