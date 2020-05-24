import React, { useReducer, useEffect, useState } from 'react'
import firebase from 'gatsby-plugin-firebase'
import Fab from '@material-ui/core/Fab'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import IconButton from '@material-ui/core/IconButton'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, SkillIcon, NeutralIcon, SkullIcon, CloverIcon } from '../components/diceIcons'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  preserveLineBreak: {
    whiteSpace: 'pre-line',
  },
  height100: {
    // height: '100vh', /* Fallback for browsers that do not support Custom Properties */
    height: 'calc(var(--vh, 1vh) * 100 - 56px)',
  },
  center: {
    position: 'absolute',
    top: 'calc(50% - 56px)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  centerRR: {
    position: 'absolute',
    bottom: '50px',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}))

const ResultToFace = (props) => {
  const facesObject = { '✓': SuccessIcon, '2': TwoIcon, '3!': ThreeEpicIcon, '4': FourIcon, S: SkillIcon, '✘': FailIcon, '✘!': EpicFailIcon, '💀': SkullIcon, '☯': NeutralIcon, '🍀': CloverIcon, '💥': ExplosivIcon }
  const TagName = facesObject[props.result]
  return <TagName {...props} />
}

const RerollButon = ({ clickFunc, rerollNumber }) => (
  <Fab onClick={clickFunc}>
    <AutorenewIcon />
    <div>{rerollNumber != null ? rerollNumber : '.'}</div>
  </Fab>
)

const Dice = ({ diceFormula, diceProperties, location, rerollable = true }) => {
  const classes = useStyles()
  const playerId = location.pathname.split('/')[2]
  const [result, setResult] = useState(diceFormula())
  const [reroll, setReroll] = useState(null)
  const [rerolled, setRerolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [sheetField, setSheetField] = useReducer((state, newState) => ({ ...state, ...newState }), {
    attributes: null,
    skills: null,
    perks: null,
  })

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .doc(`players/${playerId}`)
      .onSnapshot((doc) => {
        const data = doc.data()
        setReroll(data.reroll)
        setSheetField({
          attributes: data.attributes,
          skills: data.skills,
          perks: data.perks,
        })
      })
    return unsubscribe
  }, [playerId])

  useEffect(() => {
    firebase.firestore().doc(`players/${playerId}`).update({
      diceResult: result,
      dice: diceProperties.color,
      rerolled: rerolled,
      timeRolled: Date.now(),
    })
  }, [playerId, rerolled, result, diceProperties.color])

  useEffect(() => {
    firebase
      .firestore()
      .collection('dicesLogs')
      .add({
        playerId: playerId,
        diceResult: result,
        dice: diceProperties.color,
        rerolled: rerolled,
        timeRolled: Date.now(),
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
      })
  }, [playerId, rerolled, result, diceProperties.color])

  const rerollDice = () => {
    if (reroll > 0) {
      const newRerollCount = reroll - 1
      const newResult = diceFormula()
      setResult(newResult)
      setReroll(newRerollCount)
      setRerolled(true)
      // try to find a better way to update reroll in one call ?
      firebase.firestore().doc(`players/${playerId}`).update({ reroll: newRerollCount })
    }
  }

  const body = (
    <div className={classes.paper}>
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
    </div>
  )

  return (
    <div className={classes.height100} style={{ backgroundColor: diceProperties.color }}>
      <IconButton size='small' onClick={handleOpen} style={{ color: 'white' }}>
        <AccountCircleIcon />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        {body}
      </Modal>
      <ResultToFace className={classes.center} style={{ color: 'white', fontSize: 350 }} result={result} />
      <div className={classes.centerRR}>{rerollable && <RerollButon clickFunc={rerollDice} rerollNumber={reroll} />}</div>
    </div>
  )
}

export default Dice
