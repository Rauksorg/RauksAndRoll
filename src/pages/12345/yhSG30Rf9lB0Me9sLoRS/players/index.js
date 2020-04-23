import React from 'react';
import firebase from "gatsby-plugin-firebase";

import PlayersList from '../../../../components/playersList'


const players = [{ id: 'NvysJ1bND6X1RONVG3Yu', name: 'MJ' }, { id: '0Ujzu57VXWwJTB5erTUp', name: 'Günther Olsen' }, { id: 'GpBYQ4vqkiEImQrbkkHv', name: 'Arakel Sarif' }, { id: 'yhSG30Rf9lB0Me9sLoRS', name: 'Jean Test' }]
const nullResults = { 'NvysJ1bND6X1RONVG3Yu': { diceResult: null, dice: null }, '0Ujzu57VXWwJTB5erTUp': { diceResult: null, dice: null }, 'GpBYQ4vqkiEImQrbkkHv': { diceResult: null, dice: null }, 'yhSG30Rf9lB0Me9sLoRS': { diceResult: null, dice: null } }

export default function SimpleList({ location }) {

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
    <PlayersList location={location} players={players} results={results} />
  );
}