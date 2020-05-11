import React, { useReducer, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, SkillIcon, NeutralIcon } from '../components/diceIcons'
import joseAltuve from '../images/joseAltuve.jpg'

// Fix listItemButton
import patchBaseButtonComponent from '../../node_modules/gatsby-theme-material-ui/src/utils/patch-base-button-components'
const ListItemPatched = patchBaseButtonComponent(ListItem)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}))

const avatarList= {GpBYQ4vqkiEImQrbkkHv:joseAltuve}

const ResultToFace = (props) => {
  const facesObject = { '✓': SuccessIcon, '2': TwoIcon, '3!': ThreeEpicIcon, '4': FourIcon, S: SkillIcon, '✘': FailIcon, '✘!': EpicFailIcon, '💀': FailIcon, '☯': NeutralIcon, '🍀': SuccessIcon, '💥': ExplosivIcon }
  const TagName = facesObject[props.result]
  return <TagName {...props} />
}

// Results structure
// const results = { NvysJ1bND6X1RONVG3Yu: { diceResult: "3", dice: "blue",rerolled:false } }

const PlayersList = ({ location, players, results }) => {
  const timer = useRef([])
  const [isNew, setIsnew] = useReducer((state, newState) => ({ ...state, ...newState }), {})
  const playerId = location.pathname.split('/')[2]
  const classes = useStyles()

  const setUpdate = (id, i) => {
    timer.current[i] = setTimeout(() => {
      setIsnew({ [id]: false })
      timer.current[i] = null
    }, 10000)
  }

  useEffect(() => {
    const obj = {}
    Object.keys(results).forEach((element, i) => {
      const timeNow = Date.now()
      const timeRolled = results[element].timeRolled
      const newlyRolled = timeNow - timeRolled < 10000 ? true : false
      obj[element] = newlyRolled
      if (newlyRolled) setUpdate(element, i)
    })
    setIsnew(obj)
    const timerToclean = [...timer.current]
    return () => {
      timerToclean.forEach((element) => {
        clearTimeout(element)
      })
    }
  }, [results])

  return (
    <div className={classes.root}>
      <List>
        {players.map((player, key) => {
          const playerDice = results[player.id].dice
          const playerResult = results[player.id].diceResult
          const playerRerolled = results[player.id].rerolled
          const playerIsNewRoll = isNew[player.id]
          return (
            <ListItemPatched key={key} button to={`/12345/${playerId}/players/${player.id}`}>
              <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
                <Avatar className={classes.large} src={avatarList[player.id]}>{player.name.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={player.name} />
              <ListItemSecondaryAction>
                <Badge color='primary' variant='dot' invisible={!playerIsNewRoll}>
                  <Avatar className={classes.large} style={{ border: playerRerolled ? '2px dotted' : 'none', backgroundColor: playerDice ? playerDice : 'grey' }}>
                    {playerResult ? <ResultToFace style={{ color: 'white', fontSize: 40 }} result={playerResult} /> : ''}
                  </Avatar>
                </Badge>
              </ListItemSecondaryAction>
            </ListItemPatched>
          )
        })}
      </List>
    </div>
  )
}

export default PlayersList
