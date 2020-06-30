import React, { useReducer, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import { EpicFailIcon, FailIcon, SuccessIcon, TwoIcon, FourIcon, ThreeEpicIcon, ExplosivIcon, SkillIcon, NeutralIcon, CloverIcon, SkullIcon, BrockenGlass } from '../components/diceIcons'
import jose from '../images/joseClose.jpg'
import beaurice from '../images/BeauriceClose.jpg'
import francis from '../images/FrancisClose.jpg'
import gameMaster1 from '../images/GameMasterClose.jpg'
import vihel from '../images/Vihel.png'
import song from '../images/Song.png'
import arakel from '../images/Arakel.png'
import gameMaster2 from '../images/GameMaster2.png'
import Divider from '@material-ui/core/Divider'

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

const avatar = (gameId, playerId) => {
  if (gameId === 'ljasPdwsI7BvnCo38TmJ') return { porthos: jose, athos: beaurice, aramis: francis, gameMaster: gameMaster1 }[playerId]
  if (gameId === 'NUDpmg1FZRp7fkha2Yvr') return { porthos: song, athos: arakel, aramis: vihel, gameMaster: gameMaster2 }[playerId]
}

const ResultToFace = (props) => {
  const facesObject = { '✓': SuccessIcon, '2': TwoIcon, '3!': ThreeEpicIcon, '4': FourIcon, S: SkillIcon, '✘': FailIcon, '✘!': EpicFailIcon, '💀': SkullIcon, '☯': NeutralIcon, '🍀': CloverIcon, '💥': ExplosivIcon }
  const TagName = facesObject[props.result]
  return <TagName {...props} />
}

const PlayersList = ({ location, results }) => {
  const timer = useRef([])
  const [isNew, setIsnew] = useReducer((state, newState) => ({ ...state, ...newState }), {})
  const playerId = location.pathname.split('/')[2]
  const search = location.search
  const urlParams = new URLSearchParams(search)
  const gameId = urlParams.get('g')

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

  const PlayerItem = ({ player }) => {
    const playerResult = results[player.id].diceResult
    const playerRerolled = results[player.id].rerolled
    const playerIsNewRoll = isNew[player.id]
    const playerDice = results[player.id].dice
    const injured = results[player.id].status < 3 ? false : true
    return (
      <ListItemPatched button to={`/games/${playerId}/players/${player.id}/${search}`}>
        <ListItemAvatar style={{ margin: '0px 5px 0px 0px' }}>
          <div style={{ position: 'relative' }}>
            <Avatar variant={player.id === 'gameMaster' ? 'rounded' : 'circle'} className={classes.large} src={avatar(gameId, player.id)}>
              {player.name.charAt(0)}
            </Avatar>
            {/* To add an image overlay on avatar */}
            {injured || <BrockenGlass style={{ fill: 'white', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, height: '100%', width: '100%', opacity: 1, borderRadius: '50%' }} />}
          </div>
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
  }

  return (
    <div className={classes.root}>
      <List>
        <PlayerItem player={{ name: results.gameMaster.identification, id: 'gameMaster' }} />
      </List>
      <Divider variant='inset' />
      <List>
        {Object.keys(results)
          .filter((id) => id !== 'gameMaster')
          .map((id) => {
            return <PlayerItem player={{ name: results[id].identification, id: id }} key={id} />
          })}
      </List>
    </div>
  )
}

export default PlayersList
