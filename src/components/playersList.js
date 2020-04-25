import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

// Fix listItemButton
import patchBaseButtonComponent from '../../node_modules/gatsby-theme-material-ui/src/utils/patch-base-button-components'
const ListItemPatched = patchBaseButtonComponent(ListItem)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

// Results structure
// const results = { NvysJ1bND6X1RONVG3Yu: { diceResult: "3", dice: "blue",rerolled:false } }

export default ({ location, players, results }) => {

  const playerId = location.pathname.split("/")[2]
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List >
        {players.map((player, key) => {
          const playerDice = results[player.id].dice
          const playerResult = results[player.id].diceResult
          const playerRerolled = results[player.id].rerolled
          return (
            <ListItemPatched key={key} button to={`/12345/${playerId}/players/${player.id}`}>
              <ListItemAvatar>
                <Avatar>G</Avatar>
              </ListItemAvatar>
              <ListItemText primary={player.name} />
              <ListItemSecondaryAction>
                <Avatar style={{ border: playerRerolled ? '2px dotted' : 'none', backgroundColor: playerDice ? playerDice : "grey" }}>{playerResult ? playerResult : "."}</Avatar>
              </ListItemSecondaryAction>
            </ListItemPatched>
          )
        })}
      </List>
    </div>
  );
}
