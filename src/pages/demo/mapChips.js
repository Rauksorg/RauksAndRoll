import React, { useState, useRef, useEffect } from 'react'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import InputAdornment from '@material-ui/core/InputAdornment'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}))

const ColorSelect = ({ markerId, color = 'blue' }) => {
  const classes = useStyles()
  const [menuColor, setMenuColor] = useState(color)

  const handleChange = (event) => {
    const color = event.target.value
    // const name = event.target.name
    setMenuColor(color)
  }

  useEffect(() => {
    setMenuColor(color)
  }, [color])

  return (
    <Select value={menuColor} onChange={handleChange} name={markerId}>
      <MenuItem value={'blue'}>
        <Avatar style={{ backgroundColor: 'blue' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
      <MenuItem value={'orange'}>
        <Avatar style={{ backgroundColor: 'orange' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
      <MenuItem value={'green'}>
        <Avatar style={{ backgroundColor: 'green' }} className={classes.small}>
          {' '}
        </Avatar>
      </MenuItem>
    </Select>
  )
}

const EditableChip = (props) => {
  const { label = '', ...other } = props
  const [statusText, setStatusText] = useState(label)
  const [statusTextWidth, setStatusTextWidth] = useState('')
  const [editing, setEditing] = useState(false)

  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus()
    }
    return [htmlElRef, setFocus]
  }
  const [inputRef, setInputFocus] = useFocus()

  const handleChange = (event) => {
    // const name = event.target.name
    const newValue = event.target.value
    setStatusText(newValue)
  }
  const clicked = () => {
    setEditing(true)
  }
  const handleClickAway = () => {
    setEditing(false)
  }

  const enterPressed = (event) => {
    if (event.key === 'Enter') {
      setEditing(false)
    }
  }
  useEffect(() => {
    // trick to set focus to the input
    if (editing) setInputFocus()
    // add a way to apply only once at changes ?
  }, [editing, setInputFocus])

  useEffect(() => {
    setStatusTextWidth(statusText.length * 0.5 + 7 + 'em')
  }, [statusText])

  const myChip = <Chip label={statusText} onClick={clicked} {...other} />
  const myText = (
    <ClickAwayListener mouseEvent='onMouseDown' touchEvent='onTouchStart' onClickAway={handleClickAway}>
      <Input
        inputRef={inputRef}
        name='chip'
        style={{ width: statusTextWidth, maxWidth: '500px' }}
        value={statusText}
        disableUnderline={true}
        onKeyDown={enterPressed}
        onChange={handleChange}
        startAdornment={
          <InputAdornment position='start'>
            <ColorSelect />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position='end'>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </ClickAwayListener>
  )
  return editing ? myText : myChip
}

const EditChip = () => {
  return (
    <div>
      <Paper variant='outlined' style={{ margin: '10px 0px 10px 0px', padding: '10px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, left: 12, backgroundColor: 'white' }}>Hello</div>
        <Grid container spacing={1} alignItems='flex-end'>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <EditableChip variant='outlined' label={'test'} />
          </Grid>
          <Grid item>
            <Input id='input-with-icon-grid' label='With a grid' disableUnderline={true} placeholder='Ajouter...' />
          </Grid>
        </Grid>
      </Paper>

      <TextField
        variant='outlined'
        label='Etats'
        multiline={true}
        placeholder='Ajouter...'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <EditableChip variant='outlined' label={'test'} />
              <EditableChip variant='outlined' label={'test'} />
              <EditableChip variant='outlined' label={'test'} />
              <EditableChip variant='outlined' label={'test'} />
            </InputAdornment>
          ),
        }}
      />
    </div>
  )
}

export default EditChip
