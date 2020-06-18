import React, { useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { makeStyles } from '@material-ui/core/styles'
import ButtonBase from '@material-ui/core/ButtonBase'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'

const useStyles = makeStyles((theme) => ({
  paperMargin: {
    margin: `${theme.spacing(1) / 2}px 0 ${theme.spacing(1) / 2}px 0`,
    borderRadius: '4px',
  },
  paperPadding: {
    padding: theme.spacing(1),
  },
  preserveLineBreak: {
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  texAreaMargin: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px 0 ${theme.spacing(1)}px`,
  },
  mainPaper: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1)}px 0 ${theme.spacing(1)}px`,
    padding: `${theme.spacing(1) / 2}px ${theme.spacing(1)}px ${theme.spacing(1) / 2}px ${theme.spacing(1)}px`,
  },
  marginTopRightLeft: {
    margin: `${theme.spacing(1)}px ${theme.spacing(1) / 2}px 0 ${theme.spacing(1) / 2}px`,
  },
  width100: {
    width: '100%',
  },
  redHover: {
    '&:hover svg': {
      fill: 'red !important',
    },
  },
}))

const CreateLog = () => {
  const classes = useStyles()
  const [newLogText, setNewLogText] = useState('')

  const handleNewLogTextChange = (event) => {
    setNewLogText(event.target.value)
  }

  const createLogInDb = (text) => {
    const newLogRef = firebase.firestore().collection('logbook').doc()
    const timeCreated = firebase.firestore.Timestamp.fromDate(new Date())
    const payload = { text: text, timeCreated: timeCreated }
    newLogRef.set(payload).catch((error) => {
      console.error('Error adding document: ', error)
    })
  }

  const handleBlur = () => {
    if (newLogText.trim().length) {
      createLogInDb(newLogText.trim())
      setNewLogText('')
    }
  }

  const enterPressed = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!newLogText.trim().length) return
      createLogInDb(newLogText.trim())
      setNewLogText('')
    }
  }

  return (
    <form noValidate autoComplete='off' className={classes.texAreaMargin}>
      <TextField label='Ajouter un log' placeholder={'Contenu du log...'} variant='outlined' fullWidth value={newLogText} multiline onChange={handleNewLogTextChange} onKeyDown={enterPressed} onBlur={handleBlur} />
    </form>
  )
}

const PaperEdit = ({ children, order }) => {
  const classes = useStyles()
  const evenColor = order % 2 === 0 ? '' : 'rgba(0, 0, 255, 0.025)'
  return (
    <Paper style={{ backgroundColor: evenColor }} className={`${classes.preserveLineBreak} ${classes.paperPadding} ${classes.width100}`}>
      {children}
    </Paper>
  )
}

const Log = ({ text, id, order = 0 }) => {
  const classes = useStyles()
  const [open, SetOpen] = useState(false)
  const [logText, setLogText] = useState(text)
  const [editText, setEditText] = useState(false)

  useEffect(() => {
    setLogText(text)
  }, [text])

  const getShortText = (text, maxCarac) => {
    const lineBreakPositiion = text.indexOf('\n')
    const firstLine = lineBreakPositiion === -1 ? text : text.substring(0, lineBreakPositiion)
    const dots = firstLine.length <= maxCarac ? '' : '...'
    return firstLine.substring(0, maxCarac).trim() + dots
  }

  const handleClick = () => {
    SetOpen(true)
  }

  const handleChange = (event) => {
    setLogText(event.target.value)
  }

  const handleClickAway = () => {
    editOff()
    SetOpen(false)
  }

  const Switchedit = () => {
    setEditText(!editText)
  }

  const editOff = () => {
    setEditText(false)
  }

  const deleteLog = () => {
    firebase
      .firestore()
      .collection(`logbook`)
      .doc(id)
      .delete()
      .catch((error) => {
        console.error('Error removing document: ', error)
      })
  }

  const handleBlur = () => {
    const timeUpdated = firebase.firestore.Timestamp.fromDate(new Date())
    const trimmed = logText.trim()
    setLogText(trimmed)
    firebase.firestore().collection(`logbook`).doc(id).update({
      text: trimmed,
      timeUpdated: timeUpdated,
    })
  }

  const editInput = editText ? (
    <TextField
      autoFocus // eslint-disable-line jsx-a11y/no-autofocus
      fullWidth
      multiline
      variant='outlined'
      label='Edit Text'
      value={logText}
      onBlur={handleBlur}
      onFocus={(e) => {
        const val = e.target.value
        e.target.value = ''
        e.target.value = val
      }}
      onChange={handleChange}
    />
  ) : (
    <Typography variant='body1'>{open ? logText : getShortText(text, 140)}</Typography>
  )

  const button = (
    <ButtonBase onClick={handleClick} focusRipple className={`${classes.paperMargin} ${classes.width100}`}>
      <PaperEdit order={order}>{editInput}</PaperEdit>
    </ButtonBase>
  )

  const edit = (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.paperMargin}>
        <PaperEdit order={order}>
          {editInput}
          <div style={{ textAlign: 'right' }}>
            <IconButton className={classes.marginTopRightLeft} onClick={Switchedit}>
              {editText ? <DoneIcon /> : <EditIcon />}
            </IconButton>
            <IconButton className={`${classes.marginTopRightLeft} ${classes.redHover}`} onClick={deleteLog}>
              <DeleteIcon />
            </IconButton>
          </div>
        </PaperEdit>
      </div>
    </ClickAwayListener>
  )

  return open ? edit : button
}

const LogBook = () => {
  const classes = useStyles()
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('logbook')
      .orderBy('timeCreated', 'desc')
      .onSnapshot((querySnapshot) => {
        const dataFromServer = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          dataFromServer.push({ ...data, id: doc.id })
        })
        setLogs(dataFromServer)
      })
    return unsubscribe
  }, [])

  return (
    <div>
      <CreateLog />
      <Paper variant='outlined' className={classes.mainPaper}>
        {logs.length
          ? logs.map(({ id, text }, key) => (
              <div key={id}>
                <Log order={key} text={text} id={id} />
              </div>
            ))
          : 'Loading...'}
      </Paper>
    </div>
  )
}

export default LogBook
