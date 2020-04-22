import React from 'react';
import firebase from "gatsby-plugin-firebase";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

// Fix listItemButton
import patchBaseButtonComponent from '../../../../../node_modules/gatsby-theme-material-ui/src/utils/patch-base-button-components'
const ListItemPatched = patchBaseButtonComponent(ListItem)

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));
// const playersIdList = ['NvysJ1bND6X1RONVG3Yu', '0Ujzu57VXWwJTB5erTUp', 'GpBYQ4vqkiEImQrbkkHv', 'yhSG30Rf9lB0Me9sLoRS']

export default function SimpleList({ location }) {
  const playerId = location.pathname.split("/")[2]
  const classes = useStyles();

  const [data, setData] = React.useState({ dice: null, diceResult: null })
  React.useEffect(() => {

    const unsubscribe = firebase
      .firestore()
      .collection(`players`)
      .onSnapshot(querySnapshot => {
        var playersList = {};
        querySnapshot.forEach(function (doc) {
          playersList[doc.id] = doc.data()
        });
        setData({ diceResult: playersList.NvysJ1bND6X1RONVG3Yu.diceResult, dice: playersList.NvysJ1bND6X1RONVG3Yu.dice })
      });
    return unsubscribe;
  }, [])

  return (
    <div className={classes.root}>
      <List >
        <ListItemPatched button to={`/12345/${playerId}/players/NvysJ1bND6X1RONVG3Yu/`}>
          <ListItemAvatar>
            <Avatar>G</Avatar>
          </ListItemAvatar>
          <ListItemText primary="Günther Olsen" />
          <ListItemSecondaryAction>
            <Avatar style={{ backgroundColor: data.dice ? data.dice : "grey" }}>{data.diceResult ? data.diceResult : "."}</Avatar>
          </ListItemSecondaryAction>
        </ListItemPatched>
      </List>
    </div>
  );
}