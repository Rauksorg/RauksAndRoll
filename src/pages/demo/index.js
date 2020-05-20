import React, { useState, useRef, useEffect } from 'react'
import Chip from '@material-ui/core/Chip'
import Input from '@material-ui/core/Input'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'

const EditableChip = (props) => {
  const { label = '', ...other } = props
  const [statusText, setStatusText] = useState(label)
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
  const blured = () => {
    setEditing(false)
  }
  useEffect(() => {
    // trick to set focus to the input
    setInputFocus()
  }, [editing, setInputFocus])

  const myChip = <Chip label={statusText} onClick={clicked} {...other}  />
  const myText = (
    <FormControl>
      <Input inputRef={inputRef} name='chip' value={statusText} onChange={handleChange} onBlur={blured} />
    </FormControl>
  )
  return editing ? myText : myChip
}

const EditChip = () => {
  return (
    <div>
      <Autocomplete
        multiple
        autoSelect
        disableClearable
        id='tags-filled'
        style={{ marginTop: '10px' }}
        options={[]}
        freeSolo
        renderTags={(value, getTagProps) => value.map((option, index) => <EditableChip variant='outlined' label={option} {...getTagProps({ index })} />)}
        renderInput={(params) => <TextField variant='outlined' {...params} label='Etats' placeholder='Ajouter...' />}
      />
      <EditableChip label={'hello'} />
      <EditableChip />
    </div>
  )
}

export default EditChip
