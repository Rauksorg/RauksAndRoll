import React from 'react';
import firebase from "gatsby-plugin-firebase";
import Paper from '@material-ui/core/Paper';

import PlayersList from '../../../../components/playersList'
import Sheet from '../../../../components/sheet'

import { players } from '../../index'

const nullResults = { 'NvysJ1bND6X1RONVG3Yu': { diceResult: null, dice: null }, '0Ujzu57VXWwJTB5erTUp': { diceResult: null, dice: null }, 'GpBYQ4vqkiEImQrbkkHv': { diceResult: null, dice: null }, 'yhSG30Rf9lB0Me9sLoRS': { diceResult: null, dice: null } }

export default function SimpleList({ location }) {
  const sheetId = location.pathname.split("/")[2]

  const [results, setResults] = React.useState(nullResults)
  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`players`)
      .onSnapshot(querySnapshot => {
        const playersList = {};
        querySnapshot.forEach((doc) => {
          playersList[doc.id] = doc.data()
        });
        setResults(playersList)
      });
    return unsubscribe;
  }, [])

  return (
    <div>
      <Paper style={{ marginBottom: '10px', marginTop: '5px' }}>
        <PlayersList location={location} players={players} results={results} />
      </Paper>
      <Paper style={{ padding: '10px' }}>
        <Sheet sheetId={sheetId} />
      </Paper>
    </div>

  );
}